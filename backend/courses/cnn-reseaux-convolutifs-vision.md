---
slug: cnn-reseaux-convolutifs-vision
title: "CNN : Réseaux de Neurones Convolutifs pour la Vision"
description: "Comprendre et implémenter les réseaux convolutifs pour la classification d'images, avec PyTorch et TensorFlow."
category: "Intelligence Artificielle & Machine Learning"
order: 8
---

# CNN : Réseaux de Neurones Convolutifs pour la Vision

Les réseaux denses vus jusqu'ici (module 6) traitent chaque pixel comme une feature indépendante, en ignorant la structure spatiale d'une image et en explosant en nombre de paramètres. Les CNN corrigent ces deux problèmes.

## 1. Pourquoi pas un réseau dense sur des images ?

Une image de 224×224×3 (RGB) possède 150 528 pixels. Une seule couche dense de 1000 neurones nécessiterait déjà plus de 150 millions de paramètres — impraticable et sujet à un overfitting massif. De plus, aplatir l'image en vecteur détruit toute relation spatiale entre pixels voisins (un bord, une texture, une forme).

## 2. La convolution

### Principe

Un filtre (kernel), une petite matrice de poids (ex : 3×3), glisse sur l'image et calcule un produit scalaire local à chaque position — exactement l'opération de produit scalaire vue au module 1, appliquée localement :

$$(I * K)(i,j) = \sum_{m}\sum_{n} I(i+m, j+n) \cdot K(m,n)$$

Chaque filtre apprend à détecter un motif (bord vertical, coin, texture...). Les couches profondes combinent ces motifs simples en concepts de plus haut niveau (yeux, roues, visages).

### Avantages structurels

- **Partage de paramètres** : le même filtre est utilisé sur toute l'image (un détecteur de bord vertical est utile partout, pas seulement en haut à gauche)
- **Connectivité locale** : chaque neurone ne regarde qu'une petite région, réduisant drastiquement le nombre de paramètres
- **Invariance à la translation** : un motif est détecté peu importe sa position dans l'image

### Hyperparamètres clés

- **Stride** : pas de déplacement du filtre (stride=2 divise la taille de sortie par 2)
- **Padding** : ajout de zéros en bordure pour contrôler la taille de sortie (`"same"` conserve la taille, `"valid"` la réduit)
- **Nombre de filtres** : détermine la profondeur (nombre de canaux) de la sortie

## 3. Pooling

Le pooling réduit la dimension spatiale tout en conservant l'information essentielle :

- **Max pooling** : garde la valeur maximale dans chaque région (le plus courant)
- **Average pooling** : garde la moyenne

Cela réduit le nombre de paramètres des couches suivantes et apporte une invariance légère aux petites translations.

---

## 4. Architecture typique d'un CNN

```
Image → [Conv → ReLU → Pooling] × N → Flatten → Dense → Sortie
```

Les couches convolutives extraient des features spatiales de plus en plus abstraites ; les couches denses finales combinent ces features pour la classification.

---

## 5. Implémentation PyTorch

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class CNN(nn.Module):
    def __init__(self, n_classes=10):
        super().__init__()
        self.conv1 = nn.Conv2d(in_channels=1, out_channels=32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.fc2 = nn.Linear(128, n_classes)
        self.dropout = nn.Dropout(0.3)

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))   # 28x28 -> 14x14
        x = self.pool(F.relu(self.conv2(x)))   # 14x14 -> 7x7
        x = x.view(x.size(0), -1)              # flatten
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        return self.fc2(x)

modele = CNN(n_classes=10)
critere = nn.CrossEntropyLoss()
optimiseur = torch.optim.Adam(modele.parameters(), lr=0.001)

# Boucle d'entraînement (X : images shape [batch, 1, 28, 28])
for epoch in range(10):
    for images, labels in loader:
        optimiseur.zero_grad()
        sorties = modele(images)
        perte = critere(sorties, labels)
        perte.backward()
        optimiseur.step()
```

---

## 6. Implémentation TensorFlow (Keras)

```python
from tensorflow import keras
from tensorflow.keras import layers

modele_tf = keras.Sequential([
    layers.Conv2D(32, kernel_size=3, padding="same", activation="relu", input_shape=(28, 28, 1)),
    layers.MaxPooling2D(pool_size=2),
    layers.Conv2D(64, kernel_size=3, padding="same", activation="relu"),
    layers.MaxPooling2D(pool_size=2),
    layers.Flatten(),
    layers.Dense(128, activation="relu"),
    layers.Dropout(0.3),
    layers.Dense(10, activation="softmax")
])

modele_tf.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

modele_tf.fit(X_train, y_train, epochs=10, batch_size=64, validation_split=0.1)
```

### Différence de convention importante

PyTorch utilise le format `[batch, canaux, hauteur, largeur]` (channels-first) ; TensorFlow/Keras utilise par défaut `[batch, hauteur, largeur, canaux]` (channels-last). C'est une source d'erreur fréquente lors du portage d'un modèle d'un framework à l'autre.

---

## 7. Data augmentation

Pour limiter l'overfitting sur des datasets d'images de taille limitée, on génère des variantes artificielles des images d'entraînement (rotation, flip, zoom, translation).

```python
# PyTorch
from torchvision import transforms

transform = transforms.Compose([
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ToTensor()
])

# TensorFlow/Keras
augmentation = keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1)
])
```

---

## 8. Transfer learning (aperçu)

Plutôt que d'entraîner un CNN depuis zéro, on peut réutiliser un modèle pré-entraîné sur un grand dataset (ImageNet) et ne réentraîner que les dernières couches sur son propre dataset. Ce sujet est approfondi au module 10 (écosystème open-source).

```python
# PyTorch - aperçu
from torchvision.models import resnet18
modele_pretrained = resnet18(weights="IMAGENET1K_V1")
for param in modele_pretrained.parameters():
    param.requires_grad = False  # on gèle les couches pré-entraînées
modele_pretrained.fc = nn.Linear(512, 10)  # nouvelle tête de classification
```

---

## 9. Exercices

**Exercice 1 — CNN sur MNIST**

Entraîne le CNN PyTorch défini plus haut sur le dataset MNIST (`torchvision.datasets.MNIST`). Atteins au moins 98% d'accuracy sur le test set. Reproduis l'exercice avec la version TensorFlow.

```python
# TODO: charger MNIST, entraîner les deux versions (PyTorch et TensorFlow), comparer accuracy et temps
```

**Exercice 2 — Visualiser les filtres appris**

Après entraînement, extrais et affiche (avec `matplotlib`) les filtres de la première couche convolutive. Que détectent-ils visuellement (bords, textures) ?

```python
# TODO: modele.conv1.weight (PyTorch) ou modele_tf.layers[0].get_weights() (TensorFlow)
```

**Exercice 3 — Impact de la data augmentation**

Sur un petit sous-ensemble de MNIST (500 images), compare l'accuracy sur le test set avec et sans data augmentation. Quel est l'écart ?

```python
# TODO: entraîner avec et sans augmentation, comparer l'accuracy finale
```

**Exercice 4 — Stride et padding à la main**

Implémente une fonction de convolution 2D basique en NumPy pur (sans PyTorch/TensorFlow) pour un seul filtre 3×3 sur une image en niveaux de gris. Vérifie que ton résultat correspond à celui de `nn.Conv2d` sur les mêmes poids.

```python
def convolution_2d(image, filtre, stride=1, padding=0):
    # TODO: implémenter la convolution manuellement avec des boucles ou du im2col
    pass
```

---

## Conclusion

Les CNN restent la référence pour la vision par ordinateur classique, même si les Vision Transformers gagnent du terrain sur les très grands datasets. Le module suivant aborde les architectures séquentielles (RNN/LSTM) puis les Transformers, indispensables pour le traitement du langage naturel (NLP).
