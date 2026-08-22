# ✈️ AI Travel Copilot — Enterprise Full-Stack Autonomous Travel Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.110-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19_|_TypeScript-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Bundler-Vite_8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Scikit-Learn](https://img.shields.io/badge/Machine_Learning-Scikit--Learn-F7931E?logo=scikitlearn&logoColor=white)](https://scikit-learn.org)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **An intelligent, autonomous full-stack travel platform powered by Multi-Agent AI, Retrieval-Augmented Generation (RAG), Machine Learning Recommenders, 0/1 Knapsack Budget Optimization, and Traveling Salesperson (TSP) Route Scheduling.**

---

## 🌟 Key Platform Capabilities

- 🤖 **Autonomous Multi-Agent Planner**: Generates day-by-day itineraries with **100% unique, non-repeating attractions** across 50+ Indian and Global destinations.
- 🧠 **RAG-Powered Landmark Retrieval**: Semantic vector retrieval over curated attraction datasets with real landmark names, GPS coordinates, historical descriptions, and entry fees.
- 🎯 **Hybrid Recommendation Engine**: Content-based and collaborative filtering models powered by TF-IDF matrices ($N=152$, features=$6,366$) and cosine item-item similarity.
- 💰 **0/1 Knapsack Budget Allocation**: Dynamically partitions traveler budgets across accommodations, activities, dining, and transit buffer reserves.
- 📍 **TSP Geographic Route Optimization**: Solves the Traveling Salesperson Problem to order daily sights geographically, minimizing transit fatigue.
- 🚨 **Live Disruption Radar & Weather**: Monitors adverse weather risks, flight delay forecasts via gradient-boosted models, and recommends instant reroutes.
- 🔐 **JWT Enterprise Authentication**: Secure user registration, login, profile management, and password hashing.
- 🏨 **Flights & Hotels Booking Engines**: Integrated search and sentiment-scored hotel cards with real-time amenity breakdown.
- 💬 **Conversational AI Travel Assistant**: Real-time multi-turn chat assistant for destination advice, itinerary adjustments, and packing tips.

---

## 🏗️ System Architecture

```
                                  ┌────────────────────────────────────────┐
                                  │       React 19 + TypeScript Frontend   │
                                  │      (Vite + Tailwind CSS + Lucide)    │
                                  └───────────────────┬────────────────────┘
                                                      │ REST APIs & Auth JWT
                                                      ▼
                                  ┌────────────────────────────────────────┐
                                  │         FastAPI High-Speed Backend     │
                                  └─┬───────────────┬────────────────┬─────┘
                                    │               │                │
             ┌──────────────────────┴──────┐ ┌──────┴──────┐ ┌───────┴───────────────────────┐
             │      Multi-Agent System     │ │  ML Engines │ │      Data & Retrieval         │
             ├─────────────────────────────┤ ├─────────────┤ ├───────────────────────────────┤
             │ • Planner Agent             │ │ • TF-IDF    │ │ • SQLite Relational DB        │
             │ • Budget Optimizer (Knapsack)││ • Cosine Sim│ │ • RAG Knowledge Base          │
             │ • Route Optimizer (TSP)     │ │ • Delay ML  │ │ • All-India & Global Datasets │
             │ • Disruption Radar Agent    │ │ • Price ML  │ │ • Unsplash High-Res CDN       │
             └─────────────────────────────┘ └─────────────┘ └───────────────────────────────┘
```

---

## 🗺️ Covered Destinations & Datasets

### 🇮🇳 India (All States & Vacation Regions)
* **Goa**: *Baga Beach, Fort Aguada, Basilica of Bom Jesus, Dudhsagar Falls, Palolem Beach, Fontainhas Latin Quarter*
* **Himachal Pradesh**: *Manali, Rohtang Pass, Solang Valley, Hadimba Devi Pagoda, Atal Tunnel, Shimla, Dharamshala, Spiti*
* **Rajasthan**: *Jaipur (Amber Fort, Hawa Mahal, City Palace, Nahargarh Fort, Jal Mahal), Udaipur, Jodhpur, Jaisalmer*
* **Kerala**: *Munnar Tea Estates, Alleppey Luxury Backwaters Houseboat, Eravikulam National Park, Fort Kochi, Varkala Cliff*
* **Jammu & Kashmir / Ladakh**: *Srinagar Dal Lake Shikara, Gulmarg Gondola, Pangong Tso Lake, Khardung La Pass, Nubra Dunes*
* **Uttarakhand**: *Rishikesh White Water Rafting, Laxman Jhula, Nainital Lake, Auli Ski Slopes, Jim Corbett Safari*
* **Karnataka & Tamil Nadu**: *Hampi UNESCO Stone Chariot, Coorg Coffee Estates, Ooty Nilgiri Toy Train, Gokarna Om Beach*
* **Andaman & Nicobar**: *Radhanagar Beach, Elephant Beach Coral Snorkeling, Cellular Jail*
* **Uttar Pradesh & Punjab**: *Agra Taj Mahal, Varanasi Ganga Aarti, Amritsar Golden Temple*

### 🌍 Global Top Destinations
* **France**: *Paris (Eiffel Tower, Louvre Museum, Montmartre, Seine Cruise, Palace of Versailles, Arc de Triomphe)*
* **Switzerland**: *Zurich Old Town, Lucerne Chapel Bridge, Mount Pilatus, Jungfraujoch, Lauterbrunnen, Zermatt Matterhorn*
* **Japan**: *Tokyo (Sensō-ji, Shibuya Crossing, Skytree), Kyoto (Fushimi Inari, Golden Pavilion), Mount Fuji, Osaka*
* **Indonesia**: *Bali (Ubud Monkey Forest, Tegallalang Rice Terraces, Uluwatu Cliff Temple, Tanah Lot, Nusa Penida)*
* **UAE**: *Dubai (Burj Khalifa 148th Floor, Dubai Mall, Palm Jumeirah, Desert Safari Dunes, Museum of the Future)*
* **Maldives**: *Male Atolls, Overwater Luxury Bungalows, Coral Reef Snorkeling*
* **Italy, UK, USA**: *Rome Colosseum, London Big Ben, New York Manhattan Skyline*

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/Chandu-Codes/AI-Travel-Copilot.git
cd AI-Travel-Copilot
```

### 3. Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
* Backend API will run at **`http://localhost:8000`**
* Interactive Swagger Docs: **`http://localhost:8000/docs`**

### 4. Frontend Setup
```bash
# In a new terminal window:
cd frontend
npm install
npm run dev
```
* Frontend interface will run at **`http://localhost:5173`**

---

## 🧪 Automated Testing

To run the automated backend test suite:
```bash
python -m pytest backend/tests/test_api.py -v
```

---

## 📂 Project Structure

```
AI-Travel-Copilot/
├── backend/                 # FastAPI REST application & AI agent orchestrators
│   ├── app/
│   │   ├── agents/          # Multi-Agent orchestrators (PlannerAgent, DisruptionAgent)
│   │   ├── api/             # REST route endpoints (Trips, Flights, Hotels, Budget, Copilot)
│   │   ├── ml/              # Model inference services (Sentiment, Flights, Recommender)
│   │   ├── models/          # SQLAlchemy database ORM models
│   │   ├── nlp/             # Multilingual NLP translation & intent engines
│   │   ├── optimization/    # Budget knapsack & route solvers
│   │   ├── rag/             # Dense vector knowledge retrieval engine
│   │   └── schemas/         # Pydantic validation schemas
│   └── tests/               # Pytest API integration tests
├── models/                  # Serialized Machine Learning models & NLP artifacts
│   ├── flight_price_model.joblib        # Random Forest Regressor (R² = 0.9738)
│   ├── flight_delay_model.joblib        # Random Forest Classifier (Acc = 100%)
│   ├── hotel_sentiment_model.joblib     # TF-IDF + Logistic Regression
│   ├── recommender_bundle.joblib        # TF-IDF + Cosine Similarity Index
│   ├── evaluation_report.json           # Master evaluation metrics
│   └── alternate_benchmarks/            # Baseline models (Linear Reg, KNN, SVM, Naive Bayes)
├── datasets/                # Cleaned CSV & JSON destination knowledge bases
│   ├── budgets/             # Budget split matrices & living costs
│   ├── destinations/        # 150+ POIs, coordinates, attraction knowledge graphs
│   ├── disruptions/         # Simulated real-world travel advisories
│   ├── flights/             # 300k Indian flight pricing records
│   ├── hotels/              # TripAdvisor review NLP corpus & hotel catalogs
│   ├── geo/                 # Global world cities and coordinates index
│   └── conversational/      # Multilingual intent classification templates
├── frontend/                # React 18 + Vite + Tailwind CSS dashboard & copilot UI
│   ├── src/
│   │   ├── components/      # Reusable React widgets (Navbar, Sidebar, Maps, Charts)
│   │   ├── context/         # AuthContext & Session state management
│   │   ├── pages/           # Landing, Dashboard, Planner, Flights, Hotels, Budget, Disruptions
│   │   └── services/        # Axios API client integrations
│   └── package.json
├── scripts/                 # Automation, training, synthesis, and report generators
│   ├── train_all_models.py              # Master ML training pipeline
│   ├── validate_and_clean_datasets.py   # Dataset auditing & validation tool
│   ├── alternate_algorithms/            # Baseline ML training & benchmarking scripts
│   ├── dataset_builders/                # Knowledge base synthesis & scrapers
│   └── doc_generators/                  # ReportLab PDF architecture generators
├── assets/                  # High-resolution UI screenshots and media
├── Presentation/            # Presentation slide decks (.pptx)
├── tests/                   # Test suites and uniqueness verification scripts
├── pytest.ini               # Root test discovery configuration
├── run_app.py               # Unified concurrent backend & frontend launcher
├── requirements.txt         # Python backend dependencies
└── README.md
```

---

## 👤 Author

**Chandu**
* GitHub: [@Chandu-Codes](https://github.com/Chandu-Codes)
* Project Repo: [AI-Travel-Copilot](https://github.com/Chandu-Codes/AI-Travel-Copilot)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
