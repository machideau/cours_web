---
slug: feature-engineering-validation-metriques
title: "Feature Engineering, Validation Croisée et Métriques"
description: "Les outils transverses pour préparer les données, évaluer correctement un modèle et éviter le surapprentissage."
category: "Intelligence Artificielle & Machine Learning"
order: 5
---

# Feature Engineering, Validation Croisée et Métriques

Ce module clôt la partie ML classique avec les outils transverses qui s'appliquent à **tous** les modèles vus jusqu'ici (régression, arbres, SVM, k-NN) : comment préparer les données, comment évaluer honnêtement un modèle, et comment détecter l'overfitting.

## 1. Feature Engineering

### Encodage des variables catégorielles

Les modèles ne comprennent que des nombres. Deux approches principales :

**One-Hot Encoding** : crée une colonne binaire par catégorie. Adapté aux modèles linéaires, SVM, k-NN (pas d'ordre implicite créé).

```python
import pandas as pd

df = pd.DataFrame({"culture": ["maïs", "soja", "riz", "maïs"]})
df_encode = pd.get_dummies(df, columns=["culture"])
print(df_encode)
```

**Label/Ordinal Encoding** : associe un entier à chaque catégorie. Risqué pour les modèles linéaires (crée un ordre artificiel) mais sans problème pour les arbres/Random Forest/XGBoost qui découpent par seuils indépendants.

```python
from sklearn.preprocessing import LabelEncoder

encoder = LabelEncoder()
df["culture_encodee"] = encoder.fit_transform(df["culture"])
```

### Normalisation et standardisation

- **StandardScaler** : $x' = \frac{x - \mu}{\sigma}$, centre à 0 et réduit à variance 1. Indispensable pour k-NN, SVM, régression avec régularisation, réseaux de neurones.
- **MinMaxScaler** : $x' = \frac{x - x_{min}}{x_{max} - x_{min}}$, ramène entre 0 et 1.

Les modèles à base d'arbres (Random Forest, XGBoost) sont insensibles à l'échelle des features — la normalisation ne leur est pas nécessaire.

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler
```

### Création de nouvelles features

- Features polynomiales : $x_1^2$, $x_1 \times x_2$ (`PolynomialFeatures` de scikit-learn)
- Features temporelles : jour de la semaine, mois, saison, à partir d'une date
- Agrégations : moyenne/somme par groupe (déjà vu en Pandas au module 1)

### Réduction de dimension : PCA

La PCA (Analyse en Composantes Principales) projette les données sur les axes de variance maximale, en s'appuyant directement sur la décomposition en valeurs propres vue au module 1 :

$$\text{Cov}(X) \mathbf{v} = \lambda \mathbf{v}$$

Les vecteurs propres associés aux plus grandes valeurs propres deviennent les nouveaux axes (composantes principales).

```python
from sklearn.decomposition import PCA

pca = PCA(n_components=2)
X_reduit = pca.fit_transform(X_train_scaled)
print("Variance expliquée :", pca.explained_variance_ratio_)
```

---

## 2. Validation croisée

### Le problème du simple train/test split

Un seul découpage train/test donne une estimation bruitée de la performance : selon les points qui tombent dans le test set, le score peut varier significativement, surtout sur peu de données.

### k-fold cross-validation

On découpe les données en $k$ blocs (folds). À chaque itération, un fold sert de test et les $k-1$ autres d'entraînement. On répète $k$ fois et on moyenne les scores.

```python
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import RandomForestClassifier

modele = RandomForestClassifier(n_estimators=100, random_state=42)
scores = cross_val_score(modele, X, y, cv=5, scoring="accuracy")
print("Scores par fold :", scores)
print("Moyenne :", scores.mean(), "Écart-type :", scores.std())
```

### Stratified k-fold

Pour la classification, surtout avec des classes déséquilibrées, on préserve la même proportion de chaque classe dans chaque fold.

```python
from sklearn.model_selection import StratifiedKFold

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(modele, X, y, cv=skf)
```

### Recherche d'hyperparamètres : GridSearch et RandomizedSearch

```python
from sklearn.model_selection import GridSearchCV

grille = {
    "n_estimators": [100, 200, 300],
    "max_depth": [3, 5, 10, None]
}

recherche = GridSearchCV(RandomForestClassifier(random_state=42), grille, cv=5, scoring="accuracy")
recherche.fit(X, y)
print("Meilleurs paramètres :", recherche.best_params_)
```

`GridSearchCV` teste toutes les combinaisons (coûteux) ; `RandomizedSearchCV` échantillonne aléatoirement un sous-ensemble de combinaisons, souvent suffisant en pratique.

---

## 3. Métriques d'évaluation

### Régression

- **MAE** (erreur absolue moyenne) : $\frac{1}{m}\sum |y_i - \hat{y}_i|$, robuste aux outliers
- **MSE / RMSE** : pénalise davantage les grandes erreurs
- **R²** : proportion de variance expliquée par le modèle (1 = parfait, 0 = équivalent à prédire la moyenne)

```python
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
```

### Classification

**Matrice de confusion** : base de toutes les métriques de classification.

| | Prédit positif | Prédit négatif |
|---|---|---|
| **Réel positif** | Vrai Positif (VP) | Faux Négatif (FN) |
| **Réel négatif** | Faux Positif (FP) | Vrai Négatif (VN) |

- **Accuracy** : $\frac{VP+VN}{VP+VN+FP+FN}$ — trompeuse sur classes déséquilibrées
- **Précision** : $\frac{VP}{VP+FP}$ — parmi les prédits positifs, combien le sont vraiment
- **Rappel (recall)** : $\frac{VP}{VP+FN}$ — parmi les vrais positifs, combien sont détectés
- **F1-score** : moyenne harmonique de précision et rappel, $\frac{2 \cdot P \cdot R}{P+R}$

Le choix entre optimiser précision ou rappel dépend du coût métier des erreurs : un diagnostic médical privilégie le rappel (ne pas rater de cas positifs), un filtre anti-spam privilégie la précision (ne pas bloquer de vrais messages).

```python
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

predictions = modele.predict(X_test)
print(confusion_matrix(y_test, predictions))
print(classification_report(y_test, predictions))
```

**Courbe ROC et AUC** : trace le taux de vrais positifs contre le taux de faux positifs pour tous les seuils de décision possibles. L'AUC (aire sous la courbe) résume cette courbe en un seul score (1 = parfait, 0.5 = aléatoire).

---

## 4. Surapprentissage et sous-apprentissage

### Diagnostic par courbe d'apprentissage

En traçant l'erreur d'entraînement et de validation en fonction de la taille du dataset (ou de la complexité du modèle) :
- **Sous-apprentissage (underfitting)** : erreur élevée sur train ET validation → modèle trop simple
- **Surapprentissage (overfitting)** : erreur faible sur train, élevée sur validation → modèle trop complexe ou pas assez de données

```python
from sklearn.model_selection import learning_curve
import numpy as np
import matplotlib.pyplot as plt

tailles, scores_train, scores_val = learning_curve(
    modele, X, y, cv=5, train_sizes=np.linspace(0.1, 1.0, 10)
)

plt.plot(tailles, scores_train.mean(axis=1), label="Train")
plt.plot(tailles, scores_val.mean(axis=1), label="Validation")
plt.legend()
plt.show()
```

### Le compromis biais-variance

- **Biais** : erreur due à des hypothèses trop simplificatrices du modèle (sous-apprentissage)
- **Variance** : sensibilité excessive aux fluctuations des données d'entraînement (surapprentissage)

$$\text{Erreur totale} = \text{Biais}^2 + \text{Variance} + \text{Bruit irréductible}$$

Ce compromis explique pourquoi Random Forest (haute variance individuelle des arbres, réduite par le bagging) et la régularisation Ridge/Lasso (réduction de variance au prix d'un peu de biais) fonctionnent.

---

## 5. Exercices

**Exercice 1 — Comparer encodages**

Sur un dataset avec une variable catégorielle à plusieurs modalités, entraîne une régression logistique avec One-Hot Encoding, puis avec Label Encoding. Compare les performances et explique la différence.

```python
# TODO: comparer les deux encodages avec LogisticRegression
```

**Exercice 2 — Cross-validation manuelle**

Implémente toi-même un k-fold cross-validation (sans `cross_val_score`) : découpe manuellement les indices en k blocs, entraîne/évalue k fois, moyenne les scores.

```python
def k_fold_manuel(X, y, modele, k=5):
    # TODO: découper les indices, boucler, entraîner, évaluer, moyenner
    pass
```

**Exercice 3 — Précision vs rappel selon le contexte**

Sur `load_breast_cancer`, entraîne une régression logistique et ajuste le seuil de décision (au lieu de 0.5) pour maximiser le rappel. Trace la courbe précision/rappel en fonction du seuil.

```python
from sklearn.metrics import precision_recall_curve
# TODO: tracer précision et rappel en fonction du seuil de décision
```

**Exercice 4 — Diagnostic biais/variance**

Sur un dataset de ton choix, trace la courbe d'apprentissage pour trois modèles de complexité croissante (ex : régression linéaire, arbre profondeur 3, arbre sans limite de profondeur). Identifie lequel underfit et lequel overfit.

```python
# TODO: utiliser learning_curve pour les 3 modèles et comparer les courbes
```

---

## Conclusion

Ce module clôt la partie ML classique du parcours. Vous savez maintenant préparer des données (encodage, normalisation, PCA), évaluer un modèle honnêtement (cross-validation, métriques adaptées au contexte) et diagnostiquer les problèmes de biais/variance. La partie suivante aborde le Deep Learning, en commençant par la construction d'un réseau de neurones from scratch, avant de passer à PyTorch et TensorFlow.
