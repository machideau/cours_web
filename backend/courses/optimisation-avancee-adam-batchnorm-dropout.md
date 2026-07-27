---
slug: optimisation-avancee-adam-batchnorm-dropout
title: "Optimisation Avancée : Adam, Batch Normalization, Dropout"
description: "Les techniques qui rendent l'entraînement des réseaux profonds stable et rapide : optimiseurs adaptatifs, normalisation et régularisation."
category: "Intelligence Artificielle & Machine Learning"
order: 7
---

# Optimisation Avancée : Adam, Batch Normalization, Dropout

Le module précédent a montré la descente de gradient basique. En pratique, entraîner des réseaux profonds nécessite des techniques plus robustes pour converger vite et éviter l'overfitting. Ce module couvre les optimiseurs modernes, la normalisation et la régularisation spécifiques au deep learning.

## 1. Limites de la descente de gradient classique

La descente de gradient (batch) calcule le gradient sur tout le dataset avant chaque mise à jour — trop lent sur de gros volumes. Trois variantes :

- **Batch Gradient Descent** : tout le dataset à chaque étape (stable, lent)
- **Stochastic Gradient Descent (SGD)** : un seul exemple à la fois (rapide, très bruité)
- **Mini-batch Gradient Descent** : un petit lot (32, 64, 128 exemples) — le compromis utilisé en pratique partout

```python
# Mini-batch en PyTorch : géré automatiquement par le DataLoader
from torch.utils.data import DataLoader, TensorDataset

dataset = TensorDataset(X_tensor, Y_tensor)
loader = DataLoader(dataset, batch_size=64, shuffle=True)
```

---

## 2. Momentum et Adam

### Momentum

Le momentum accumule une moyenne mobile des gradients précédents pour accélérer la convergence dans les directions cohérentes et amortir les oscillations :

$$v \leftarrow \beta v + (1-\beta)\nabla J(\theta), \qquad \theta \leftarrow \theta - \alpha v$$

### RMSprop

Adapte le taux d'apprentissage par paramètre en divisant par la racine d'une moyenne mobile du carré des gradients — utile quand certains paramètres ont des gradients à des échelles très différentes.

### Adam (Adaptive Moment Estimation)

Adam combine momentum (moyenne du gradient, premier moment) et RMSprop (moyenne du carré du gradient, second moment) :

$$m_t = \beta_1 m_{t-1} + (1-\beta_1)\nabla J(\theta)$$
$$v_t = \beta_2 v_{t-1} + (1-\beta_2)(\nabla J(\theta))^2$$

Avec correction de biais (les moyennes démarrent à 0) :

$$\hat{m}_t = \frac{m_t}{1-\beta_1^t}, \qquad \hat{v}_t = \frac{v_t}{1-\beta_2^t}$$

Mise à jour finale :

$$\theta \leftarrow \theta - \alpha \frac{\hat{m}_t}{\sqrt{\hat{v}_t}+\epsilon}$$

Adam est l'optimiseur par défaut de facto en deep learning : il converge vite et nécessite peu de réglage du learning rate.

```python
# PyTorch
optimiseur = torch.optim.Adam(modele.parameters(), lr=0.001)

# TensorFlow/Keras
modele_tf.compile(optimizer=keras.optimizers.Adam(learning_rate=0.001), loss="binary_crossentropy")
```

---

## 3. Initialisation des poids

Une initialisation à zéro ou mal calibrée bloque l'apprentissage (symétrie des neurones ou gradients qui explosent/s'annulent). Deux stratégies standards, basées sur le nombre d'entrées/sorties de la couche :

- **Xavier/Glorot** (adaptée à sigmoïde/tanh) : $W \sim \mathcal{N}(0, \frac{1}{n_{in}})$
- **He** (adaptée à ReLU) : $W \sim \mathcal{N}(0, \frac{2}{n_{in}})$

```python
# PyTorch
nn.init.kaiming_normal_(couche.weight, nonlinearity="relu")  # He
nn.init.xavier_normal_(couche.weight)  # Xavier

# TensorFlow/Keras — via kernel_initializer
keras.layers.Dense(64, activation="relu", kernel_initializer="he_normal")
```

---

## 4. Batch Normalization

### Principe

Batch Norm normalise les activations de chaque couche (moyenne 0, variance 1) sur chaque mini-batch, avant de les rééchelonner avec des paramètres appris $\gamma$ et $\beta$ :

$$\hat{z} = \frac{z - \mu_{batch}}{\sqrt{\sigma_{batch}^2 + \epsilon}}, \qquad z_{norm} = \gamma \hat{z} + \beta$$

### Pourquoi ça aide

- Stabilise et accélère l'entraînement en réduisant le "covariate shift interne" (le déplacement de la distribution des activations d'une couche pendant l'entraînement)
- Permet d'utiliser des learning rates plus élevés
- A un léger effet de régularisation (le bruit du mini-batch agit comme du dropout léger)

```python
# PyTorch
class ReseauAvecBN(nn.Module):
    def __init__(self):
        super().__init__()
        self.couche1 = nn.Linear(20, 64)
        self.bn1 = nn.BatchNorm1d(64)
        self.relu = nn.ReLU()
        self.couche2 = nn.Linear(64, 1)

    def forward(self, x):
        x = self.relu(self.bn1(self.couche1(x)))
        return torch.sigmoid(self.couche2(x))

# TensorFlow/Keras
modele_bn = keras.Sequential([
    keras.layers.Dense(64, input_shape=(20,)),
    keras.layers.BatchNormalization(),
    keras.layers.Activation("relu"),
    keras.layers.Dense(1, activation="sigmoid")
])
```

---

## 5. Dropout

### Principe

À chaque étape d'entraînement, dropout désactive aléatoirement une fraction $p$ des neurones d'une couche. Cela empêche le réseau de trop dépendre de neurones spécifiques (co-adaptation) et agit comme un ensemble implicite de sous-réseaux.

**Important** : dropout n'est actif qu'à l'entraînement — à l'inférence, tous les neurones sont utilisés (les frameworks gèrent ce comportement automatiquement selon le mode `train`/`eval`).

```python
# PyTorch
class ReseauAvecDropout(nn.Module):
    def __init__(self):
        super().__init__()
        self.couche1 = nn.Linear(20, 64)
        self.dropout = nn.Dropout(p=0.3)
        self.couche2 = nn.Linear(64, 1)

    def forward(self, x):
        x = torch.relu(self.couche1(x))
        x = self.dropout(x)
        return torch.sigmoid(self.couche2(x))

# modele.train()  # active dropout
# modele.eval()   # désactive dropout

# TensorFlow/Keras
modele_dropout = keras.Sequential([
    keras.layers.Dense(64, activation="relu", input_shape=(20,)),
    keras.layers.Dropout(0.3),
    keras.layers.Dense(1, activation="sigmoid")
])
```

---

## 6. Learning rate scheduling

Réduire progressivement le learning rate pendant l'entraînement permet de converger précisément vers un minimum sans osciller autour.

```python
# PyTorch : réduit lr de moitié tous les 10 epochs
scheduler = torch.optim.lr_scheduler.StepLR(optimiseur, step_size=10, gamma=0.5)

# TensorFlow/Keras : callback de réduction sur plateau
reduction_lr = keras.callbacks.ReduceLROnPlateau(monitor="loss", factor=0.5, patience=5)
```

---

## 7. Exercices

**Exercice 1 — Comparer les optimiseurs**

Sur le même réseau (même architecture, mêmes poids initiaux), entraîne avec SGD simple, SGD+momentum, et Adam. Trace les courbes de perte des trois en fonction des epochs.

```python
# TODO: 3 entraînements identiques sauf l'optimiseur, comparer les courbes de perte
```

**Exercice 2 — Impact de l'initialisation**

Construis un réseau à 5 couches avec activation ReLU. Compare une initialisation à zéro, une initialisation aléatoire simple (`np.random.randn`), et une initialisation He. Observe l'évolution de la norme des activations couche par couche.

```python
# TODO: comparer les 3 initialisations, avec un forward pass et affichage des normes par couche
```

**Exercice 3 — Batch Norm et vitesse de convergence**

Sur un dataset de classification de ton choix, entraîne le même réseau avec et sans Batch Normalization. Compare le nombre d'epochs nécessaires pour atteindre 90% d'accuracy.

```python
# TODO: 2 modèles identiques (avec/sans BatchNorm), comparer les courbes d'accuracy
```

**Exercice 4 — Dropout et overfitting**

Sur un petit dataset (peu d'exemples, beaucoup de features), entraîne un réseau surdimensionné avec dropout = 0, 0.2, 0.5. Compare l'écart entre accuracy train et accuracy validation pour chaque valeur.

```python
# TODO: comparer l'écart train/val pour 3 valeurs de dropout
```

---

## Conclusion

Adam, batch normalization et dropout sont aujourd'hui des standards presque systématiques dans les architectures profondes. Le module suivant applique tout ce qui a été vu (réseaux, optimisation, régularisation) à un type d'architecture spécifique : les réseaux de neurones convolutifs (CNN), pour la vision par ordinateur.
