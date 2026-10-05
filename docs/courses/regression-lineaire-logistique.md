---
slug: regression-lineaire-logistique
title: "Régression Linéaire et Logistique"
description: "Implémenter la régression linéaire et logistique from scratch avec la descente de gradient, puis avec scikit-learn."
category: "Intelligence Artificielle & Machine Learning"
order: 2
---

# Régression Linéaire et Logistique

Ce module s'appuie directement sur le module précédent (algèbre linéaire, gradient) pour construire les deux modèles fondamentaux du Machine Learning supervisé : la régression linéaire (prédiction continue) et la régression logistique (classification binaire).

## 1. Régression linéaire

### Formulation du problème

On cherche à approximer une relation entre des variables d'entrée $X$ et une sortie continue $y$ par une fonction linéaire :

$$\hat{y} = X\theta = \theta_0 + \theta_1 x_1 + \theta_2 x_2 + \dots + \theta_n x_n$$

### Fonction de coût

On mesure l'erreur avec l'erreur quadratique moyenne (MSE) :

$$J(\theta) = \frac{1}{m} \sum_{i=1}^m (\hat{y}^{(i)} - y^{(i)})^2$$

Ce choix découle du maximum de vraisemblance sous hypothèse de bruit gaussien (vu au module 1).

### Deux façons de résoudre

**1. Équation normale (solution analytique)** :

$$\theta = (X^T X)^{-1} X^T y$$

Rapide pour peu de features, mais coûteuse ($O(n^3)$) et instable si $X^T X$ n'est pas inversible.

**2. Descente de gradient (solution itérative)** :

$$\nabla J(\theta) = \frac{2}{m} X^T (X\theta - y)$$
$$\theta \leftarrow \theta - \alpha \nabla J(\theta)$$

C'est la méthode qui généralise à tous les modèles du parcours, y compris les réseaux de neurones.

### Implémentation from scratch

```python
import numpy as np

def generer_donnees(m=100):
    np.random.seed(42)
    X = 2 * np.random.rand(m, 1)
    y = 4 + 3 * X + np.random.randn(m, 1)
    return X, y

def ajouter_biais(X):
    return np.c_[np.ones((X.shape[0], 1)), X]

def descente_de_gradient(X, y, alpha=0.1, n_iter=1000):
    m = len(y)
    theta = np.random.randn(X.shape[1], 1)
    historique_cout = []

    for _ in range(n_iter):
        gradient = (2 / m) * X.T @ (X @ theta - y)
        theta = theta - alpha * gradient
        cout = np.mean((X @ theta - y) ** 2)
        historique_cout.append(cout)

    return theta, historique_cout

X, y = generer_donnees()
X_b = ajouter_biais(X)
theta, historique = descente_de_gradient(X_b, y)
print("Theta appris :", theta.ravel())
```

### Avec scikit-learn

```python
from sklearn.linear_model import LinearRegression

modele = LinearRegression()
modele.fit(X, y)
print("Intercept :", modele.intercept_, "Coefficient :", modele.coef_)
```

### Régularisation : Ridge et Lasso

Pour limiter le surapprentissage, on pénalise les grands coefficients :

- **Ridge** (norme L2) : $J(\theta) = \text{MSE} + \lambda \sum \theta_i^2$
- **Lasso** (norme L1) : $J(\theta) = \text{MSE} + \lambda \sum |\theta_i|$

Lasso pousse certains coefficients exactement à zéro (sélection de features), Ridge les réduit sans les annuler.

```python
from sklearn.linear_model import Ridge, Lasso

ridge = Ridge(alpha=1.0).fit(X, y)
lasso = Lasso(alpha=0.1).fit(X, y)
```

---

## 2. Régression logistique

### Pourquoi pas la régression linéaire pour classifier ?

Une sortie linéaire n'est pas bornée entre 0 et 1 et n'est pas interprétable comme une probabilité. On passe la sortie linéaire dans une fonction sigmoïde :

$$\sigma(z) = \frac{1}{1 + e^{-z}}, \qquad \hat{y} = \sigma(X\theta)$$

$\sigma(z) \in (0, 1)$ s'interprète comme $P(y=1 | X)$.

### Fonction de coût : entropie croisée binaire

Le MSE n'est pas adapté (fonction non convexe avec la sigmoïde). On utilise l'entropie croisée, dérivée du maximum de vraisemblance pour une distribution de Bernoulli :

$$J(\theta) = -\frac{1}{m} \sum_{i=1}^m \left[ y^{(i)} \log(\hat{y}^{(i)}) + (1-y^{(i)}) \log(1-\hat{y}^{(i)}) \right]$$

Son gradient a une forme remarquablement simple, identique à celle de la régression linéaire :

$$\nabla J(\theta) = \frac{1}{m} X^T (\hat{y} - y)$$

### Implémentation from scratch

```python
def sigmoide(z):
    return 1 / (1 + np.exp(-z))

def descente_de_gradient_logistique(X, y, alpha=0.1, n_iter=1000):
    m, n = X.shape
    theta = np.zeros((n, 1))

    for _ in range(n_iter):
        z = X @ theta
        y_hat = sigmoide(z)
        gradient = (1 / m) * X.T @ (y_hat - y)
        theta = theta - alpha * gradient

    return theta

def predire(X, theta, seuil=0.5):
    return (sigmoide(X @ theta) >= seuil).astype(int)
```

### Avec scikit-learn

```python
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification

X_clf, y_clf = make_classification(n_samples=200, n_features=2,
                                     n_informative=2, n_redundant=0, random_state=42)

modele_log = LogisticRegression()
modele_log.fit(X_clf, y_clf)
print("Score :", modele_log.score(X_clf, y_clf))
```

### Classification multi-classes

Pour plus de deux classes, deux stratégies :
- **One-vs-Rest (OvR)** : un classifieur binaire par classe
- **Softmax (régression multinomiale)** : généralisation directe de la sigmoïde

$$\text{softmax}(z)_k = \frac{e^{z_k}}{\sum_j e^{z_j}}$$

```python
modele_multi = LogisticRegression(multi_class="multinomial", max_iter=1000)
```

---

## 3. Exercices

**Exercice 1 - Équation normale vs descente de gradient**

Génère un jeu de données linéaire bruité. Implémente la solution par équation normale et par descente de gradient. Compare les $\theta$ obtenus et le temps d'exécution.

```python
# TODO: implémenter l'équation normale
def equation_normale(X, y):
    pass

# TODO: comparer avec descente_de_gradient() définie plus haut
```

**Exercice 2 - Visualiser la convergence**

Trace la courbe de la fonction de coût en fonction du nombre d'itérations pour trois valeurs de $\alpha$ (0.01, 0.1, 0.5). Que constates-tu quand $\alpha$ est trop grand ?

```python
import matplotlib.pyplot as plt

# TODO: pour chaque alpha, appeler descente_de_gradient et tracer historique_cout
```

**Exercice 3 - Régression logistique from scratch sur données réelles**

Utilise le dataset `load_breast_cancer` de scikit-learn. Implémente ta propre régression logistique (sigmoïde + descente de gradient) et compare son accuracy à celle de `LogisticRegression` de scikit-learn.

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split

data = load_breast_cancer()
X, y = data.data, data.target.reshape(-1, 1)

# TODO: normaliser X, ajouter le biais, entraîner ton modèle from scratch
# TODO: comparer avec LogisticRegression de scikit-learn
```

**Exercice 4 - Ridge vs Lasso**

Sur un jeu de données avec des features corrélées ou inutiles, compare les coefficients appris par `LinearRegression`, `Ridge` et `Lasso`. Quel modèle met des coefficients à zéro ?

```python
# TODO: générer des données avec features inutiles (bruit)
# TODO: entraîner les 3 modèles et comparer model.coef_
```

---

## Conclusion

La régression linéaire et logistique posent le schéma que l'on retrouvera partout dans le parcours : une fonction de prédiction, une fonction de coût, un gradient, une mise à jour itérative des paramètres. Le prochain module aborde les modèles à base d'arbres (Random Forest, Gradient Boosting/XGBoost), qui suivent une logique d'apprentissage très différente.
