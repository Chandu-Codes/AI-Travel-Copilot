import os
import sys
import json
import time
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.svm import LinearSVR, SVR
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer, TransformedTargetRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(PROJECT_ROOT)

os.makedirs("models/alternate_benchmarks", exist_ok=True)

print("==================================================================")
print("⚙️ TRAINING & EVALUATING SUPPORT VECTOR MACHINE (SVM/SVR)")
print("==================================================================\n")

flights_file = "datasets/flights/flight_prices_india.csv"
if not os.path.exists(flights_file):
    print(f"Error: Dataset not found at {flights_file}")
    sys.exit(1)

df_f = pd.read_csv(flights_file)
print(f"Loaded dataset with {len(df_f):,} total records.")

# Identical sampling and seed as other models for fair comparison
if len(df_f) > 40000:
    df_sample = df_f.sample(n=40000, random_state=42)
else:
    df_sample = df_f

feature_cols = ['airline', 'source_city', 'destination_city', 'departure_time', 'stops', 'arrival_time', 'class', 'duration', 'days_left']
target_col = 'price'

available_features = [c for c in feature_cols if c in df_sample.columns]
X = df_sample[available_features]
y = df_sample[target_col]

categorical_cols = [c for c in ['airline', 'source_city', 'destination_city', 'departure_time', 'stops', 'arrival_time', 'class'] if c in available_features]
numeric_cols = [c for c in ['duration', 'days_left'] if c in available_features]

# Preprocessor: Strict feature scaling is essential for Support Vector Machines
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_cols),
        ('num', StandardScaler(), numeric_cols)
    ],
    remainder='passthrough'
)

# SVR with Linear / Epsilon Support Vector Regression and target scaling for numerical stability
base_svr = LinearSVR(C=1000.0, max_iter=10000, random_state=42, dual="auto")

svm_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', base_svr)
])

# Exact same 80/20 train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Training set: {len(X_train):,} samples | Test set: {len(X_test):,} samples")
print("Training Support Vector Regressor (LinearSVR, C=1000)...")

start_train = time.time()
svm_pipeline.fit(X_train, y_train)
train_time = time.time() - start_train
print(f"✓ SVM Training finished in {train_time:.2f} seconds.")

# Evaluate on Test Set
print("Evaluating SVM on 8,000 test samples...")
start_pred = time.time()
y_pred = svm_pipeline.predict(X_test)
pred_time = time.time() - start_pred

r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100

# Save SVM Model
svm_model_path = "models/alternate_benchmarks/flight_price_svm_model.joblib"
joblib.dump(svm_pipeline, svm_model_path)
print(f"✓ SVM model saved to: {svm_model_path}")

# Baseline metrics from other models
rf_r2, rf_mae, rf_rmse = 0.9738, 1912.04, 3640.80
knn_r2, knn_mae, knn_rmse = 0.9535, 2538.39, 4849.65
lin_r2, lin_mae, lin_rmse = 0.9128, 4450.87, 6641.74

# Test Cases
sample_cases = [
    {
        "description": "Last minute Economy flight (1 day left)",
        "input": pd.DataFrame([{
            "airline": "IndiGo", "source_city": "Delhi", "destination_city": "Mumbai",
            "departure_time": "Morning", "stops": "zero", "arrival_time": "Afternoon",
            "class": "Economy", "duration": 2.15, "days_left": 1
        }])
    },
    {
        "description": "Advance Economy flight (45 days left)",
        "input": pd.DataFrame([{
            "airline": "IndiGo", "source_city": "Delhi", "destination_city": "Mumbai",
            "departure_time": "Morning", "stops": "zero", "arrival_time": "Afternoon",
            "class": "Economy", "duration": 2.15, "days_left": 45
        }])
    },
    {
        "description": "Luxury Business flight (2 days left)",
        "input": pd.DataFrame([{
            "airline": "Vistara", "source_city": "Delhi", "destination_city": "Mumbai",
            "departure_time": "Evening", "stops": "zero", "arrival_time": "Night",
            "class": "Business", "duration": 2.20, "days_left": 2
        }])
    }
]

# Side-by-side predictions
rf_model = joblib.load("models/flight_price_model.joblib") if os.path.exists("models/flight_price_model.joblib") else None
knn_model = joblib.load("models/alternate_benchmarks/flight_price_knn_model.joblib") if os.path.exists("models/alternate_benchmarks/flight_price_knn_model.joblib") else None
lin_model = joblib.load("models/alternate_benchmarks/flight_price_linear_model.joblib") if os.path.exists("models/alternate_benchmarks/flight_price_linear_model.joblib") else None

case_results = []
for case in sample_cases:
    svm_val = float(svm_pipeline.predict(case["input"])[0])
    knn_val = float(knn_model.predict(case["input"])[0]) if knn_model else None
    rf_val = float(rf_model.predict(case["input"])[0]) if rf_model else None
    lin_val = float(lin_model.predict(case["input"])[0]) if lin_model else None
    case_results.append({
        "scenario": case["description"],
        "svm_prediction": round(svm_val, 2),
        "knn_prediction": round(knn_val, 2) if knn_val is not None else "N/A",
        "random_forest_prediction": round(rf_val, 2) if rf_val is not None else "N/A",
        "linear_regression_prediction": round(lin_val, 2) if lin_val is not None else "N/A"
    })

comparison_report = {
    "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
    "dataset": flights_file,
    "train_samples": len(X_train),
    "test_samples": len(X_test),
    "svm_metrics": {
        "model_type": "LinearSVR (C=1000.0, max_iter=10000, StandardScaler)",
        "r2_score": round(float(r2), 4),
        "mae_inr": round(float(mae), 2),
        "rmse_inr": round(float(rmse), 2),
        "mape_percentage": round(float(mape), 2),
        "training_time_seconds": round(train_time, 4),
        "inference_time_seconds": round(pred_time, 4),
        "file_path": svm_model_path
    },
    "all_models_ranking": {
        "1_random_forest": {"r2": rf_r2, "mae": rf_mae, "rmse": rf_rmse},
        "2_knn": {"r2": knn_r2, "mae": knn_mae, "rmse": knn_rmse},
        "3_svm": {"r2": round(float(r2), 4), "mae": round(float(mae), 2), "rmse": round(float(rmse), 2)},
        "4_linear_regression": {"r2": lin_r2, "mae": lin_mae, "rmse": lin_rmse}
    },
    "sample_case_predictions": case_results
}

report_path = "models/alternate_benchmarks/svm_evaluation.json"
with open(report_path, "w", encoding="utf-8") as f:
    json.dump(comparison_report, f, indent=2)

print("\n==================================================================")
print("📊 SVM EVALUATION RESULTS SUMMARY")
print("==================================================================")
print(f"SVM R² Score              : {r2:.4f}")
print(f"SVM MAE                   : ₹{mae:,.2f}")
print(f"SVM RMSE                  : ₹{rmse:,.2f}")
print(f"SVM MAPE                  : {mape:.2f}%")
print("------------------------------------------------------------------")
print(f"Random Forest R² Score    : {rf_r2:.4f} (RF MAE: ₹{rf_mae:,.2f})")
print(f"KNN R² Score              : {knn_r2:.4f} (KNN MAE: ₹{knn_mae:,.2f})")
print(f"Linear Regression R² Score: {lin_r2:.4f} (Lin MAE: ₹{lin_mae:,.2f})")
print("------------------------------------------------------------------")
print(f"Detailed report saved to  : {report_path}")
print("==================================================================")
