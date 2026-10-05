---
slug: fonctions-activation-deep-learning
title: "Fonctions d'Activation en Deep Learning"
description: "Comprendre en profondeur sigmoïde, tanh, ReLU et ses variantes, GELU, Swish et softmax : formules, dérivées, avantages et pièges."
category: "Intelligence Artificielle & Machine Learning"
order: 7
---

# Fonctions d'Activation en Deep Learning

Le module 6 a introduit rapidement ReLU et sigmoïde pour construire un premier réseau. Ce module reprend en profondeur toutes les fonctions d'activation courantes : leur formule, leur dérivée (essentielle pour la rétropropagation, module 6), leurs avantages/inconvénients, et quand choisir laquelle.

## 1. Rôle d'une fonction d'activation

Rappel du module 6 : sans non-linéarité, empiler des couches linéaires (module 1) reste équivalent à une seule transformation linéaire. La fonction d'activation $g$ introduit la non-linéarité :

$$a^{[l]} = g(z^{[l]}), \qquad z^{[l]} = W^{[l]}a^{[l-1]} + b^{[l]}$$

Le choix de $g$ influence directement la qualité et la stabilité de l'entraînement, via son effet sur le gradient qui circule pendant la rétropropagation.

---

## 2. Sigmoïde

$$\sigma(z) = \frac{1}{1+e^{-z}}, \qquad \sigma'(z) = \sigma(z)(1-\sigma(z))$$

**Avantages** : sortie bornée entre 0 et 1, interprétable comme une probabilité (utilisée en sortie pour la classification binaire, module 2).

**Inconvénient majeur - vanishing gradient** : pour $|z|$ grand (positif ou négatif), $\sigma'(z) \to 0$. Lors de la rétropropagation, la chain rule (module 1) multiplie ces dérivées à chaque couche : dans un réseau profond, le gradient devient exponentiellement petit en remontant vers les premières couches, qui n'apprennent alors presque plus.

**Autre inconvénient** : sortie non centrée sur 0 (toujours positive), ce qui ralentit la convergence de la descente de gradient.

```python
import numpy as np

def sigmoide(z):
    return 1 / (1 + np.exp(-z))

def sigmoide_derivee(z):
    s = sigmoide(z)
    return s * (1 - s)
```

**Usage aujourd'hui** : quasiment jamais en couche cachée ; réservée à la couche de sortie pour la classification binaire.

---

## 3. Tanh

$$\tanh(z) = \frac{e^z - e^{-z}}{e^z + e^{-z}}, \qquad \tanh'(z) = 1 - \tanh(z)^2$$

**Avantage sur sigmoïde** : sortie centrée sur 0 (entre -1 et 1), ce qui accélère généralement la convergence.

**Inconvénient** : souffre du même vanishing gradient que sigmoïde pour $|z|$ grand - les deux fonctions ont une forme en "S" qui sature aux extrêmes.

```python
def tanh_derivee(z):
    return 1 - np.tanh(z) ** 2
```

**Usage aujourd'hui** : encore présente dans les portes du LSTM (module 9), rarement ailleurs.

---

## 4. ReLU (Rectified Linear Unit)

$$\text{ReLU}(z) = \max(0, z), \qquad \text{ReLU}'(z) = \begin{cases} 1 & \text{si } z > 0 \\ 0 & \text{si } z < 0 \end{cases}$$

**Avantages** :
- Calcul trivial (comparaison + max), donc rapide
- Gradient constant (1) pour $z>0$ : pas de saturation de ce côté, ce qui règle largement le vanishing gradient
- Induit de la sparsité (beaucoup de neurones à 0), ce qui peut améliorer l'efficacité de représentation

**Inconvénient - "dying ReLU"** : si un neurone reçoit systématiquement des entrées négatives (souvent dû à un learning rate trop élevé ou une mauvaise initialisation, module 7), son gradient reste à 0 pour toujours - il "meurt" et n'apprend plus jamais.

```python
def relu(z):
    return np.maximum(0, z)

def relu_derivee(z):
    return (z > 0).astype(float)
```

**Usage aujourd'hui** : le standard par défaut pour les couches cachées, notamment en CNN (module 8).

---

## 5. Leaky ReLU et variantes

### Leaky ReLU

Corrige le dying ReLU en autorisant un petit gradient non nul pour $z<0$ :

$$\text{LeakyReLU}(z) = \begin{cases} z & \text{si } z > 0 \\ \alpha z & \text{si } z \leq 0 \end{cases}, \quad \alpha \approx 0.01$$

```python
def leaky_relu(z, alpha=0.01):
    return np.where(z > 0, z, alpha * z)

def leaky_relu_derivee(z, alpha=0.01):
    return np.where(z > 0, 1, alpha)
```

### Parametric ReLU (PReLU)

Identique à Leaky ReLU, mais $\alpha$ est un paramètre **appris** par le réseau plutôt que fixé à l'avance.

### ELU (Exponential Linear Unit)

$$\text{ELU}(z) = \begin{cases} z & \text{si } z > 0 \\ \alpha(e^z - 1) & \text{si } z \leq 0 \end{cases}$$

Lisse (dérivable partout, contrairement à ReLU qui a un point anguleux en 0) et pousse la moyenne des activations plus près de 0, ce qui peut accélérer la convergence - au prix d'un calcul un peu plus coûteux (exponentielle).

---

## 6. GELU et Swish/SiLU - les activations des Transformers modernes

### GELU (Gaussian Error Linear Unit)

$$\text{GELU}(z) = z \cdot \Phi(z)$$

où $\Phi(z)$ est la fonction de répartition de la loi normale standard (probabilités, module 1). Intuitivement, GELU pondère $z$ par la probabilité qu'une variable gaussienne standard soit inférieure à $z$ - une version "probabiliste" et lisse de ReLU.

**Usage** : activation par défaut dans BERT, GPT et la plupart des Transformers modernes (modules 9-10), car sa forme lisse (dérivable partout) aide à la stabilité de l'entraînement de réseaux très profonds.

### Swish / SiLU (Sigmoid Linear Unit)

$$\text{Swish}(z) = z \cdot \sigma(z)$$

Très proche de GELU dans sa forme, légèrement moins coûteuse à calculer. Utilisée dans certaines architectures de vision modernes (EfficientNet) et certains grands modèles de langage.

```python
from scipy.stats import norm

def gelu(z):
    return z * norm.cdf(z)

def swish(z):
    return z * sigmoide(z)
```

```python
# PyTorch : ces fonctions sont directement disponibles
import torch.nn as nn
activation_gelu = nn.GELU()
activation_swish = nn.SiLU()  # SiLU = Swish avec beta=1
```

---

## 7. Softmax - activation de sortie multi-classes

Déjà rencontrée au module 2, rappelée ici dans le contexte des fonctions d'activation :

$$\text{softmax}(z)_k = \frac{e^{z_k}}{\sum_{j=1}^K e^{z_j}}$$

Contrairement aux fonctions précédentes (appliquées élément par élément), softmax est une fonction **vectorielle** : chaque sortie dépend de tous les logits d'entrée, pour produire une distribution de probabilité qui somme à 1. Utilisée exclusivement en couche de sortie pour la classification multi-classes.

**Astuce numérique importante** : calculer directement $e^{z_k}$ peut provoquer un débordement numérique pour de grands $z_k$. On soustrait le maximum avant l'exponentielle (ce qui ne change pas le résultat mathématique mais stabilise le calcul) :

```python
def softmax_stable(z):
    z_stable = z - np.max(z)
    exp_z = np.exp(z_stable)
    return exp_z / np.sum(exp_z)
```

---

## 8. Tableau récapitulatif

| Activation | Formule | Plage | Problème résolu / usage |
|---|---|---|---|
| Sigmoïde | $\frac{1}{1+e^{-z}}$ | (0,1) | Sortie binaire uniquement |
| Tanh | $\tanh(z)$ | (-1,1) | Portes LSTM |
| ReLU | $\max(0,z)$ | [0,∞) | Standard couches cachées, CNN |
| Leaky ReLU | $\max(\alpha z, z)$ | (-∞,∞) | Corrige dying ReLU |
| ELU | voir plus haut | (-α,∞) | Lisse, moyenne proche de 0 |
| GELU | $z\Phi(z)$ | (-∞,∞) | Standard Transformers (BERT, GPT) |
| Swish/SiLU | $z\sigma(z)$ | (-∞,∞) | Vision moderne, LLM |
| Softmax | voir plus haut | somme à 1 | Sortie classification multi-classes |

---

## 9. Exercices

**Exercice 1 - Visualiser toutes les activations et leurs dérivées**

Trace sur un même graphique (`matplotlib`) sigmoïde, tanh, ReLU, Leaky ReLU et GELU pour $z \in [-5, 5]$, puis leurs dérivées sur un second graphique. Identifie visuellement où chaque fonction sature.

```python
import matplotlib.pyplot as plt

z = np.linspace(-5, 5, 200)
# TODO: tracer chaque activation et sa dérivée
```

**Exercice 2 - Reproduire le dying ReLU**

Construis un petit réseau (module 6) avec ReLU, initialise volontairement les poids d'une couche avec de grandes valeurs négatives, et observe que les gradients de cette couche restent à 0 pendant l'entraînement. Corrige en utilisant Leaky ReLU à la place.

```python
# TODO: initialiser un réseau avec ReLU et poids fortement négatifs, observer les gradients nuls
# TODO: remplacer par Leaky ReLU et comparer
```

**Exercice 3 - Comparer la vitesse de convergence**

Sur le dataset `make_moons` (module 4), entraîne le même réseau à 4 couches avec sigmoïde, ReLU, et GELU en couches cachées. Trace la courbe de perte des trois. Laquelle converge le plus vite et pourquoi ?

```python
# TODO: entraîner 3 versions du même réseau, une par activation, comparer les courbes de perte
```

**Exercice 4 - Implémenter GELU et vérifier avec PyTorch**

Implémente `gelu()` en NumPy pur (sans `scipy.stats.norm`, en utilisant l'approximation tanh de GELU utilisée par de nombreuses librairies). Compare numériquement ton résultat à `torch.nn.GELU()`.

$$\text{GELU}(z) \approx 0.5z\left(1 + \tanh\left[\sqrt{2/\pi}(z + 0.044715z^3)\right]\right)$$

```python
def gelu_approximation(z):
    # TODO: implémenter la formule d'approximation ci-dessus
    pass

# TODO: comparer à nn.GELU()(torch.tensor(z)) sur les mêmes valeurs
```

---

## Conclusion

Le choix de la fonction d'activation influence directement la stabilité et la vitesse de l'entraînement d'un réseau profond. ReLU reste le choix par défaut pour la plupart des architectures classiques et les CNN, tandis que GELU/Swish dominent dans les Transformers modernes. Ce module complète la compréhension du forward pass du module 6, avant d'aborder les techniques d'optimisation (Adam, batch normalization, dropout) du module suivant, qui interagissent directement avec le choix de l'activation.
