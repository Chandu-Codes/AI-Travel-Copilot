# AI Travel Copilot - Scripts Directory

This directory contains all scripts for training models, data validation, synthetic data building, and documentation generation.

---

## 🌟 Main Production Scripts (Root of `scripts/`)

| Script | Purpose | How to Run |
|---|---|---|
| **`train_all_models.py`** | Trains, evaluates, and serializes all 4 production ML/NLP models (`flight_price_model`, `flight_delay_model`, `hotel_sentiment_model`, `recommender_bundle`) into `models/`. | `python scripts/train_all_models.py` |
| **`validate_and_clean_datasets.py`** | Audits, validates, cleans duplicates/nulls, and confirms data integrity across all 7 dataset modules. | `python scripts/validate_and_clean_datasets.py` |
| **`setup_backend_dirs.py`** | Ensures all necessary runtime folders (`models/`, `datasets/`, logs) exist. | `python scripts/setup_backend_dirs.py` |

---

## 📂 Subdirectories

### 1. [`alternate_algorithms/`](file:///c:/Soft%20Projects/CTS%20project-1/Travel%20Planning%20AI-%20CTS/scripts/alternate_algorithms)
Contains training and benchmarking scripts for alternative machine learning models (Linear Regression, KNN, SVM, Naive Bayes, Multinomial Logistic Regression). Saves benchmark models and metrics to `models/alternate_benchmarks/`.

### 2. [`dataset_builders/`](file:///c:/Soft%20Projects/CTS%20project-1/Travel%20Planning%20AI-%20CTS/scripts/dataset_builders)
Contains scripts used to synthesize, scrape, enrich, and build comprehensive travel knowledge graphs, hotel catalogs, POIs, disruption feeds, and budget datasets in `datasets/`.

### 3. [`doc_generators/`](file:///c:/Soft%20Projects/CTS%20project-1/Travel%20Planning%20AI-%20CTS/scripts/doc_generators)
Contains ReportLab Python scripts that generate professional project summary and comprehensive backend architecture PDF documentation.

---

> [!NOTE]
> All scripts in this directory and its subdirectories automatically detect the project root directory, so you can execute them from the project root or from inside any subfolder without path errors!
