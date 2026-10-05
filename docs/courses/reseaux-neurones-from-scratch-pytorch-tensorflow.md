---
slug: reseaux-neurones-from-scratch-pytorch-tensorflow
title: "Réseaux de Neurones : From Scratch, PyTorch et TensorFlow"
description: "Construire un réseau de neurones à la main avec NumPy, comprendre la rétropropagation, puis reproduire le même modèle avec PyTorch et TensorFlow."
category: "Intelligence Artificielle & Machine Learning"
order: 6
---

# Réseaux de Neurones : From Scratch, PyTorch et TensorFlow

Premier module de la partie Deep Learning. L'objectif est de comprendre exactement ce que font PyTorch et TensorFlow en interne, en construisant un réseau de neurones complet à la main avec NumPy, avant de reproduire le même modèle avec les deux frameworks.

## 1. Anatomie d'un réseau de neurones

Un réseau de neurones est une composition de fonctions linéaires (vues au module 1) et de non-linéarités, organisées en couches :

$$a^{[l]} = g^{[l]}(W^{[l]} a^{[l-1]} + b^{[l]})$$

où $W^{[l]}$ et $b^{[l]}$ sont les poids et biais de la couche $l$, et $g^{[l]}$ une fonction d'activation non linéaire.

### Pourquoi une non-linéarité ?

Sans fonction d'activation non linéaire, empiler des couches linéaires équivaut à une seule couche linéaire (composition de fonctions linéaires = fonction linéaire). La non-linéarité est ce qui permet au réseau d'approximer des fonctions complexes.

### Fonctions d'activation courantes

- **Sigmoïde** : $\sigma(z) = \frac{1}{1+e^{-z}}$ - souffre de gradients qui s'annulent (vanishing gradient) pour les grandes couches
- **Tanh** : $\tanh(z)$, centrée sur 0, mêmes limites que sigmoïde
- **ReLU** : $\text{ReLU}(z) = \max(0, z)$ - standard actuel, calcul rapide, gradient simple (0 ou 1)
- **Softmax** (couche de sortie multi-classes, vue au module 2) : $\frac{e^{z_k}}{\sum_j e^{z_j}}$

---

## 2. Forward pass et fonction de coût

Pour un réseau à une couche cachée, classification binaire :

$$z^{[1]} = W^{[1]}x + b^{[1]}, \quad a^{[1]} = \text{ReLU}(z^{[1]})$$
$$z^{[2]} = W^{[2]}a^{[1]} + b^{[2]}, \quad \hat{y} = \sigma(z^{[2]})$$

On utilise l'entropie croisée binaire, déjà vue au module 2 :

$$J = -\frac{1}{m}\sum_i \left[ y^{(i)}\log\hat{y}^{(i)} + (1-y^{(i)})\log(1-\hat{y}^{(i)}) \right]$$

---

## 3. Rétropropagation (backpropagation)

La rétropropagation applique la règle de la chaîne (module 1) en partant de la sortie et en remontant couche par couche, pour calculer $\frac{\partial J}{\partial W^{[l]}}$ et $\frac{\partial J}{\partial b^{[l]}}$ pour chaque couche.

Pour notre réseau à 2 couches :

$$dz^{[2]} = \hat{y} - y$$
$$dW^{[2]} = \frac{1}{m} dz^{[2]} (a^{[1]})^T, \quad db^{[2]} = \frac{1}{m}\sum dz^{[2]}$$
$$da^{[1]} = (W^{[2]})^T dz^{[2]}, \quad dz^{[1]} = da^{[1]} \odot \text{ReLU}'(z^{[1]})$$
$$dW^{[1]} = \frac{1}{m} dz^{[1]} x^T, \quad db^{[1]} = \frac{1}{m}\sum dz^{[1]}$$

Chaque gradient est ensuite utilisé dans la mise à jour de descente de gradient vue au module 2 : $W \leftarrow W - \alpha \, dW$.

---

## 4. Implémentation from scratch (NumPy)

```python
import numpy as np

def relu(z):
    return np.maximum(0, z)

def relu_derivee(z):
    return (z > 0).astype(float)

def sigmoide(z):
    return 1 / (1 + np.exp(-z))

def initialiser_parametres(n_x, n_h, n_y):
    np.random.seed(42)
    W1 = np.random.randn(n_h, n_x) * 0.01
    b1 = np.zeros((n_h, 1))
    W2 = np.random.randn(n_y, n_h) * 0.01
    b2 = np.zeros((n_y, 1))
    return {"W1": W1, "b1": b1, "W2": W2, "b2": b2}

def forward(X, params):
    Z1 = params["W1"] @ X + params["b1"]
    A1 = relu(Z1)
    Z2 = params["W2"] @ A1 + params["b2"]
    A2 = sigmoide(Z2)
    cache = {"Z1": Z1, "A1": A1, "Z2": Z2, "A2": A2}
    return A2, cache

def cout(A2, Y):
    m = Y.shape[1]
    return -np.sum(Y * np.log(A2) + (1 - Y) * np.log(1 - A2)) / m

def backward(X, Y, params, cache):
    m = X.shape[1]
    dZ2 = cache["A2"] - Y
    dW2 = (dZ2 @ cache["A1"].T) / m
    db2 = np.sum(dZ2, axis=1, keepdims=True) / m

    dA1 = params["W2"].T @ dZ2
    dZ1 = dA1 * relu_derivee(cache["Z1"])
    dW1 = (dZ1 @ X.T) / m
    db1 = np.sum(dZ1, axis=1, keepdims=True) / m

    return {"dW1": dW1, "db1": db1, "dW2": dW2, "db2": db2}

def mettre_a_jour(params, grads, alpha=0.1):
    params["W1"] -= alpha * grads["dW1"]
    params["b1"] -= alpha * grads["db1"]
    params["W2"] -= alpha * grads["dW2"]
    params["b2"] -= alpha * grads["db2"]
    return params

def entrainer(X, Y, n_h=4, n_iter=2000, alpha=0.1):
    n_x, n_y = X.shape[0], Y.shape[0]
    params = initialiser_parametres(n_x, n_h, n_y)

    for i in range(n_iter):
        A2, cache = forward(X, params)
        c = cout(A2, Y)
        grads = backward(X, Y, params, cache)
        params = mettre_a_jour(params, grads, alpha)
        if i % 500 == 0:
            print(f"Itération {i} : coût = {c:.4f}")

    return params
```

---

## 5. Le même modèle avec PyTorch

PyTorch calcule automatiquement les gradients (autodiff) : plus besoin d'écrire `backward()` à la main, mais la logique reste identique à ce qu'on vient de coder.

```python
import torch
import torch.nn as nn

class ReseauSimple(nn.Module):
    def __init__(self, n_x, n_h, n_y):
        super().__init__()
        self.couche1 = nn.Linear(n_x, n_h)
        self.relu = nn.ReLU()
        self.couche2 = nn.Linear(n_h, n_y)
        self.sigmoide = nn.Sigmoid()

    def forward(self, x):
        x = self.relu(self.couche1(x))
        x = self.sigmoide(self.couche2(x))
        return x

modele = ReseauSimple(n_x=2, n_h=4, n_y=1)
critere = nn.BCELoss()
optimiseur = torch.optim.SGD(modele.parameters(), lr=0.1)

# X_tensor : shape (m, n_x), Y_tensor : shape (m, 1)
for epoch in range(2000):
    predictions = modele(X_tensor)
    perte = critere(predictions, Y_tensor)

    optimiseur.zero_grad()
    perte.backward()   # rétropropagation automatique
    optimiseur.step()  # mise à jour des poids

    if epoch % 500 == 0:
        print(f"Epoch {epoch} : perte = {perte.item():.4f}")
```

---

## 6. Le même modèle avec TensorFlow (Keras)

```python
import tensorflow as tf
from tensorflow import keras

modele_tf = keras.Sequential([
    keras.layers.Dense(4, activation="relu", input_shape=(2,)),
    keras.layers.Dense(1, activation="sigmoid")
])

modele_tf.compile(
    optimizer=keras.optimizers.SGD(learning_rate=0.1),
    loss="binary_crossentropy"
)

historique = modele_tf.fit(X_train, Y_train, epochs=2000, verbose=0)
print("Perte finale :", historique.history["loss"][-1])
```

### Correspondance PyTorch / TensorFlow

| Concept | PyTorch | TensorFlow/Keras |
|---|---|---|
| Couche dense | `nn.Linear(in, out)` | `keras.layers.Dense(out)` |
| Activation | `nn.ReLU()`, `nn.Sigmoid()` | `activation="relu"` |
| Fonction de coût | `nn.BCELoss()` | `loss="binary_crossentropy"` |
| Optimiseur | `torch.optim.SGD(...)` | `keras.optimizers.SGD(...)` |
| Boucle d'entraînement | manuelle (`for epoch in range...`) | encapsulée dans `.fit()` |
| Gradients | `perte.backward()` + `optimizer.step()` | gérés en interne par `.fit()` |

PyTorch expose la boucle d'entraînement explicitement (plus de contrôle, plus verbeux) ; Keras l'encapsule dans `.fit()` (plus rapide à écrire, moins de contrôle par défaut).

---

## 7. Exercices

**Exercice 1 - Vérifier le gradient numériquement**

Implémente une vérification de gradient (gradient checking) : compare le gradient calculé par ta fonction `backward()` à une approximation numérique $\frac{J(\theta+\epsilon) - J(\theta-\epsilon)}{2\epsilon}$ pour un seul poids. L'écart doit être très faible.

```python
def verifier_gradient(X, Y, params, epsilon=1e-7):
    # TODO: perturber un poids de +epsilon puis -epsilon, comparer au gradient analytique
    pass
```

**Exercice 2 - Résoudre XOR from scratch**

Le problème XOR n'est pas linéairement séparable (impossible à résoudre avec la régression logistique seule du module 2). Utilise ton implémentation `entrainer()` pour le résoudre avec une couche cachée.

```python
X_xor = np.array([[0,0,1,1],[0,1,0,1]])
Y_xor = np.array([[0,1,1,0]])

# TODO: entraîner avec entrainer(X_xor, Y_xor, n_h=4)
```

**Exercice 3 - Même exercice XOR en PyTorch et TensorFlow**

Reproduis l'exercice 2 avec `ReseauSimple` (PyTorch) puis avec `keras.Sequential` (TensorFlow). Compare le nombre d'epochs nécessaires à la convergence dans les trois implémentations.

```python
# TODO: version PyTorch
# TODO: version TensorFlow
```

**Exercice 4 - Effet du nombre de neurones cachés**

Sur un dataset `make_moons` (module 4), entraîne le même réseau avec `n_h` = 2, 4, 16, 64 neurones cachés. Trace la frontière de décision pour chaque taille. Que se passe-t-il avec 64 neurones sur peu de données ?

```python
# TODO: entraîner et visualiser la frontière de décision pour chaque n_h
```

---

## Conclusion

Vous avez maintenant implémenté un réseau de neurones complet - forward pass, rétropropagation, descente de gradient - et vu comment PyTorch et TensorFlow automatisent exactement les mêmes calculs. Le module suivant approfondit l'optimisation moderne : Adam, batch normalization, dropout et les stratégies d'initialisation des poids.
