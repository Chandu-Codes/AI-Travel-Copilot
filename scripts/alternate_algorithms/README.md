# Alternate Machine Learning Algorithms

This directory contains standalone benchmark training scripts for testing and comparing alternative machine learning models against our production Random Forest and TF-IDF pipelines.

---

## 📋 Available Scripts

| Script | Algorithm Tested | Task | Production Comparison | Output Files Saved |
|---|---|---|---|---|
| **`train_and_evaluate_linear_regression.py`** | **Linear Regression (OLS / Ridge)** | Flight Price Prediction | Comparison vs Random Forest Regressor ($R^2 = 0.9128$ vs $0.9738$) | `models/alternate_benchmarks/flight_price_linear_model.joblib`<br>`models/alternate_benchmarks/linear_regression_evaluation.json` |
| **`train_and_evaluate_knn.py`** | **K-Nearest Neighbors (KNN, k=5)** | Flight Price Prediction | Comparison vs Random Forest Regressor ($R^2 = 0.9535$ vs $0.9738$; 10x slower inference) | `models/alternate_benchmarks/flight_price_knn_model.joblib`<br>`models/alternate_benchmarks/knn_evaluation.json` |
| **`train_and_evaluate_svm.py`** | **Support Vector Machine (LinearSVR)** | Flight Price Prediction | Comparison vs Random Forest Regressor ($R^2 = 0.9126$ vs $0.9738$) | `models/alternate_benchmarks/flight_price_svm_model.joblib`<br>`models/alternate_benchmarks/svm_evaluation.json` |
| **`train_and_evaluate_naive_bayes.py`** | **Multinomial Naive Bayes (Categorical)** | Flight Delay Risk Classification | Comparison vs Random Forest Classifier ($89.27\%$ vs $100.00\%$ Accuracy) | `models/alternate_benchmarks/flight_delay_naive_bayes.joblib`<br>`models/alternate_benchmarks/naive_bayes_evaluation.json` |
| **`train_and_evaluate_multinomial_logistic.py`** | **Multinomial Logistic Regression** | Flight Delay Risk Classification | Comparison vs Random Forest Classifier ($98.40\%$ vs $100.00\%$ Accuracy) | `models/alternate_benchmarks/flight_delay_multinomial_logistic.joblib`<br>`models/alternate_benchmarks/multinomial_logistic_evaluation.json` |

---

## 🚀 How to Run

You can run any script individually from anywhere:

```bash
python scripts/alternate_algorithms/train_and_evaluate_linear_regression.py
python scripts/alternate_algorithms/train_and_evaluate_knn.py
python scripts/alternate_algorithms/train_and_evaluate_svm.py
python scripts/alternate_algorithms/train_and_evaluate_naive_bayes.py
python scripts/alternate_algorithms/train_and_evaluate_multinomial_logistic.py
```
