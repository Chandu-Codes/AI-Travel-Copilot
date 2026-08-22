# Dataset Builders & Synthesis Scripts

This directory contains utility scripts that synthesize, aggregate, clean, and enrich datasets stored under `datasets/`.

---

## 📋 Builder Scripts Overview

| Script | Primary Function | Target Dataset Output |
|---|---|---|
| **`build_all_datasets.py`** | Master pipeline to download raw inputs, synthesize baseline flights, hotels, disruptions, and budget benchmarks. | `datasets/*` |
| **`build_comprehensive_destinations.py`** | Generates detailed destination records with coordinates, categories, ratings, and tag corpora. | `datasets/destinations/` |
| **`build_rich_poi_knowledge.py`** | Constructs rich destination knowledge base with cultural context, historical details, and pricing. | `datasets/destinations/destinations_rich_knowledge.json` |
| **`build_all_hotels_flights_disruptions_datasets.py`** | Generates verified accommodation listings and real-world simulated travel disruption advisories. | `datasets/hotels/`, `datasets/disruptions/` |
| **`build_all_india_and_world_datasets.py`** | Aggregates Pan-India and global international destination POIs. | `datasets/destinations/` |
| **`build_all_missing_destinations.py`** | Fills gaps in missing tier-2/tier-3 destination POIs and attractions. | `datasets/destinations/` |
| **`build_comprehensive_global_knowledge.py`** | Global tourism dataset builder covering international hubs (Paris, Tokyo, Dubai, Bali, etc.). | `datasets/destinations/` |
| **`build_exhaustive_real_attractions.py`** | Curates verified real-world attractions with accurate entrance fees, timings, and coordinates. | `datasets/destinations/` |
| **`build_extra_destinations.py`** | Adds supplementary destination entries and attraction metadata. | `datasets/destinations/` |
| **`build_full_knowledge.py`** | Unifies rich knowledge graphs for destinations, POIs, hotels, and flight routes. | `datasets/` |
| **`build_pan_india_and_global_dataset.py`** | Consolidates all Indian and international tourism nodes into a unified schema. | `datasets/destinations/` |
| **`build_rich_hotels_dataset.py`** | Generates luxury, boutique, mid-range, and hostel catalog entries with pricing. | `datasets/hotels/hotels_catalog.csv` |
| **`build_worldwide_knowledge_and_train.py`** | Comprehensive worldwide knowledge aggregation and initial feature matrix initialization. | `datasets/`, `models/` |

---

## 🚀 How to Run

To regenerate or update any dataset module:
```bash
python scripts/dataset_builders/build_all_datasets.py
```
*(All scripts automatically resolve the project root)*
