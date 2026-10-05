---
slug: monitoring-mise-a-jour-scalabilite
title: "Monitoring, Mise à Jour de Modèle et Scalabilité"
description: "Surveiller un modèle en production, détecter la dérive des données, planifier le réentraînement, et poser les bases de la scalabilité."
category: "Intelligence Artificielle & Machine Learning"
order: 13
---

# Monitoring, Mise à Jour de Modèle et Scalabilité

Dernier module du parcours. Un modèle déployé (module 12) n'est pas figé : les données réelles évoluent, la performance se dégrade avec le temps, et le trafic peut augmenter. Ce module couvre ce qui se passe après la mise en production.

## 1. Pourquoi un modèle en production se dégrade

### Data drift (dérive des données)

La distribution des données d'entrée en production diverge progressivement de celle utilisée à l'entraînement (nouveaux comportements utilisateurs, saisonnalité, évolution du marché). Le modèle continue de faire des prédictions, mais sur des données qu'il n'a jamais vues sous cette forme.

### Concept drift (dérive du concept)

La relation entre les features et la cible change elle-même (ex : ce qui définissait une transaction frauduleuse évolue avec les techniques de fraude). Contrairement au data drift, même une distribution de features stable ne protège pas de ce phénomène.

## 2. Détecter la dérive

### Comparaison statistique des distributions

On compare la distribution des features en production à celle de l'entraînement, avec des tests statistiques comme le test de Kolmogorov-Smirnov ou la divergence de Kullback-Leibler (extension du concept d'entropie croisée vu au module 2).

```python
from scipy.stats import ks_2samp

statistique, p_valeur = ks_2samp(distribution_entrainement, distribution_production)
if p_valeur < 0.05:
    print("Dérive significative détectée sur cette feature")
```

### Suivi de la performance réelle

Si les vrais labels deviennent disponibles avec un délai (ex : un client confirme ou non une fraude après enquête), on peut recalculer les métriques du module 5 (accuracy, F1, RMSE) en continu et déclencher une alerte si elles chutent sous un seuil.

```python
import mlflow  # module 11

with mlflow.start_run(run_name="monitoring-production"):
    mlflow.log_metric("accuracy_production", accuracy_actuelle)
    if accuracy_actuelle < seuil_alerte:
        envoyer_alerte("Dégradation de performance détectée")
```

### Outils dédiés

Des librairies comme `Evidently AI` ou `whylogs` automatisent la génération de rapports de dérive, avec des dashboards prêts à l'emploi comparant distributions d'entraînement et de production.

## 3. Journaliser les prédictions

Pour pouvoir diagnostiquer un problème a posteriori, il faut journaliser systématiquement : l'entrée reçue, la prédiction faite, le score de confiance, et (dès qu'il est connu) le label réel.

```python
# Ajout à l'API FastAPI du module 12
import logging
import json
from datetime import datetime

logging.basicConfig(filename="predictions.log", level=logging.INFO)

@app.post("/predire")
def predire(donnees: DonneesEntree):
    prediction = modele.predict(...)

    logging.info(json.dumps({
        "timestamp": datetime.utcnow().isoformat(),
        "entree": donnees.dict(),
        "prediction": int(prediction[0])
    }))

    return {"classe_predite": int(prediction[0])}
```

## 4. Stratégies de mise à jour du modèle

### Réentraînement périodique

Le plus simple : réentraîner à intervalle fixe (hebdomadaire, mensuel) sur les données les plus récentes, en réutilisant le pipeline de versioning (DVC) et de tracking (MLflow) du module 11.

### Réentraînement déclenché par seuil

Réentraîner uniquement quand la dérive dépasse un seuil défini - évite les réentraînements inutiles quand les données sont stables.

### Déploiement progressif

**Shadow deployment** : le nouveau modèle reçoit le même trafic que l'ancien en parallèle, mais ses prédictions ne sont pas utilisées - uniquement comparées à celles du modèle en production, pour valider sa performance sans risque.

**Canary deployment** : le nouveau modèle ne reçoit qu'une petite fraction du trafic réel (ex : 5%) ; si les métriques restent bonnes, la fraction augmente progressivement jusqu'à 100%.

**A/B testing** : deux modèles servent des utilisateurs différents simultanément, pour comparer leur impact sur une métrique métier (taux de conversion, satisfaction) et pas seulement une métrique ML.

```python
import random

@app.post("/predire")
def predire(donnees: DonneesEntree):
    if random.random() < 0.05:  # 5% de canary
        prediction = nouveau_modele.predict(...)
        version_utilisee = "v2-canary"
    else:
        prediction = modele_production.predict(...)
        version_utilisee = "v1-production"

    logging.info(json.dumps({"version": version_utilisee, "prediction": int(prediction[0])}))
    return {"classe_predite": int(prediction[0])}
```

## 5. Bases de la scalabilité

### Scaling vertical vs horizontal

- **Vertical** : donner plus de ressources (CPU, RAM, GPU) à une seule instance - limite rapidement atteinte
- **Horizontal** : dupliquer l'API sur plusieurs instances derrière un load balancer - approche standard en production

### Plusieurs instances avec Docker Compose

```yaml
services:
  api:
    build: .
    deploy:
      replicas: 3
  load_balancer:
    image: nginx
    ports:
      - "80:80"
    depends_on:
      - api
```

En production réelle, cette orchestration est généralement déléguée à Kubernetes, qui gère automatiquement le nombre de répliques selon la charge (auto-scaling).

### Optimiser la latence d'inférence

- **Batching** : regrouper plusieurs requêtes avant inférence plutôt qu'une par une, surtout utile pour les modèles Transformer (module 9-10)
- **Quantification** : réduire la précision numérique des poids (ex : float32 → int8) pour accélérer l'inférence, au prix d'une légère perte de précision - déjà rencontrée avec QLoRA au module 10
- **Cache** : mettre en cache les prédictions pour des entrées identiques ou très fréquentes

### Modèles plus légers pour la production

Un modèle complexe (ex : ensemble de plusieurs XGBoost, ou grand Transformer) peut être distillé en un modèle plus petit (distillation de connaissance) qui approche sa performance à une fraction du coût d'inférence - logique similaire au transfer learning vu au module 8, mais appliquée dans l'autre sens (du grand modèle vers le petit).

---

## 6. Exercices

**Exercice 1 - Simuler et détecter un data drift**

Entraîne un modèle sur un dataset, puis génère artificiellement des données "de production" avec une distribution légèrement décalée (ex : ajouter un biais aux features). Applique un test de Kolmogorov-Smirnov pour détecter la dérive.

```python
# TODO: générer 2 distributions légèrement différentes, appliquer ks_2samp, interpréter la p-valeur
```

**Exercice 2 - Journalisation complète d'une API**

Reprends l'API FastAPI du module 12 et ajoute la journalisation systématique de chaque requête/prédiction dans un fichier. Écris un script qui relit ce log et calcule la distribution des prédictions sur une période donnée.

```python
# TODO: ajouter le logging à l'API, écrire un script d'analyse du fichier de log
```

**Exercice 3 - Canary deployment simulé**

Simule un canary deployment entre deux versions d'un modèle (ex : Random Forest avec deux jeux d'hyperparamètres différents) sur un flux de requêtes simulées. Fais varier progressivement la fraction de trafic vers le nouveau modèle et logge les performances de chaque version séparément.

```python
# TODO: simuler un flux de requêtes, router selon une fraction croissante, comparer les accuracy loggées
```

**Exercice 4 - Mesurer l'impact du batching sur la latence**

Sur un modèle Hugging Face (module 10), compare le temps total d'inférence sur 100 textes traités un par un versus en un seul batch. Quantifie le gain apporté par le batching.

```python
import time
# TODO: mesurer le temps pour 100 inférences individuelles vs 1 inférence batchée de 100 textes
```

---

## Conclusion du parcours

Ce dernier module boucle la boucle : d'un modèle mathématique (module 1) à un système complet, surveillé et maintenu en production. L'ensemble des 13 modules couvre le cycle complet du Machine Learning moderne : fondations mathématiques, ML classique, deep learning from scratch puis avec PyTorch/TensorFlow, écosystème open-source (Hugging Face), et opérationnalisation (versioning, déploiement, monitoring). Vous disposez maintenant des bases pour construire, entraîner, déployer et maintenir des modèles ML en conditions réelles.
