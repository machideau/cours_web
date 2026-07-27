---
slug: versioning-experimentation-mlflow
title: "Versioning de Modèles/Données et Suivi d'Expérimentation"
description: "Versionner ses données et modèles, suivre ses expérimentations avec MLflow et Weights & Biases, pour un travail ML reproductible."
category: "Intelligence Artificielle & Machine Learning"
order: 11
---

# Versioning de Modèles/Données et Suivi d'Expérimentation

Dès qu'on multiplie les entraînements, les hyperparamètres et les versions de dataset, garder une trace manuelle devient intenable. Ce module couvre les outils qui rendent le travail ML reproductible et comparable.

## 1. Pourquoi le versioning ne se limite pas au code

Git versionne le code, mais pas les données volumineuses ni les poids des modèles (fichiers binaires souvent trop lourds pour un repo Git standard). Un projet ML reproductible doit versionner trois éléments : le code, les données, et les modèles/expériences.

## 2. Versionner les données : DVC (Data Version Control)

DVC fonctionne comme Git mais pour les gros fichiers : il stocke un pointeur léger dans Git, et les données réelles dans un stockage distant (S3, Google Drive, serveur local).

```bash
pip install dvc
dvc init
dvc add data/dataset_brut.csv
git add data/dataset_brut.csv.dvc .gitignore
git commit -m "Ajout du dataset v1"

dvc remote add -d stockage s3://mon-bucket/dvc-store
dvc push
```

À chaque nouvelle version des données, on refait `dvc add` + commit — chaque commit Git référence alors une version précise et reproductible des données.

## 3. Suivi d'expérimentation avec MLflow

### Concepts clés

- **Run** : une exécution d'entraînement, avec ses paramètres, métriques et artefacts
- **Experiment** : un groupe de runs liés à une même tâche
- **Model Registry** : gestion des versions de modèles prêts pour la production

### Logging manuel

```python
import mlflow

mlflow.set_experiment("classification-cultures-agricoles")

with mlflow.start_run(run_name="random-forest-v1"):
    mlflow.log_param("n_estimators", 200)
    mlflow.log_param("max_depth", 10)

    modele.fit(X_train, y_train)
    accuracy = modele.score(X_test, y_test)

    mlflow.log_metric("accuracy", accuracy)
    mlflow.sklearn.log_model(modele, "modele_rf")
```

### Autologging

MLflow peut logger automatiquement paramètres, métriques et modèle sans instrumentation manuelle, pour de nombreux frameworks (scikit-learn, PyTorch, XGBoost, Hugging Face Transformers).

```python
import mlflow

mlflow.autolog()  # une seule ligne avant l'entraînement

modele.fit(X_train, y_train)  # tout est loggé automatiquement
```

### Comparer les runs

```bash
mlflow ui  # lance l'interface web locale sur http://localhost:5000
```

L'interface permet de comparer visuellement les métriques de plusieurs runs, filtrer par paramètres, et identifier la meilleure configuration.

### Model Registry

```python
resultat = mlflow.register_model(
    model_uri="runs:/<run_id>/modele_rf",
    name="modele-production-cultures"
)
```

Le registre permet de gérer des alias (`champion`, `challenger`) et de versionner explicitement quel modèle est actuellement déployé.

## 4. Weights & Biases (W&B)

W&B propose une expérience similaire à MLflow, avec un tableau de bord cloud plus riche visuellement, particulièrement populaire en deep learning pour le suivi en temps réel des courbes d'entraînement.

```python
import wandb

wandb.init(project="classification-images", config={
    "learning_rate": 0.001,
    "epochs": 20,
    "batch_size": 64
})

for epoch in range(wandb.config.epochs):
    perte_entrainement = entrainer_une_epoch(modele, loader)
    wandb.log({"epoch": epoch, "perte": perte_entrainement})

wandb.finish()
```

### Intégration directe avec PyTorch/Keras

```python
# PyTorch : logger à chaque batch dans la boucle d'entraînement (comme au module 6)
wandb.log({"perte_batch": perte.item()})

# Keras : callback natif
from wandb.integration.keras import WandbCallback
modele_tf.fit(X_train, y_train, epochs=20, callbacks=[WandbCallback()])
```

### MLflow vs W&B

| | MLflow | Weights & Biases |
|---|---|---|
| Hébergement | Local/self-hosted par défaut | Cloud (SaaS), option self-hosted |
| Model Registry | Natif, intégré | Via artefacts |
| Visualisations | Basiques | Riches, temps réel |
| Coût | Gratuit, open-source | Gratuit pour usage limité, payant en équipe |

## 5. Reproductibilité complète

Pour qu'une expérience soit vraiment reproductible, il faut fixer et logger :
- La graine aléatoire (`random_state`/`seed`, déjà utilisée dans tous les modules précédents)
- La version exacte des librairies (`requirements.txt` ou `pip freeze`)
- La version des données (via DVC)
- La configuration matérielle si pertinent (GPU, précision numérique)

```python
mlflow.log_param("seed", 42)
mlflow.log_artifact("requirements.txt")
```

---

## 6. Exercices

**Exercice 1 — Versionner un dataset avec DVC**

Initialise DVC sur un petit projet, versionne un dataset CSV, modifie-le, puis versionne à nouveau. Vérifie que tu peux revenir à la version précédente avec `dvc checkout`.

```bash
# TODO: dvc init, dvc add, modification, nouvelle version, dvc checkout vers l'ancienne version
```

**Exercice 2 — Comparer 5 configurations avec MLflow**

Entraîne un `RandomForestClassifier` (module 3) avec 5 combinaisons différentes de `n_estimators`/`max_depth`, en loggant chaque run avec MLflow. Utilise `mlflow ui` pour identifier visuellement la meilleure combinaison.

```python
# TODO: boucle sur 5 configurations, mlflow.start_run() pour chacune
```

**Exercice 3 — Autologging sur un entraînement PyTorch**

Reprends le réseau de neurones du module 6 et active `mlflow.autolog()` ou l'intégration W&B. Vérifie quelles métriques sont capturées automatiquement, et lesquelles il faut logger manuellement en plus.

```python
# TODO: comparer autolog() vs logging manuel sur le même entraînement
```

**Exercice 4 — Model Registry**

Enregistre deux versions d'un même modèle dans le Model Registry MLflow (par exemple avant/après tuning d'hyperparamètres), assigne un alias `champion` à la meilleure, puis charge-la par cet alias pour faire une prédiction.

```python
# TODO: mlflow.register_model pour 2 versions, assigner un alias, charger via mlflow.pyfunc.load_model
```

---

## Conclusion

Le versioning des données et le suivi d'expérimentation transforment un ensemble d'essais dispersés en un processus reproductible et comparable — une exigence de base dès qu'un projet ML dépasse le stade du prototype isolé. Le module suivant passe à l'étape suivante : déployer un modèle entraîné en tant qu'API accessible, avec FastAPI et Docker.
