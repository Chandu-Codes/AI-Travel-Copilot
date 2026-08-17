import os
import json
import re
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from ..utils.path_helper import resolve_path

KNOWLEDGE_PATH = "datasets/destinations/destinations_rich_knowledge.json"

def clean_destination_string(raw: str) -> str:
    if not raw:
        return ""
    text = raw.strip().lower()
    # Strip common phrases/actions
    prefixes = [
        r"^i\s+want\s+to\s+explore\s+", r"^i\s+want\s+to\s+visit\s+", r"^i\s+want\s+to\s+go\s+to\s+",
        r"^i\s+would\s+like\s+to\s+visit\s+", r"^take\s+me\s+to\s+", r"^show\s+me\s+",
        r"^let\'?s\s+go\s+to\s+", r"^best\s+of\s+", r"^explore\s+", r"^plan\s+a\s+trip\s+to\s+", 
        r"^plan\s+trip\s+to\s+", r"^trip\s+to\s+", r"^visit\s+", r"^travel\s+to\s+", 
        r"^vacation\s+in\s+", r"^holidays\s+in\s+", r"^tour\s+of\s+", r"^tour\s+to\s+", 
        r"^discover\s+", r"^guide\s+to\s+", r"^go\s+to\s+"
    ]
    for pattern in prefixes:
        text = re.sub(pattern, "", text).strip()
        
    suffixes = [
        r"\s+tour$", r"\s+trip$", r"\s+vacation$", r"\s+package$", 
        r"\s+travel$", r"\s+holidays$", r"\s+itinerary$", r"\s+guide$"
    ]
    for pattern in suffixes:
        text = re.sub(pattern, "", text).strip()
        
    return text.strip()

class RAGEngine:
    def __init__(self):
        self.documents: List[Dict[str, Any]] = []
        self.vectorizer = None
        self.doc_vectors = None
        self._load_knowledge()

    def _load_knowledge(self):
        resolved = resolve_path(KNOWLEDGE_PATH)
        if os.path.exists(resolved):
            try:
                with open(resolved, "r", encoding="utf-8") as f:
                    self.documents = json.load(f)
                
                # Build rich textual corpus for dense retrieval
                corpus = [
                    f"{d.get('name', '')} in {d.get('city', '')}, {d.get('region', '')}, {d.get('country', '')}. Category: {d.get('category', '')}. Tags: {d.get('tags', '')}. {d.get('description', '')}"
                    for d in self.documents
                ]
                
                if corpus:
                    self.vectorizer = TfidfVectorizer(stop_words='english')
                    self.doc_vectors = self.vectorizer.fit_transform(corpus)
            except Exception as e:
                print(f"Error loading RAG knowledge base from {resolved}: {e}")
        else:
            print(f"Warning: RAG knowledge path not found: {resolved}")

    def query(self, search_text: str, city: str = None, top_k: int = 40) -> List[Dict[str, Any]]:
        if not self.documents:
            self._load_knowledge()

        if not self.documents:
            return []

        city_clean = clean_destination_string(city) if city else ""
        if not city_clean and search_text:
            city_clean = clean_destination_string(search_text)

        # 1. Prioritize direct matches on city, state, country, or specific tags
        if city_clean and len(city_clean) >= 2:
            primary_matches = []
            secondary_matches = []
            
            for doc in self.documents:
                doc_city = (doc.get("city") or "").strip().lower()
                doc_region = (doc.get("region") or "").strip().lower()
                doc_country = (doc.get("country") or "").strip().lower()
                doc_name = (doc.get("name") or "").strip().lower()
                doc_tags = (doc.get("tags") or "").strip().lower()
                
                # Precise matching
                is_city_match = bool(doc_city and (city_clean == doc_city or city_clean in doc_city or doc_city in city_clean))
                is_country_match = bool(doc_country and (city_clean == doc_country or (len(city_clean) > 3 and city_clean in doc_country)))
                is_region_match = bool(doc_region and (city_clean == doc_region or (len(city_clean) > 3 and city_clean in doc_region)))
                is_tag_match = bool(doc_tags and (f" {city_clean} " in f" {doc_tags} " or any(city_clean == t.strip() for t in doc_tags.split(","))))

                if is_city_match or is_tag_match:
                    primary_matches.append(doc.copy())
                elif is_country_match or is_region_match:
                    secondary_matches.append(doc.copy())
                elif doc_name and city_clean in doc_name:
                    secondary_matches.append(doc.copy())

            if primary_matches:
                return primary_matches[:top_k]

            if secondary_matches:
                return secondary_matches[:top_k]

        # 2. Semantic vector similarity fallback with a threshold check
        if self.doc_vectors is not None and self.vectorizer is not None and (search_text or city_clean):
            query_vec = self.vectorizer.transform([search_text or city_clean])
            scores = cosine_similarity(query_vec, self.doc_vectors).flatten()

            results = []
            for idx, score in enumerate(scores):
                if score > 0.08:  # Only accept relevant matches
                    doc = self.documents[idx].copy()
                    doc["similarity_score"] = float(round(score, 4))
                    results.append((score, doc))

            if results:
                results.sort(key=lambda x: x[0], reverse=True)
                return [r[1] for r in results[:top_k]]

        return []

rag_engine = RAGEngine()
