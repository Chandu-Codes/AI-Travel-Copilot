import os
import sys
import json
import time
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import CategoricalNB, MultinomialNB, GaussianNB
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, classification_report

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(PROJECT_ROOT)

os.makedirs("models/alternate_benchmarks", exist_ok=True)

print("==================================================================")
print("📊 TRAINING & EVALUATING NAIVE BAYES (DELAY RISK)")
print("==================================================================\n")

# Recreate exact dataset with identical seed
np.random.seed(42)
delay_samples = 15000
airlines = ['IndiGo', 'Air India', 'Vistara', 'SpiceJet', 'AirAsia', 'Go First']
times = ['Early_Morning', 'Morning', 'Afternoon', 'Evening', 'Night', 'Late_Night']
routes = ['DEL-GOI', 'BOM-GOI', 'BLR-GOI', 'DEL-JAI', 'BOM-JAI', 'BLR-COK', 'DEL-DXB', 'BOM-MLE']
weather_conditions = ['Clear', 'Light_Rain', 'Heavy_Monsoon', 'Fog', 'Thunderstorm']

synthetic_delay_data = []
for _ in range(delay_samples):
    al = np.random.choice(airlines, p=[0.35, 0.25, 0.20, 0.10, 0.05, 0.05])
    tm = np.random.choice(times)
    rt = np.random.choice(routes)
    w = np.random.choice(weather_conditions, p=[0.60, 0.18, 0.10, 0.08, 0.04])
    
    score = 0.1
    if w in ['Heavy_Monsoon', 'Fog', 'Thunderstorm']:
        score += 0.5
    if tm in ['Evening', 'Night', 'Late_Night']:
        score += 0.2
    if al in ['SpiceJet', 'AirAsia']:
        score += 0.15
        
    delay_risk = "High" if score > 0.6 else ("Moderate" if score > 0.35 else "Low")
    is_delayed = 1 if score > 0.4 else 0
    
    synthetic_delay_data.append({
        'airline': al,
        'departure_time': tm,
        'route': rt,
        'weather_condition': w,
        'delay_risk': delay_risk,
        'is_delayed': is_delayed
    })

df_delay = pd.DataFrame(synthetic_delay_data)
X_delay = df_delay[['airline', 'departure_time', 'route', 'weather_condition']]
y_delay = df_delay['delay_risk']

# One-hot encoder preprocessor
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), ['airline', 'departure_time', 'route', 'weather_condition'])
    ]
)

# Categorical / Multinomial Naive Bayes Pipeline
nb_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', MultinomialNB(alpha=1.0))
])

# Exact 80/20 train/test split
X_train, X_test, y_train, y_test = train_test_split(X_delay, y_delay, test_size=0.2, random_state=42)

print(f"Training samples: {len(X_train):,} | Test samples: {len(X_test):,}")
print("Training Naive Bayes classifier (MultinomialNB with Laplace smoothing)...")

start_train = time.time()
nb_pipeline.fit(X_train, y_train)
train_time = time.time() - start_train

# Evaluate on test set
start_pred = time.time()
y_pred = nb_pipeline.predict(X_test)
pred_time = time.time() - start_pred

acc = accuracy_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred, average='weighted')
prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)
report_dict = classification_report(y_test, y_pred, output_dict=True, zero_division=0)

# Save model
model_path = "models/alternate_benchmarks/flight_delay_naive_bayes.joblib"
joblib.dump(nb_pipeline, model_path)
print(f"✓ Naive Bayes model saved to: {model_path}")

# Test scenarios
scenarios = [
    {
        "description": "IndiGo Morning Flight in Clear Weather",
        "input": pd.DataFrame([{'airline': 'IndiGo', 'departure_time': 'Morning', 'route': 'DEL-GOI', 'weather_condition': 'Clear'}])
    },
    {
        "description": "SpiceJet Night Flight in Heavy Monsoon",
        "input": pd.DataFrame([{'airline': 'SpiceJet', 'departure_time': 'Night', 'route': 'BOM-GOI', 'weather_condition': 'Heavy_Monsoon'}])
    },
    {
        "description": "Air India Evening Flight with Fog",
        "input": pd.DataFrame([{'airline': 'Air India', 'departure_time': 'Evening', 'route': 'DEL-JAI', 'weather_condition': 'Fog'}])
    }
]

# Load RF model for comparison
rf_model_path = "models/flight_delay_model.joblib"
rf_model = joblib.load(rf_model_path) if os.path.exists(rf_model_path) else None

case_results = []
for sc in scenarios:
    nb_pred = str(nb_pipeline.predict(sc["input"])[0])
    nb_probs = {c: round(float(p), 3) for c, p in zip(nb_pipeline.classes_, nb_pipeline.predict_proba(sc["input"])[0])}
    
    rf_pred = str(rf_model.predict(sc["input"])[0]) if rf_model else "N/A"
    rf_probs = {c: round(float(p), 3) for c, p in zip(rf_model.classes_, rf_model.predict_proba(sc["input"])[0])} if rf_model else {}

    case_results.append({
        "scenario": sc["description"],
        "naive_bayes_prediction": nb_pred,
        "naive_bayes_probabilities": nb_probs,
        "random_forest_prediction": rf_pred,
        "random_forest_probabilities": rf_probs
    })

eval_data = {
    "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
    "model_type": "Multinomial Naive Bayes (MultinomialNB, alpha=1.0)",
    "train_samples": len(X_train),
    "test_samples": len(X_test),
    "accuracy": round(float(acc), 4),
    "weighted_f1_score": round(float(f1), 4),
    "weighted_precision": round(float(prec), 4),
    "weighted_recall": round(float(rec), 4),
    "training_time_seconds": round(train_time, 4),
    "inference_time_seconds": round(pred_time, 4),
    "classes": list(nb_pipeline.classes_),
    "classification_report": report_dict,
    "scenario_tests": case_results,
    "file_path": model_path
}

json_path = "models/alternate_benchmarks/naive_bayes_evaluation.json"
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(eval_data, f, indent=2)

print("\n==================================================================")
print("📊 NAIVE BAYES EVALUATION SUMMARY")
print("==================================================================")
print(f"Accuracy         : {acc*100:.2f}%")
print(f"Weighted F1      : {f1:.4f}")
print(f"Weighted Precision: {prec:.4f}")
print(f"Weighted Recall  : {rec:.4f}")
print(f"Report saved to  : {json_path}")
print("==================================================================")
