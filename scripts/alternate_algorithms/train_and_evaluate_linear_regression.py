import os
import sys
import json
import time
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(PROJECT_ROOT)

os.makedirs("models/alternate_benchmarks", exist_ok=True)

print("==================================================================")
print("📊 TRAINING & EVALUATING LINEAR REGRESSION FOR FLIGHT PRICES")
print("==================================================================\n")

flights_file = "datasets/flights/flight_prices_india.csv"
if not os.path.exists(flights_file):
    print(f"Error: Dataset not found at {flights_file}")
    sys.exit(1)

df_f = pd.read_csv(flights_file)
print(f"Loaded dataset with {len(df_f):,} total records.")

# Use identical sampling and random seed as train_all_models.py for fair comparison
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

# Preprocessor for Linear Regression (One-Hot Encoding categorical features)
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_cols),
        ('num', StandardScaler(), numeric_cols)
    ],
    remainder='passthrough'
)

linear_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', LinearRegression())
])

# Exact same 80/20 train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Training set: {len(X_train):,} samples | Test set: {len(X_test):,} samples")
print("Training Linear Regression model...")

start_train = time.time()
linear_pipeline.fit(X_train, y_train)
train_time = time.time() - start_train

# Evaluate on Test Set
start_pred = time.time()
y_pred = linear_pipeline.predict(X_test)
pred_time = time.time() - start_pred

r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

# Mean Absolute Percentage Error (MAPE)
mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100

# Save Linear Regression Model
linear_model_path = "models/alternate_benchmarks/flight_price_linear_model.joblib"
joblib.dump(linear_pipeline, linear_model_path)
print(f"✓ Linear Regression model saved to: {linear_model_path}")

# Load Random Forest evaluation metrics from evaluation_report.json if available
rf_r2, rf_mae, rf_rmse = 0.9738, 1912.04, 3640.80
eval_path = "models/evaluation_report.json"
if os.path.exists(eval_path):
    try:
        with open(eval_path, "r", encoding="utf-8") as f:
            rep = json.load(f)
            rf_info = rep.get("models", {}).get("flight_price_predictor", {})
            rf_r2 = rf_info.get("r2_score", rf_r2)
            rf_mae = rf_info.get("mae_inr", rf_mae)
            rf_rmse = rf_info.get("rmse_inr", rf_rmse)
    except Exception:
        pass

# Check extreme cases and negative price predictions
num_negative_preds = int(np.sum(y_pred < 0))
min_pred = float(np.min(y_pred))
max_pred = float(np.max(y_pred))

# Sample Test Case Comparison
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

# Load RF model if available for side-by-side test case comparison
rf_model_path = "models/flight_price_model.joblib"
rf_model = None
if os.path.exists(rf_model_path):
    try:
        rf_model = joblib.load(rf_model_path)
    except Exception:
        pass

case_results = []
for case in sample_cases:
    lin_val = float(linear_pipeline.predict(case["input"])[0])
    rf_val = float(rf_model.predict(case["input"])[0]) if rf_model else None
    case_results.append({
        "scenario": case["description"],
        "linear_regression_prediction": round(lin_val, 2),
        "random_forest_prediction": round(rf_val, 2) if rf_val is not None else "N/A"
    })

comparison_report = {
    "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
    "dataset": flights_file,
    "train_samples": len(X_train),
    "test_samples": len(X_test),
    "linear_regression_metrics": {
        "model_type": "LinearRegression (with OneHotEncoder & StandardScaler)",
        "r2_score": round(float(r2), 4),
        "mae_inr": round(float(mae), 2),
        "rmse_inr": round(float(rmse), 2),
        "mape_percentage": round(float(mape), 2),
        "training_time_seconds": round(train_time, 4),
        "inference_time_seconds": round(pred_time, 4),
        "negative_predictions_count": num_negative_preds,
        "min_predicted_price": round(min_pred, 2),
        "max_predicted_price": round(max_pred, 2),
        "file_path": linear_model_path
    },
    "random_forest_metrics": {
        "model_type": "RandomForestRegressor (60 trees, max_depth=16)",
        "r2_score": rf_r2,
        "mae_inr": rf_mae,
        "rmse_inr": rf_rmse,
        "file_path": "models/flight_price_model.joblib"
    },
    "performance_gap": {
        "r2_difference": round(float(rf_r2 - r2), 4),
        "mae_error_reduction_inr": round(float(mae - rf_mae), 2),
        "mae_error_percentage_improvement": round(float((mae - rf_mae) / mae * 100), 2),
        "rmse_error_reduction_inr": round(float(rmse - rf_rmse), 2)
    },
    "sample_case_predictions": case_results
}

report_path = "models/alternate_benchmarks/linear_regression_evaluation.json"
with open(report_path, "w", encoding="utf-8") as f:
    json.dump(comparison_report, f, indent=2)

print("\n==================================================================")
print("📊 EVALUATION RESULTS SUMMARY")
print("==================================================================")
print(f"Linear Regression R² Score : {r2:.4f}")
print(f"Linear Regression MAE      : ₹{mae:,.2f}")
print(f"Linear Regression RMSE     : ₹{rmse:,.2f}")
print(f"Linear Regression MAPE     : {mape:.2f}%")
print(f"Random Forest R² Score     : {rf_r2:.4f}")
print(f"Random Forest MAE          : ₹{rf_mae:,.2f}")
print(f"Random Forest RMSE         : ₹{rf_rmse:,.2f}")
print("------------------------------------------------------------------")
print(f"Error Reduction with RF    : ₹{mae - rf_mae:,.2f} lower MAE ({(mae - rf_mae)/mae*100:.1f}% error reduction)")
print(f"Detailed report saved to   : {report_path}")
print("==================================================================")
