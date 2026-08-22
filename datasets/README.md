# AI Travel Copilot - Curated Datasets

This directory contains all structured datasets, benchmarks, flight price matrices, hotel reviews, destination knowledge graphs, and disruption scenarios utilized across the platform.

---

## 📂 Dataset Subdirectories Overview

| Directory | Core Files | Format | Description & Purpose |
|---|---|:---:|---|
| **[`destinations/`](file:///c:/Soft%20Projects/CTS%20project-1/Travel%20Planning%20AI-%20CTS/datasets/destinations)** | `destinations_attractions.csv`<br>`destinations_rich_knowledge.json` | CSV / JSON | 150+ Indian & global destinations, POIs, GPS coordinates, historical tags, and entrance pricing for the Hybrid POI Recommender. |
| **[`hotels/`](file:///c:/Soft%20Projects/CTS%20project-1/Travel%20Planning%20AI-%20CTS/datasets/hotels)** | `hotels_catalog.csv`<br>`tripadvisor_hotel_reviews.csv` | CSV | 20,491 TripAdvisor user reviews for NLP sentiment modeling + verified multi-tier hotel properties (Luxury, Mid-range, Budget). |
| **[`flights/`](file:///c:/Soft%20Projects/CTS%20project-1/Travel%20Planning%20AI-%20CTS/datasets/flights)** | `flight_prices_india.csv` | CSV | 300,153 real-world flight pricing records across Indian routes (airlines, stops, duration, days left, departure time, fare). |
| **[`disruptions/`](file:///c:/Soft%20Projects/CTS%20project-1/Travel%20Planning%20AI-%20CTS/datasets/disruptions)** | `travel_disruptions.csv` | CSV | Real-time simulated travel advisories (mountain snow, monsoon tides, metro maintenance, airport congestion). |
| **[`budgets/`](file:///c:/Soft%20Projects/CTS%20project-1/Travel%20Planning%20AI-%20CTS/datasets/budgets)** | `budget_benchmarks.json` | JSON | Empirical budget split matrices (Backpacker, Explorer, Luxury) and city-level daily living cost benchmarks. |
| **[`geo/`](file:///c:/Soft%20Projects/CTS%20project-1/Travel%20Planning%20AI-%20CTS/datasets/geo)** | `world_cities.csv` | CSV | Global geo-spatial index of world cities, countries, and latitude/longitude coordinates. |
| **[`conversational/`](file:///c:/Soft%20Projects/CTS%20project-1/Travel%20Planning%20AI-%20CTS/datasets/conversational)** | `conversational_intents.json` | JSON | Intent classification training patterns and entity extraction templates for multilingual queries. |

---

## 🔍 Data Validation & Auditing

To audit, clean, and verify integrity across all 7 dataset categories, run:
```bash
python scripts/validate_and_clean_datasets.py
```
*(All datasets have a 100% validation check pass rate with 0 missing values on critical features).*
