# Alternate & Baseline Machine Learning Models

This folder contains baseline algorithms and alternative ML architectures trained and evaluated against the same datasets as the production models to demonstrate rigorous empirical justification for model selection.

---

## ✈️ Flight Price Prediction Benchmark

Comparison across 4 different regression architectures on 40,000 flight records (8,000 test holdout):

| Rank | Model Architecture | Model File | Evaluation Report | $R^2$ Score | Mean Absolute Error (MAE) | Root Mean Squared Error (RMSE) | MAPE (%) | Inference Latency (8k samples) |
|---|---|---|---|---|---|---|---|---|
| 🥇 **1** | **Random Forest Regressor** *(Production)* | `../flight_price_model.joblib` | `../evaluation_report.json` | **0.9738** | **₹1,912.04** | **₹3,640.80** | **14.20%** | **0.18s** |
| 🥈 **2** | **K-Nearest Neighbors (KNN, k=5)** | `flight_price_knn_model.joblib` | `knn_evaluation.json` | 0.9535 | ₹2,538.39 | ₹4,849.65 | 17.85% | 1.82s *(10x slower)* |
| 🥉 **3** | **Linear Support Vector Regressor (LinearSVR)** | `flight_price_svm_model.joblib` | `svm_evaluation.json` | 0.9126 | ₹4,424.08 | ₹6,648.54 | 42.15% | 0.04s |
| 4 | **Linear Regression (OLS / Ridge)** | `flight_price_linear_model.joblib` | `linear_regression_evaluation.json` | 0.9128 | ₹4,450.87 | ₹6,641.74 | 42.48% | 0.03s |

### 💡 Why Random Forest Was Chosen:
- **57.0% lower error** than Linear Regression (₹1,912 vs ₹4,450 MAE).
- **10x faster inference** than KNN (KNN requires calculating distance matrices for every point at runtime).
- Robust handling of non-linear categorical interactions (e.g. airline class multipliers vs advance booking windows).

---

## 🚨 Flight Delay Risk Classification Benchmark

Comparison between classification architectures for 3-class risk assessment (`Low`, `Moderate`, `High`):

| Rank | Model Architecture | Model File | Evaluation Report | Overall Accuracy | Weighted F1 Score | Weighted Precision | Moderate Class Recall |
|---|---|---|---|---|---|---|---|
| 🥇 **1** | **Random Forest Classifier** *(Production)* | `../flight_delay_model.joblib` | `../evaluation_report.json` | **100.00%** | **1.0000** | **1.0000** | **100.00%** |
| 🥈 **2** | **Multinomial Logistic Regression** | `flight_delay_multinomial_logistic.joblib` | `multinomial_logistic_evaluation.json` | 98.40% | 0.9840 | 0.9845 | 95.80% |
| 🥉 **3** | **Multinomial Naive Bayes (Categorical)** | `flight_delay_naive_bayes.joblib` | `naive_bayes_evaluation.json` | 89.27% | 0.8931 | 0.9064 | 60.86% |

---

## 🔄 Retraining Alternate Models

To rerun benchmarks for any alternate model:
```bash
python scripts/alternate_algorithms/train_and_evaluate_linear_regression.py
python scripts/alternate_algorithms/train_and_evaluate_knn.py
python scripts/alternate_algorithms/train_and_evaluate_svm.py
python scripts/alternate_algorithms/train_and_evaluate_naive_bayes.py
python scripts/alternate_algorithms/train_and_evaluate_multinomial_logistic.py
```
