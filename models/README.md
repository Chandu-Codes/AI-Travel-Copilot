# AI Travel Copilot - Machine Learning Models

This directory contains the trained, serialized production ML & NLP models loaded directly by the FastAPI backend services, along with evaluation benchmarks.

## 🚀 Production Models Overview

| Model File | Machine Learning Algorithm | Backend Service | Primary Purpose | Key Performance Metrics |
|---|---|---|---|---|
| **`flight_price_model.joblib`** | **Random Forest Regressor** (60 trees, max_depth=16) | `flight_service.py` | Accurate fare estimation for flights across Indian routes based on airline, source/dest, timing, stops, days left | **$R^2 = 0.9738$**, **$\text{MAE} = \text{₹}1,912.04$**, **$\text{RMSE} = \text{₹}3,640.80$** (57% lower error than Linear Regression) |
| **`flight_delay_model.joblib`** | **Random Forest Classifier** (50 trees, max_depth=12) | `flight_service.py` | Predicts flight delay and disruption risk category (`Low`, `Moderate`, `High`) considering weather, route, time of day | **$\text{Accuracy} = 100.00\%$**, **$\text{Weighted F1} = 1.0000$** |
| **`hotel_sentiment_model.joblib`** | **TF-IDF (5,000 features, 1-2 n-grams) + Logistic Regression** | `sentiment_service.py` | Analyzes hotel user reviews to predict sentiment polarity and quality scores | **$\text{Accuracy} = 86.22\%$**, **$\text{Weighted F1} = 0.8402$** |
| **`recommender_bundle.joblib`** | **TF-IDF + Cosine Similarity Vector Index** | `recommender_service.py` | Hybrid recommendation engine for matching user preferences to POIs, attractions, and cities | **$\text{Top-3 Recall} = 100.0\%$**, **$\text{Latency} < 2\text{ms}$** |
| **`evaluation_report.json`** | *Consolidated Metadata* | Backend / Auditing | Comprehensive performance evaluation report across all production models | Generated dynamically after training |

---

## 📂 Subdirectories

- **`alternate_benchmarks/`**: Contains baseline and comparison models (Linear Regression, KNN, SVM, Naive Bayes, Multinomial Logistic Regression) and their evaluation JSON reports used to benchmark and justify the choice of production models.

---

## 🔄 Retraining Models

To retrain all production models, run:
```bash
python scripts/train_all_models.py
```
*(Can be executed from the project root or from inside the `scripts/` directory)*
