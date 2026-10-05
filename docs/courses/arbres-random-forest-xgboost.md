---
slug: arbres-random-forest-xgboost
title: "Arbres de Décision, Random Forest et Gradient Boosting"
description: "Comprendre et implémenter les modèles à base d'arbres : arbres de décision, forêts aléatoires et boosting de gradient avec XGBoost."
category: "Intelligence Artificielle & Machine Learning"
order: 3
---

# Arbres de Décision, Random Forest et Gradient Boosting

Après les modèles linéaires, ce module aborde une famille de modèles très différente : les arbres de décision et leurs ensembles (Random Forest, Gradient Boosting). Ces modèles dominent encore aujourd'hui le ML sur données tabulaires.

## 1. Arbre de décision

### Principe

Un arbre de décision découpe récursivement l'espace des features en régions, en posant des questions du type $x_i \leq \text{seuil}$ ?. Chaque feuille de l'arbre donne une prédiction (une classe ou une valeur moyenne).

### Critères de split

Pour la **classification**, on cherche le split qui réduit le plus l'impureté :

**Gini** :
 $$Gini = 1 - \sum_{k=1}^K p_k^2$$


**Entropie** :
 $$H = -\sum_{k=1}^K p_k \log_2(p_k)$$

où $p_k$ est la proportion de la classe $k$ dans le nœud.

Pour la **régression**, on minimise la variance (MSE) au sein de chaque sous-groupe créé par le split.

### Sur/sous-apprentissage

Un arbre non contraint mémorise parfaitement les données d'entraînement (overfitting). On contrôle sa complexité via :
- `max_depth` : profondeur maximale
- `min_samples_split` / `min_samples_leaf` : nombre minimal d'échantillons pour split/feuille
- `max_features` : nombre de features considérées à chaque split

```python
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.datasets import load_iris
import matplotlib.pyplot as plt

data = load_iris()
X, y = data.data, data.target

arbre = DecisionTreeClassifier(max_depth=3, criterion="gini", random_state=42)
arbre.fit(X, y)

plt.figure(figsize=(12, 8))
plot_tree(arbre, feature_names=data.feature_names, class_names=data.target_names, filled=True)
plt.show()
```

### Implémentation simplifiée du critère Gini

```python
import numpy as np

def gini(y):
    classes, comptes = np.unique(y, return_counts=True)
    proportions = comptes / len(y)
    return 1 - np.sum(proportions ** 2)

def gini_split(y_gauche, y_droite):
    m = len(y_gauche) + len(y_droite)
    return (len(y_gauche) / m) * gini(y_gauche) + (len(y_droite) / m) * gini(y_droite)
```

---

## 2. Random Forest (Bagging)

### Principe : Bootstrap Aggregating

Un Random Forest entraîne un grand nombre d'arbres indépendants, chacun sur :
- un **échantillon bootstrap** (tirage aléatoire avec remise des lignes)
- un **sous-ensemble aléatoire de features** à chaque split

La prédiction finale est la moyenne (régression) ou le vote majoritaire (classification) de tous les arbres. Cela réduit fortement la variance par rapport à un arbre unique, sans trop augmenter le biais.

### Pourquoi ça marche

Des arbres individuellement overfittés, mais décorrélés entre eux (grâce au double aléa bootstrap + features), voient leurs erreurs s'annuler en moyenne. C'est le principe théorique de la réduction de variance par agrégation de modèles peu corrélés.

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

foret = RandomForestClassifier(n_estimators=200, max_depth=5, random_state=42)
foret.fit(X_train, y_train)
predictions = foret.predict(X_test)
print("Accuracy :", accuracy_score(y_test, predictions))

# Importance des features
for nom, importance in zip(data.feature_names, foret.feature_importances_):
    print(f"{nom} : {importance:.3f}")
```

---

## 3. Gradient Boosting et XGBoost

### Principe : Boosting séquentiel

Contrairement au bagging (arbres indépendants), le boosting construit les arbres **séquentiellement** : chaque nouvel arbre corrige les erreurs (résidus) du modèle précédent.

Pour la régression, à l'itération $t$ :

$$F_t(x) = F_{t-1}(x) + \eta \cdot h_t(x)$$

où $h_t$ est un arbre entraîné à prédire le résidu $y - F_{t-1}(x)$, et $\eta$ le taux d'apprentissage (shrinkage).

### XGBoost : Gradient Boosting optimisé

XGBoost ajoute au Gradient Boosting classique :
- une régularisation explicite (L1/L2 sur les poids des feuilles) contre l'overfitting
- une approximation de second ordre (utilisation du gradient **et** de la hessienne, vus au module 1)
- du parallélisme et une gestion efficace des valeurs manquantes

```python
import xgboost as xgb
from sklearn.metrics import accuracy_score

modele_xgb = xgb.XGBClassifier(
    n_estimators=200,
    max_depth=4,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)
modele_xgb.fit(X_train, y_train)
predictions = modele_xgb.predict(X_test)
print("Accuracy XGBoost :", accuracy_score(y_test, predictions))
```

### Hyperparamètres clés à retenir

| Paramètre | Rôle |
|---|---|
| `n_estimators` | Nombre d'arbres |
| `learning_rate` | Poids de chaque arbre ajouté (shrinkage) |
| `max_depth` | Complexité de chaque arbre |
| `subsample` | Fraction des lignes utilisées par arbre (réduit l'overfitting) |
| `colsample_bytree` | Fraction des features utilisées par arbre |

Un `learning_rate` faible nécessite plus d'arbres mais généralise généralement mieux.

---

## 4. Exercices

**Exercice 1 - Gini à la main**

Pour un nœud contenant 10 échantillons (6 classe A, 4 classe B), calcule le Gini à la main. Vérifie avec la fonction `gini()` définie plus haut. Puis calcule le Gini pondéré si ce nœud est splitté en deux groupes de tailles (7, 3).

```python
# TODO: vérifier le calcul manuel avec la fonction gini()
y_noeud = np.array([0]*6 + [1]*4)
```

**Exercice 2 - Impact de max_depth sur l'overfitting**

Entraîne un `DecisionTreeClassifier` sur le dataset Iris pour `max_depth` allant de 1 à 15. Trace l'accuracy sur train et sur test en fonction de `max_depth`. À partir de quelle profondeur observes-tu de l'overfitting ?

```python
# TODO: boucle sur max_depth, stocker accuracy train/test, tracer avec matplotlib
```

**Exercice 3 - Random Forest vs arbre unique**

Compare un `DecisionTreeClassifier` seul et un `RandomForestClassifier` (même profondeur max) sur un dataset bruité. Répète l'entraînement 10 fois avec des splits différents et compare la variance des scores obtenus.

```python
# TODO: boucle de 10 entraînements avec random_state différent
# TODO: comparer la moyenne et l'écart-type des accuracy des deux modèles
```

**Exercice 4 - Tuning XGBoost**

Sur le dataset `load_breast_cancer`, teste plusieurs combinaisons de `learning_rate` (0.01, 0.1, 0.3) et `n_estimators` (50, 200, 500) avec XGBoost. Identifie la meilleure combinaison par validation croisée.

```python
from sklearn.model_selection import GridSearchCV

# TODO: définir la grille de paramètres et utiliser GridSearchCV avec XGBClassifier
```

---

## Conclusion

Arbres, Random Forest et Gradient Boosting couvrent l'essentiel des modèles utilisés en production sur données tabulaires. Le module suivant aborde SVM, k-NN et le clustering (k-means, DBSCAN), avant de clore la partie ML classique avec la validation croisée et le feature engineering.
