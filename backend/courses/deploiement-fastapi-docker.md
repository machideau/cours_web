---
slug: deploiement-fastapi-docker
title: "Déploiement de Modèles : FastAPI et Docker"
description: "Exposer un modèle entraîné comme une API REST avec FastAPI, puis la conteneuriser avec Docker pour un déploiement portable."
category: "Intelligence Artificielle & Machine Learning"
order: 12
---

# Déploiement de Modèles : FastAPI et Docker

Un modèle entraîné (modules 2 à 11) n'a de valeur que s'il est accessible à d'autres systèmes ou utilisateurs. Ce module couvre l'étape qui transforme un notebook d'entraînement en un service utilisable en production : l'API REST, conteneurisée avec Docker.

## 1. Sauvegarder un modèle entraîné

Avant de déployer, il faut sérialiser le modèle et tout ce qui est nécessaire pour reproduire le prétraitement (scaler, encodeur, vocabulaire...).

```python
import joblib

joblib.dump(modele, "modele_rf.joblib")
joblib.dump(scaler, "scaler.joblib")  # le StandardScaler du module 5, par exemple

# Pour PyTorch (module 6)
import torch
torch.save(modele.state_dict(), "modele_pytorch.pt")
```

## 2. Construire une API avec FastAPI

FastAPI est un framework Python moderne, rapide, avec validation automatique des données via Pydantic et documentation interactive générée automatiquement.

### Structure du projet

```
projet_api/
├── main.py
├── modele_rf.joblib
├── scaler.joblib
├── requirements.txt
└── Dockerfile
```

### Code de l'API

```python
# main.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="API de prédiction ML")

modele = joblib.load("modele_rf.joblib")
scaler = joblib.load("scaler.joblib")

class DonneesEntree(BaseModel):
    feature_1: float
    feature_2: float
    feature_3: float
    feature_4: float

class Prediction(BaseModel):
    classe_predite: int
    probabilite: float

@app.get("/")
def accueil():
    return {"statut": "API opérationnelle"}

@app.post("/predire", response_model=Prediction)
def predire(donnees: DonneesEntree):
    X = np.array([[donnees.feature_1, donnees.feature_2,
                    donnees.feature_3, donnees.feature_4]])
    X_normalise = scaler.transform(X)

    classe = int(modele.predict(X_normalise)[0])
    probabilite = float(np.max(modele.predict_proba(X_normalise)))

    return Prediction(classe_predite=classe, probabilite=probabilite)
```

Pydantic valide automatiquement les types d'entrée (rejette une requête avec une chaîne de caractères là où un float est attendu) et FastAPI génère une documentation interactive accessible sur `/docs`.

### Lancer l'API en local

```bash
pip install fastapi uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Tester l'API

```bash
curl -X POST "http://localhost:8000/predire" \
  -H "Content-Type: application/json" \
  -d '{"feature_1": 5.1, "feature_2": 3.5, "feature_3": 1.4, "feature_4": 0.2}'
```

## 3. Servir un modèle Hugging Face (module 10) via FastAPI

```python
from fastapi import FastAPI
from transformers import pipeline

app = FastAPI()
classifieur = pipeline("sentiment-analysis")

class Texte(BaseModel):
    texte: str

@app.post("/analyser")
def analyser_sentiment(donnees: Texte):
    resultat = classifieur(donnees.texte)[0]
    return {"label": resultat["label"], "score": float(resultat["score"])}
```

Attention : charger un gros modèle à chaque requête serait extrêmement lent — le charger une seule fois au démarrage de l'application (comme ci-dessus) est essentiel.

## 4. Conteneuriser avec Docker

### Pourquoi Docker

Docker empaquette le code, les dépendances Python exactes et le système d'exploitation de base dans une image unique, garantissant que l'API se comporte identiquement en local, sur un serveur, ou dans le cloud — plus de "ça marche sur ma machine".

### Fichier requirements.txt

```
fastapi==0.115.0
uvicorn==0.32.0
scikit-learn==1.5.2
joblib==1.4.2
numpy==2.1.2
```

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Construire et lancer le conteneur

```bash
docker build -t api-ml-prediction .
docker run -p 8000:8000 api-ml-prediction
```

L'API est maintenant accessible sur `http://localhost:8000`, exactement comme en local, mais dans un environnement isolé et reproductible.

## 5. Docker Compose (API + éventuelle base de données)

Pour des architectures multi-services (API + base de données pour logger les prédictions, par exemple) :

```yaml
# docker-compose.yml
version: "3.9"
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - MODEL_PATH=/app/modele_rf.joblib
  base_de_donnees:
    image: postgres:16
    environment:
      - POSTGRES_PASSWORD=motdepasse
    ports:
      - "5432:5432"
```

```bash
docker-compose up
```

## 6. Options de déploiement cloud (aperçu)

Une fois l'image Docker construite, plusieurs options pour la déployer publiquement :
- **Hugging Face Spaces** : gratuit pour des démos, supporte Docker directement, idéal pour montrer un projet (compétitions, portfolio)
- **Render / Railway** : déploiement simple à partir d'un repo Git, plans gratuits limités
- **Cloud Run (GCP) / ECS (AWS)** : scaling automatique, adapté à la production à plus grande échelle

Ces options sont approfondies au module 13 (monitoring et scalabilité).

---

## 7. Exercices

**Exercice 1 — API complète pour un modèle du module 3**

Entraîne et sauvegarde un `RandomForestClassifier` sur un dataset de ton choix. Construis une API FastAPI complète avec endpoint `/predire`, teste-la avec `curl` ou l'interface `/docs`.

```python
# TODO: entraîner, sauvegarder avec joblib, construire main.py
```

**Exercice 2 — Validation des entrées avec Pydantic**

Ajoute des contraintes de validation Pydantic (ex : `feature_1` doit être positif, `Field(gt=0)`) à ton modèle d'entrée. Teste que l'API rejette bien une requête invalide avec un message d'erreur clair.

```python
from pydantic import Field
# TODO: ajouter des contraintes de validation et tester avec une requête invalide
```

**Exercice 3 — Conteneuriser et exécuter**

Écris le Dockerfile pour l'API de l'exercice 1, construis l'image, lance le conteneur, et vérifie que l'API répond de la même façon qu'en local.

```bash
# TODO: docker build, docker run, tester avec curl
```

**Exercice 4 — API pour un modèle Hugging Face avec gestion des erreurs**

Construis une API qui sert un modèle de classification de texte Hugging Face (module 10), avec gestion d'erreur si le texte est vide ou dépasse une longueur maximale.

```python
from fastapi import HTTPException
# TODO: lever une HTTPException(400, ...) si le texte est vide ou trop long
```

---

## Conclusion

FastAPI et Docker forment la base standard du déploiement de modèles ML : une API claire et validée, empaquetée de façon portable et reproductible. Le dernier module du parcours aborde ce qui se passe après le déploiement initial : le monitoring en production, la mise à jour de modèle, et les bases de la scalabilité.
