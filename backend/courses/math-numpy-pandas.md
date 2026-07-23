---
slug: fondations-maths-numpy-pandas
title: "Fondations Mathématiques, NumPy et Pandas"
description: "Les bases d'algèbre linéaire, calcul différentiel et probabilités nécessaires au Machine Learning, avec mise en pratique via NumPy et Pandas."
category: "Intelligence Artificielle & Machine Learning"
order: 3
resources:
  - title: "exercice-1.pdf"
    url: "/downloads/exercice-np-1.pdf"
---

# Fondations Mathématiques, NumPy et Pandas

Ce module pose les bases mathématiques et les outils Python indispensables à tout le reste du parcours Machine Learning : algèbre linéaire, calcul différentiel, probabilités/statistiques, puis manipulation de données avec NumPy et Pandas.

## 1. Algèbre linéaire

### Scalaires, vecteurs, matrices, tenseurs

- **Scalaire** : un nombre unique, noté $a \in \mathbb{R}$.
- **Vecteur** : un tableau ordonné de nombres, $\mathbf{x} \in \mathbb{R}^n$.
- **Matrice** : un tableau 2D, $A \in \mathbb{R}^{m \times n}$ ($m$ lignes, $n$ colonnes).
- **Tenseur** : généralisation à $n$ dimensions (un batch d'images est un tenseur 4D : `[batch, canaux, hauteur, largeur]`).

### Opérations vectorielles

**Produit scalaire (dot product)**, opération centrale du ML (régression linéaire, couches de neurones, similarité cosinus) :

$$\mathbf{x} \cdot \mathbf{y} = \sum_{i=1}^n x_i y_i$$

**Normes** :
- L2 (euclidienne) : $\|\mathbf{x}\|_2 = \sqrt{\sum_i x_i^2}$
- L1 (Manhattan) : $\|\mathbf{x}\|_1 = \sum_i |x_i|$

La norme L2 apparaît dans la régularisation Ridge, la norme L1 dans Lasso.

**Similarité cosinus** (NLP, recommandation) :

$$\cos(\theta) = \frac{\mathbf{x} \cdot \mathbf{y}}{\|\mathbf{x}\|_2 \|\mathbf{y}\|_2}$$

### Opérations matricielles

**Multiplication matricielle** : $C = AB$, avec $A \in \mathbb{R}^{m \times k}$, $B \in \mathbb{R}^{k \times n}$ :

$$C_{ij} = \sum_{l=1}^k A_{il} B_{lj}$$

**Transposée** : $(AB)^T = B^T A^T$.

**Inverse** : $A^{-1}$ telle que $AA^{-1} = I$, utilisée dans l'équation normale de la régression linéaire :

$$\theta = (X^T X)^{-1} X^T y$$

**Déterminant** : indique si $A$ est inversible ($\det(A) \neq 0$).

**Valeurs propres / vecteurs propres** : $A\mathbf{v} = \lambda \mathbf{v}$, base de la PCA.

**Décomposition SVD** : $A = U \Sigma V^T$, utilisée en réduction de dimension et systèmes de recommandation.

---

## 2. Calcul différentiel

### Gradient

Pour $f(x_1, ..., x_n)$, le gradient est le vecteur des dérivées partielles :

$$\nabla f = \begin{bmatrix} \frac{\partial f}{\partial x_1} \\ \vdots \\ \frac{\partial f}{\partial x_n} \end{bmatrix}$$

La **descente de gradient**, cœur de l'entraînement de tout modèle ML/DL, avance dans la direction opposée au gradient :

$$\theta \leftarrow \theta - \alpha \nabla f(\theta)$$

où $\alpha$ est le taux d'apprentissage (learning rate).

### Règle de la chaîne (chain rule)

$$\frac{d}{dx} f(g(x)) = f'(g(x)) \cdot g'(x)$$

C'est le principe exact derrière la **rétropropagation**, que nous coderons from scratch plus loin dans le parcours. Un réseau de neurones est une composition de fonctions ; la chain rule permet de calculer le gradient de la perte par rapport à chaque poids, couche par couche.

---

## 3. Probabilités et statistiques

### Distributions clés

- **Bernoulli** : succès/échec (base de la régression logistique)
- **Gaussienne** : $\mathcal{N}(\mu, \sigma^2)$, densité $f(x) = \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}$

### Espérance, variance

$$\mathbb{E}[X] = \sum_i x_i P(x_i), \qquad \text{Var}(X) = \mathbb{E}[(X - \mathbb{E}[X])^2]$$

### Théorème de Bayes

$$P(A|B) = \frac{P(B|A) P(A)}{P(B)}$$

Fondamental pour Naive Bayes et l'inférence bayésienne.

### Maximum de vraisemblance

Principe qui justifie pourquoi on minimise l'erreur quadratique en régression et l'entropie croisée en classification : on cherche les paramètres qui maximisent la probabilité des données observées.

---

## 4. NumPy — calcul vectorisé

NumPy est la brique de base de tout l'écosystème ML Python (scikit-learn, PyTorch et TensorFlow s'en inspirent directement pour leurs API tensorielles).

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([[1, 2], [3, 4]])
print("Vecteur :", a)
print("Matrice :\n", b)
print("Shape de b :", b.shape)
```

### Broadcasting

Le broadcasting permet d'effectuer des opérations entre tableaux de dimensions différentes sans boucle explicite.

```python
M = np.array([[1, 2, 3], [4, 5, 6]])
print(M + 10)  # broadcasting scalaire

v = np.array([1, 0, -1])
print(M + v)   # broadcasting vecteur
```

### Algèbre linéaire en NumPy

```python
A = np.array([[2, 0], [0, 3]])
x = np.array([1, 1])

print("A @ x =", A @ x)
print("Inverse de A :\n", np.linalg.inv(A))
print("Déterminant de A :", np.linalg.det(A))

valeurs, vecteurs = np.linalg.eig(A)
print("Valeurs propres :", valeurs)
```

---

## 5. Pandas — préparation de données

```python
import pandas as pd

df = pd.DataFrame({
    "produit": ["riz", "maïs", "soja"],
    "prix": [500, 300, 700],
    "quantite": [10, 25, 5]
})
print(df.describe())
```

### Filtrage et groupby

```python
print(df[df["prix"] > 400])

df["total"] = df["prix"] * df["quantite"]
df["categorie"] = ["céréale", "céréale", "légumineuse"]
print(df.groupby("categorie")["total"].sum())
```

### Nettoyage de données

```python
df_sale = df.copy()
df_sale.loc[1, "prix"] = None

print("Valeurs manquantes :\n", df_sale.isnull().sum())
df_sale["prix"] = df_sale["prix"].fillna(df_sale["prix"].mean())
```

---

## 6. Exercices

**Exercice 1 — Algèbre linéaire à la main puis en NumPy**

Soit $A = \begin{bmatrix} 4 & 2 \\ 1 & 3 \end{bmatrix}$ et $\mathbf{x} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}$. Calcule à la main $A\mathbf{x}$, $\det(A)$, $A^{-1}$, puis vérifie avec NumPy.

```python
A = np.array([[4, 2], [1, 3]])
x = np.array([1, 2])

# TODO: Ax, det(A), A^-1
```

**Exercice 2 — Descente de gradient à la main**

Soit $f(x) = (x-3)^2$. Calcule $f'(x)$, puis effectue 5 itérations de descente de gradient à la main depuis $x_0 = 0$ avec $\alpha = 0.1$. Code-le ensuite en Python.

```python
def f(x):
    return (x - 3)**2

def f_prime(x):
    # TODO
    pass

x = 0
alpha = 0.1
for i in range(5):
    # TODO: mets à jour x
    print(f"Itération {i+1}: x = {x}, f(x) = {f(x)}")
```

**Exercice 3 — Statistiques descriptives**

Génère 1000 échantillons de $\mathcal{N}(50, 10)$ avec `np.random.normal`. Calcule la moyenne et la variance à la main (sans `np.mean`/`np.var`), puis vérifie.

```python
np.random.seed(42)
echantillon = np.random.normal(loc=50, scale=10, size=1000)

# TODO: moyenne et variance manuelles vs np.mean/np.var
```

**Exercice 4 — Pandas appliqué**

Charge ce jeu de données agricole fictif, impute la valeur manquante par la moyenne de la culture correspondante, calcule le prix moyen par culture et identifie la plus rentable.

```python
data = pd.DataFrame({
    "culture": ["maïs", "maïs", "soja", "soja", "riz", "riz"],
    "mois": [1, 2, 1, 2, 1, 2],
    "prix": [300, 320, 700, None, 500, 480]
})

# TODO: imputation par groupby + transform
# TODO: prix moyen par culture
# TODO: culture la plus rentable
```

---

## Conclusion

Vous maîtrisez désormais les briques mathématiques (algèbre linéaire, gradient, probabilités) et les outils Python (NumPy, Pandas) qui reviendront dans chaque module suivant. Dans le prochain cours, nous verrons la régression linéaire et logistique, en les implémentant from scratch avec la descente de gradient vue ici, puis avec scikit-learn.