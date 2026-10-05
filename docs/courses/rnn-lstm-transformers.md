---
slug: rnn-lstm-transformers
title: "RNN, LSTM et Transformers"
description: "Architectures pour données séquentielles : réseaux récurrents, LSTM, mécanisme d'attention et Transformers, pour le NLP."
category: "Intelligence Artificielle & Machine Learning"
order: 9
---

# RNN, LSTM et Transformers

Les CNN excellent sur des données à structure spatiale (images). Ce module aborde les architectures conçues pour des données **séquentielles** (texte, séries temporelles, audio) : d'abord les réseaux récurrents (RNN, LSTM), puis les Transformers qui les ont largement supplantés en NLP.

## 1. Réseaux de neurones récurrents (RNN)

### Principe

Un RNN traite une séquence élément par élément, en maintenant un état caché $h_t$ qui résume l'information vue jusqu'ici :

$$h_t = \tanh(W_{hh} h_{t-1} + W_{xh} x_t + b_h)$$
$$y_t = W_{hy} h_t + b_y$$

Les mêmes poids $W_{hh}, W_{xh}, W_{hy}$ sont partagés à chaque pas de temps (partage de paramètres, comme les filtres convolutifs du module 8).

### Le problème du vanishing/exploding gradient

En dépliant le RNN dans le temps, la rétropropagation (module 6) multiplie des dizaines/centaines de termes issus de $W_{hh}$. Si ces valeurs sont < 1, le gradient s'annule (vanishing) ; si > 1, il explose. En pratique, un RNN simple ne retient bien que les dépendances à court terme (quelques pas de temps).

---

## 2. LSTM (Long Short-Term Memory)

### Principe

Le LSTM introduit une **cellule mémoire** $C_t$ et trois portes (gates) qui contrôlent explicitement quelle information garder, oublier ou exposer :

- **Porte d'oubli** : $f_t = \sigma(W_f[h_{t-1}, x_t] + b_f)$ - quelle part de $C_{t-1}$ garder
- **Porte d'entrée** : $i_t = \sigma(W_i[h_{t-1}, x_t] + b_i)$ - quelle nouvelle information ajouter
- **Porte de sortie** : $o_t = \sigma(W_o[h_{t-1}, x_t] + b_o)$ - quelle part de la mémoire exposer

$$C_t = f_t \odot C_{t-1} + i_t \odot \tanh(W_C[h_{t-1}, x_t] + b_C)$$
$$h_t = o_t \odot \tanh(C_t)$$

Le chemin de la cellule mémoire $C_t$ à $C_{t-1}$ (addition, pas multiplication répétée) permet au gradient de circuler sur de longues séquences sans s'annuler - c'est ce qui règle le problème du vanishing gradient des RNN simples.

### Implémentation PyTorch

```python
import torch
import torch.nn as nn

class ClassifieurLSTM(nn.Module):
    def __init__(self, taille_vocab, dim_embedding, dim_cachee, n_classes):
        super().__init__()
        self.embedding = nn.Embedding(taille_vocab, dim_embedding)
        self.lstm = nn.LSTM(dim_embedding, dim_cachee, batch_first=True)
        self.fc = nn.Linear(dim_cachee, n_classes)

    def forward(self, x):
        x = self.embedding(x)                  # [batch, seq_len, dim_embedding]
        _, (h_n, c_n) = self.lstm(x)           # h_n : dernier état caché
        return self.fc(h_n.squeeze(0))

modele = ClassifieurLSTM(taille_vocab=10000, dim_embedding=128, dim_cachee=64, n_classes=2)
```

### Implémentation TensorFlow (Keras)

```python
from tensorflow.keras import layers, Sequential

modele_tf = Sequential([
    layers.Embedding(input_dim=10000, output_dim=128),
    layers.LSTM(64),
    layers.Dense(2, activation="softmax")
])
modele_tf.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
```

---

## 3. Le mécanisme d'attention

### Limite des RNN/LSTM

Même avec les portes du LSTM, toute l'information d'une longue séquence doit passer par un seul état caché final - un goulot d'étranglement pour les séquences très longues (traduction de phrases longues, par exemple).

### Principe de l'attention

L'attention permet à chaque position de la sortie de "regarder" directement toutes les positions de l'entrée, en pondérant leur importance. Pour une requête $Q$, des clés $K$ et des valeurs $V$ (projections linéaires de l'entrée, module 1) :

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

- $QK^T$ mesure la similarité (produit scalaire, module 1) entre chaque requête et chaque clé
- La division par $\sqrt{d_k}$ stabilise les gradients (évite des softmax trop piqués)
- Softmax (module 2) transforme ces scores en poids d'attention qui somment à 1
- Le résultat est une moyenne pondérée des valeurs $V$

### Self-attention

Quand $Q$, $K$, $V$ proviennent tous de la même séquence, chaque mot "regarde" tous les autres mots de la phrase (y compris lui-même) pour construire une représentation contextualisée.

---

## 4. L'architecture Transformer

### Multi-head attention

Plutôt qu'une seule attention, le Transformer en calcule plusieurs en parallèle ("têtes"), chacune pouvant capturer un type de relation différent (syntaxique, sémantique...), puis concatène les résultats.

### Encodage positionnel

L'attention, contrairement au RNN, ne traite pas la séquence dans l'ordre - elle n'a par nature aucune notion de position. On ajoute donc un encodage positionnel (souvent sinusoïdal) aux embeddings d'entrée pour injecter l'information d'ordre.

### Architecture globale

```
Entrée → Embedding + Encodage positionnel
       → [Multi-Head Attention → Add & Norm → Feed-Forward → Add & Norm] × N
       → Sortie
```

Les connexions résiduelles ("Add") et la normalisation ("Norm", proche de la Batch Norm du module 7 mais appliquée par exemple plutôt que par batch) stabilisent l'entraînement de piles profondes de ces blocs.

### Implémentation simplifiée PyTorch

```python
import torch.nn as nn

class BlocTransformer(nn.Module):
    def __init__(self, dim_modele, n_tetes, dim_feedforward):
        super().__init__()
        self.attention = nn.MultiheadAttention(dim_modele, n_tetes, batch_first=True)
        self.norm1 = nn.LayerNorm(dim_modele)
        self.feedforward = nn.Sequential(
            nn.Linear(dim_modele, dim_feedforward),
            nn.ReLU(),
            nn.Linear(dim_feedforward, dim_modele)
        )
        self.norm2 = nn.LayerNorm(dim_modele)

    def forward(self, x):
        attn_out, _ = self.attention(x, x, x)  # self-attention : Q=K=V=x
        x = self.norm1(x + attn_out)           # connexion résiduelle + norm
        ff_out = self.feedforward(x)
        return self.norm2(x + ff_out)
```

### TensorFlow (Keras)

```python
from tensorflow.keras import layers

class BlocTransformerTF(layers.Layer):
    def __init__(self, dim_modele, n_tetes, dim_feedforward):
        super().__init__()
        self.attention = layers.MultiHeadAttention(num_heads=n_tetes, key_dim=dim_modele)
        self.norm1 = layers.LayerNormalization()
        self.feedforward = tf.keras.Sequential([
            layers.Dense(dim_feedforward, activation="relu"),
            layers.Dense(dim_modele)
        ])
        self.norm2 = layers.LayerNormalization()

    def call(self, x):
        attn_out = self.attention(x, x, x)
        x = self.norm1(x + attn_out)
        ff_out = self.feedforward(x)
        return self.norm2(x + ff_out)
```

En pratique, on n'implémente ce bloc à la main que pour comprendre le mécanisme : le module suivant utilise directement des Transformers pré-entraînés via Hugging Face plutôt que de les réentraîner depuis zéro.

---

## 5. Exercices

**Exercice 1 - Classification de sentiment avec LSTM**

Entraîne le `ClassifieurLSTM` sur un dataset de critiques de films (IMDB, disponible via `torchvision`/`tensorflow_datasets`) pour prédire positif/négatif. Reproduis avec la version TensorFlow.

```python
# TODO: charger IMDB, tokenizer les textes, entraîner les 2 versions, comparer accuracy
```

**Exercice 2 - Visualiser les poids d'attention**

Sur une phrase courte, calcule et affiche (heatmap avec `matplotlib`) la matrice d'attention `softmax(QK^T/sqrt(d_k))` d'une seule tête. Quels mots la phrase "regarde"-t-elle le plus ?

```python
# TODO: implémenter Attention(Q, K, V) en NumPy et visualiser la matrice de poids
```

**Exercice 3 - RNN vs LSTM sur séquences longues**

Crée une tâche synthétique où l'information nécessaire est au tout début d'une séquence longue (ex : prédire le premier chiffre d'une séquence de 50). Compare les performances d'un `nn.RNN` simple et d'un `nn.LSTM` sur cette tâche.

```python
# TODO: générer les séquences synthétiques, entraîner RNN et LSTM, comparer l'accuracy
```

**Exercice 4 - Implémenter le bloc Transformer complet**

Assemble le `BlocTransformer` défini plus haut avec un encodage positionnel sinusoïdal et entraîne-le sur une tâche de classification de texte simple. Compare le temps d'entraînement et l'accuracy avec la version LSTM de l'exercice 1.

```python
# TODO: ajouter l'encodage positionnel, empiler 2 BlocTransformer, entraîner et comparer au LSTM
```

---

## Conclusion

Les Transformers ont largement remplacé les RNN/LSTM en NLP grâce à leur parallélisation (pas de dépendance séquentielle à l'entraînement) et leur capacité à capturer des dépendances longues via l'attention. Le module suivant exploite cette architecture concrètement, en utilisant l'écosystème Hugging Face pour charger et fine-tuner des modèles pré-entraînés - sans repartir de zéro.
