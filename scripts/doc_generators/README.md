# Documentation & PDF Generators

This directory contains ReportLab-based automation scripts for compiling professional PDF architecture specifications and hackathon project documentation.

---

## 📋 Available Generators

| Script | Output PDF File | Description |
|---|---|---|
| **`generate_project_pdf.py`** | `AI_Travel_Copilot_Project_Documentation.pdf` | Executive summary, problem statement, key features, technology stack, ML architecture, and defense tables. |
| **`generate_comprehensive_backend_architecture_pdf.py`** | `AI_Travel_Copilot_Backend_Architecture_Specification.pdf` | Comprehensive backend specification covering FastAPI architecture, schemas, microservices, ML pipelines, and API contracts. |
| **`generate_30page_backend_architecture_pdf.py`** | Extended 30-page architecture deep-dive report | Detailed technical blueprint with endpoint schemas, database ER models, and security governance rules. |

---

## 🚀 How to Run

To regenerate any documentation PDF:
```bash
python scripts/doc_generators/generate_project_pdf.py
python scripts/doc_generators/generate_comprehensive_backend_architecture_pdf.py
```
*(The generated PDF will be created directly in the project root directory)*
