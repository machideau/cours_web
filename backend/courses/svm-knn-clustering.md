---
slug: svm-knn-clustering
title: "SVM, k-NN et Clustering (k-means, DBSCAN)"
description: "Machines à vecteurs de support, k plus proches voisins, et algorithmes de clustering pour l'apprentissage non supervisé."
category: "Intelligence Artificielle & Machine Learning"
order: 4
---

# SVM, k-NN et Clustering (k-means, DBSCAN)

Ce module couvre deux approches supervisées supplémentaires (SVM, k-NN) puis bascule vers l'apprentissage **non supervisé** avec le clustering, où il n'y a plus de label $y$ à prédire.

## 1. Support Vector Machine (SVM)

### Principe : maximiser la marge

Le SVM cherche l'hyperplan séparateur qui maximise la marge entre les deux classes, c'est-à-dire la distance entre l'hyperplan et les points les plus proches de chaque classe (les **vecteurs de support**).

Pour un hyperplan $\mathbf{w} \cdot \mathbf{x} + b = 0$, la marge vaut $\frac{2}{\|\mathbf{w}\|}$. Maximiser la marge revient à minimiser $\|\mathbf{w}\|$ sous contrainte que chaque point soit bien classé :

$$\min_{\mathbf{w}, b} \frac{1}{2}\|\mathbf{w}\|^2 \quad \text{sujet à} \quad y_i(\mathbf{w} \cdot \mathbf{x}_i + b) \geq 1$$

### Marge souple (soft margin)

En pratique, les données ne sont pas parfaitement séparables. On introduit des variables d'écart $\xi_i$ et un hyperparamètre $C$ qui contrôle le compromis entre marge large et erreurs tolérées :

$$\min_{\mathbf{w}, b, \xi} \frac{1}{2}\|\mathbf{w}\|^2 + C \sum_i \xi_i$$

Un $C$ grand pénalise fortement les erreurs (marge étroite, risque d'overfitting) ; un $C$ petit tolère plus d'erreurs (marge large, plus de biais).

### Le kernel trick

Pour des données non linéairement séparables, on projette implicitement les données dans un espace de dimension supérieure via une fonction noyau $K(\mathbf{x}_i, \mathbf{x}_j)$, sans jamais calculer explicitement cette projection.

Noyaux courants :
- **Linéaire** : $K(x_i, x_j) = x_i \cdot x_j$
- **RBF (gaussien)** : $K(x_i, x_j) = e^{-\gamma \|x_i - x_j\|^2}$
- **Polynomial** : $K(x_i, x_j) = (x_i \cdot x_j + c)^d$

```python
from sklearn.svm import SVC
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split

X, y = make_moons(n_samples=300, noise=0.2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

svm_rbf = SVC(kernel="rbf", C=1.0, gamma="scale")
svm_rbf.fit(X_train, y_train)
print("Accuracy SVM RBF :", svm_rbf.score(X_test, y_test))
```

---

## 2. k plus proches voisins (k-NN)

### Principe

k-NN est un algorithme **non paramétrique** et **paresseux** (lazy learning) : il ne construit aucun modèle à l'entraînement, il stocke simplement les données. Pour prédire, il cherche les $k$ points d'entraînement les plus proches (souvent par distance euclidienne, voir norme L2 du module 1) et :
- vote majoritaire pour la classification
- moyenne pour la régression

### Choix de k

- $k$ trop petit → sensible au bruit, forte variance
- $k$ trop grand → frontière trop lisse, sous-apprentissage (biais)

Le choix optimal se fait par validation croisée (module 5).

```python
from sklearn.neighbors import KNeighborsClassifier

for k in [1, 5, 15, 30]:
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train, y_train)
    print(f"k={k} : accuracy = {knn.score(X_test, y_test):.3f}")
```

### Importance de la normalisation

k-NN se base sur des distances : une feature avec une grande échelle domine artificiellement le calcul. Il faut systématiquement standardiser les données avant utilisation.

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
```

---

## 3. Clustering — apprentissage non supervisé

### k-means

k-means partitionne les données en $k$ groupes en minimisant l'inertie intra-cluster :

$$J = \sum_{k=1}^K \sum_{x_i \in C_k} \|x_i - \mu_k\|^2$$

**Algorithme (itératif)** :
1. Initialiser $k$ centroïdes aléatoirement
2. Assigner chaque point au centroïde le plus proche
3. Recalculer chaque centroïde comme la moyenne des points assignés
4. Répéter jusqu'à convergence

```python
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs

X_blobs, _ = make_blobs(n_samples=300, centers=4, random_state=42)

kmeans = KMeans(n_clusters=4, n_init=10, random_state=42)
labels = kmeans.fit_predict(X_blobs)
print("Centroïdes :\n", kmeans.cluster_centers_)
```

### Choisir k : méthode du coude (elbow method)

On trace l'inertie en fonction de $k$ et on cherche le "coude" où l'ajout d'un cluster n'apporte plus de gain significatif.

```python
import matplotlib.pyplot as plt

inerties = []
for k in range(1, 10):
    km = KMeans(n_clusters=k, n_init=10, random_state=42).fit(X_blobs)
    inerties.append(km.inertia_)

plt.plot(range(1, 10), inerties, marker="o")
plt.xlabel("k")
plt.ylabel("Inertie")
plt.show()
```

### DBSCAN (Density-Based Spatial Clustering)

Contrairement à k-means, DBSCAN ne nécessite pas de fixer $k$ à l'avance et détecte automatiquement les points aberrants (bruit). Il regroupe les points selon leur densité locale, définie par deux paramètres :
- `eps` : rayon de voisinage
- `min_samples` : nombre minimal de points pour former une zone dense

DBSCAN excelle sur des clusters de formes non convexes (que k-means échoue à séparer, car k-means suppose des clusters sphériques).

```python
from sklearn.cluster import DBSCAN

dbscan = DBSCAN(eps=0.3, min_samples=5)
labels_dbscan = dbscan.fit_predict(X)  # sur le dataset make_moons plus haut
```

---

## 4. Exercices

**Exercice 1 — Effet du paramètre C sur le SVM**

Sur `make_moons`, entraîne un SVM à noyau RBF pour `C` = 0.01, 1, 100. Visualise la frontière de décision pour chaque valeur (avec `matplotlib`). Que se passe-t-il quand `C` est très grand ?

```python
# TODO: entraîner 3 SVM avec différents C, visualiser les frontières de décision
```

**Exercice 2 — k-NN : impact de la normalisation**

Charge `load_wine` de scikit-learn (features à échelles très différentes). Compare l'accuracy d'un k-NN entraîné avec et sans `StandardScaler`. Quelle est la différence ?

```python
from sklearn.datasets import load_wine
# TODO: comparer un pipeline avec/sans StandardScaler + KNeighborsClassifier
```

**Exercice 3 — Méthode du coude implémentée**

Sur un dataset `make_blobs` de ton choix, implémente toi-même le calcul de l'inertie pour différentes valeurs de k (sans utiliser `kmeans.inertia_`), et retrouve le bon nombre de clusters.

```python
def inertie_manuelle(X, labels, centroides):
    # TODO: somme des distances au carré de chaque point à son centroïde
    pass
```

**Exercice 4 — k-means vs DBSCAN sur données non sphériques**

Applique k-means et DBSCAN sur `make_moons`. Visualise les deux résultats côte à côte. Explique pourquoi k-means échoue sur ce type de données.

```python
# TODO: fit_predict avec KMeans(n_clusters=2) et DBSCAN, comparer visuellement
```

---

## Conclusion

SVM et k-NN complètent la boîte à outils supervisée ; k-means et DBSCAN ouvrent la porte à l'apprentissage non supervisé. Le dernier module de la partie ML classique aborde le feature engineering, la validation croisée et les métriques d'évaluation — les outils transverses qui permettent de vraiment juger et améliorer n'importe lequel des modèles vus jusqu'ici.
