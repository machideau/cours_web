---
slug: transformers-architecture-complete
title: "Transformers : Architecture Complète en Profondeur"
description: "Décortiquer l'architecture Transformer en détail : self-attention, multi-head attention, encodage positionnel, encoder-decoder, BERT vs GPT."
category: "Intelligence Artificielle & Machine Learning"
order: 10
---

# Transformers : Architecture Complète en Profondeur

Le module précédent a introduit l'attention en complément des RNN/LSTM. Ce module reprend l'architecture Transformer intégralement et en détail : c'est l'architecture derrière la quasi-totalité des grands modèles de langage actuels (GPT, Llama, BERT, T5) et de plus en plus de modèles de vision.

## 1. Pourquoi les Transformers ont remplacé les RNN/LSTM

Trois limites des RNN/LSTM (module 9) que les Transformers résolvent :

- **Séquentialité** : un RNN traite les tokens un par un, impossible à paralléliser pendant l'entraînement → très lent sur de longues séquences. Le Transformer traite tous les tokens simultanément.
- **Dépendances longues** : même avec les portes du LSTM, l'information doit transiter à travers de nombreux pas de temps. L'attention connecte directement deux tokens distants en une seule opération, peu importe leur distance dans la séquence.
- **Goulot d'étranglement** : un seul état caché final résume toute la séquence. L'attention permet à chaque position de puiser l'information exactement où elle se trouve.

---

## 2. Self-attention : le calcul en détail

### Des embeddings aux vecteurs Q, K, V

Chaque token d'entrée est d'abord transformé en vecteur (embedding, module 9). Puis, pour chaque token, on calcule trois projections linéaires via trois matrices de poids apprises $W_Q$, $W_K$, $W_V$ (produit matriciel, module 1) :

$$Q = XW_Q, \qquad K = XW_K, \qquad V = XW_V$$

- $Q$ (query) : "ce que ce token cherche"
- $K$ (key) : "ce que ce token propose"
- $V$ (value) : "l'information réelle transmise si ce token est sélectionné"

### Scores d'attention

On calcule la similarité entre chaque requête et chaque clé via un produit scalaire (module 1) :

$$\text{scores} = QK^T$$

Un score élevé entre le token $i$ (requête) et le token $j$ (clé) signifie que le token $i$ devrait prêter beaucoup d'attention au token $j$.

### Mise à l'échelle et softmax

$$\text{Attention}(Q,K,V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

La division par $\sqrt{d_k}$ (racine de la dimension des clés) évite que les scores deviennent trop grands quand $d_k$ augmente, ce qui saturerait le softmax (module 2) et rendrait les gradients quasi nuls à l'entraînement.

Softmax transforme les scores en poids d'attention positifs qui somment à 1 pour chaque token — une distribution de probabilité sur "où regarder".

### Calcul illustré pas à pas

```python
import numpy as np

def softmax(x, axis=-1):
    x_stable = x - np.max(x, axis=axis, keepdims=True)
    exp_x = np.exp(x_stable)
    return exp_x / np.sum(exp_x, axis=axis, keepdims=True)

def self_attention(X, W_q, W_k, W_v):
    Q = X @ W_q
    K = X @ W_k
    V = X @ W_v

    d_k = K.shape[-1]
    scores = (Q @ K.T) / np.sqrt(d_k)
    poids_attention = softmax(scores)

    sortie = poids_attention @ V
    return sortie, poids_attention

# Exemple : séquence de 4 tokens, dimension d'embedding 8
np.random.seed(42)
X = np.random.randn(4, 8)
W_q = np.random.randn(8, 8) * 0.1
W_k = np.random.randn(8, 8) * 0.1
W_v = np.random.randn(8, 8) * 0.1

sortie, poids = self_attention(X, W_q, W_k, W_v)
print("Poids d'attention (chaque ligne somme à 1) :\n", poids)
```

---

## 3. Multi-head attention

### Pourquoi plusieurs têtes

Une seule tête d'attention apprend un seul type de relation entre tokens. En pratique, un mot dépend simultanément de plusieurs types de contexte (accord grammatical, référence sémantique, position). Le multi-head attention calcule $h$ têtes d'attention en parallèle, chacune avec ses propres $W_Q, W_K, W_V$ de dimension réduite ($d_{modele}/h$), puis concatène et projette les résultats :

$$\text{MultiHead}(X) = \text{Concat}(\text{tete}_1, ..., \text{tete}_h) W_O$$

```python
import torch
import torch.nn as nn

attention = nn.MultiheadAttention(embed_dim=64, num_heads=8, batch_first=True)

X = torch.randn(1, 10, 64)  # [batch, seq_len, dim]
sortie, poids_attention = attention(X, X, X)  # self-attention : Q=K=V=X
print(sortie.shape)  # [1, 10, 64]
```

### Masked self-attention (pour la génération)

Pour les modèles génératifs (GPT), chaque token ne doit voir que les tokens précédents, pas le futur — on applique un masque qui force les scores d'attention vers les positions futures à $-\infty$ avant le softmax, les annulant après passage dans softmax.

```python
def masque_causal(taille_sequence):
    masque = np.triu(np.ones((taille_sequence, taille_sequence)), k=1)
    return masque * -1e9  # à ajouter aux scores avant le softmax

# Exemple d'application
scores_masques = scores + masque_causal(scores.shape[0])
poids_attention_causale = softmax(scores_masques)
```

---

## 4. Encodage positionnel

L'attention traite tous les tokens en parallèle sans notion d'ordre inhérente — contrairement à un RNN qui traite la séquence dans l'ordre. On injecte donc explicitement la position via un encodage positionnel sinusoïdal ajouté à l'embedding :

$$PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d}}\right), \qquad PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d}}\right)$$

Ce choix permet au modèle de généraliser à des positions relatives (la distance entre deux tokens s'exprime comme une transformation linéaire simple entre leurs encodages), même pour des séquences plus longues que celles vues à l'entraînement.

```python
def encodage_positionnel(longueur_seq, dim_modele):
    positions = np.arange(longueur_seq)[:, np.newaxis]
    frequences = 1 / (10000 ** (np.arange(0, dim_modele, 2) / dim_modele))

    pe = np.zeros((longueur_seq, dim_modele))
    pe[:, 0::2] = np.sin(positions * frequences)
    pe[:, 1::2] = np.cos(positions * frequences)
    return pe
```

Les modèles récents (GPT moderne, Llama) utilisent souvent RoPE (Rotary Position Embedding), une variante qui encode la position en faisant tourner les vecteurs Q/K plutôt qu'en additionnant un vecteur fixe — hors périmètre détaillé ici, mais bon à connaître de nom.

---

## 5. Connexions résiduelles et normalisation

Chaque sous-couche (attention, feed-forward) est enveloppée d'une connexion résiduelle et d'une normalisation :

$$x_{sortie} = \text{LayerNorm}(x + \text{SousCouche}(x))$$

La connexion résiduelle (l'addition de $x$) permet au gradient de circuler directement à travers les couches profondes sans s'atténuer — le même principe qui motive la cellule mémoire du LSTM (module 9). LayerNorm normalise chaque token individuellement (contrairement à BatchNorm du module 7, qui normalise à travers le batch), ce qui convient mieux à des séquences de longueur variable.

---

## 6. Architecture complète : Encoder, Decoder, et variantes

### Bloc Encoder

```
x → Multi-Head Self-Attention → Add & Norm → Feed-Forward → Add & Norm → sortie
```

Chaque token peut voir tous les autres tokens de la séquence (attention bidirectionnelle) — adapté à la compréhension (classification, extraction d'information).

### Bloc Decoder

Identique à l'encoder, mais avec deux différences :
- **Masked self-attention** : chaque token ne voit que les tokens précédents (génération autoregressive)
- **Cross-attention** (dans l'architecture encoder-decoder originale) : les requêtes viennent du decoder, mais les clés/valeurs viennent de la sortie de l'encoder — permet au decoder de "consulter" la séquence source

### Trois familles d'architectures

| Famille | Composants | Usage typique | Exemples |
|---|---|---|---|
| Encoder-only | Encoder bidirectionnel | Classification, extraction, embeddings | BERT, RoBERTa |
| Decoder-only | Decoder causal (masqué) | Génération de texte | GPT, Llama |
| Encoder-decoder | Encoder + Decoder + cross-attention | Traduction, résumé | T5, BART |

```python
from transformers import AutoModel, AutoModelForCausalLM, AutoModelForSeq2SeqLM

# Encoder-only : produit des représentations, pas de génération de texte
modele_bert = AutoModel.from_pretrained("bert-base-uncased")

# Decoder-only : génère du texte token par token
modele_gpt = AutoModelForCausalLM.from_pretrained("gpt2")

# Encoder-decoder : transforme une séquence source en séquence cible
modele_t5 = AutoModelForSeq2SeqLM.from_pretrained("t5-small")
```

---

## 7. Implémenter un bloc Transformer complet from scratch

```python
import torch
import torch.nn as nn

class BlocEncoderTransformer(nn.Module):
    def __init__(self, dim_modele=64, n_tetes=8, dim_feedforward=256, dropout=0.1):
        super().__init__()
        self.attention = nn.MultiheadAttention(dim_modele, n_tetes, dropout=dropout, batch_first=True)
        self.norm1 = nn.LayerNorm(dim_modele)
        self.feedforward = nn.Sequential(
            nn.Linear(dim_modele, dim_feedforward),
            nn.ReLU(),
            nn.Linear(dim_feedforward, dim_modele)
        )
        self.norm2 = nn.LayerNorm(dim_modele)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, masque_attention=None):
        attn_out, _ = self.attention(x, x, x, attn_mask=masque_attention)
        x = self.norm1(x + self.dropout(attn_out))
        ff_out = self.feedforward(x)
        x = self.norm2(x + self.dropout(ff_out))
        return x

class MiniTransformer(nn.Module):
    def __init__(self, taille_vocab, dim_modele=64, n_tetes=8, n_couches=4, longueur_max=128):
        super().__init__()
        self.embedding = nn.Embedding(taille_vocab, dim_modele)
        self.encodage_positionnel = nn.Parameter(torch.zeros(1, longueur_max, dim_modele))
        self.couches = nn.ModuleList([
            BlocEncoderTransformer(dim_modele, n_tetes) for _ in range(n_couches)
        ])
        self.sortie = nn.Linear(dim_modele, taille_vocab)

    def forward(self, x):
        seq_len = x.size(1)
        x = self.embedding(x) + self.encodage_positionnel[:, :seq_len, :]
        for couche in self.couches:
            x = couche(x)
        return self.sortie(x)
```

---

## 8. Exercices

**Exercice 1 — Self-attention à la main sur une phrase**

Sur une phrase de 5 mots (embeddings aléatoires de dimension 8), calcule la matrice d'attention avec `self_attention()` définie plus haut. Affiche-la sous forme de heatmap (`matplotlib`/`seaborn`) et identifie quel token "regarde" le plus quel autre.

```python
# TODO: réutiliser self_attention(), visualiser poids_attention en heatmap
```

**Exercice 2 — Vérifier le masque causal**

Construis une séquence de 6 tokens, applique `masque_causal()` aux scores d'attention, et vérifie que la matrice de poids résultante est bien triangulaire inférieure (aucun poids non nul vers le futur).

```python
# TODO: appliquer le masque, vérifier que poids_attention[i, j] == 0 pour j > i
```

**Exercice 3 — Visualiser l'encodage positionnel**

Génère l'encodage positionnel pour une séquence de 50 positions et une dimension de 64 avec `encodage_positionnel()`. Affiche-le comme une image (`plt.imshow`). Que remarques-tu sur les basses vs hautes fréquences ?

```python
# TODO: pe = encodage_positionnel(50, 64), plt.imshow(pe)
```

**Exercice 4 — Entraîner le MiniTransformer sur une tâche simple**

Entraîne `MiniTransformer` sur une tâche synthétique de prédiction du token suivant (ex : séquences de chiffres suivant un motif répétitif). Compare sa courbe de perte à celle du LSTM du module 9 sur la même tâche.

```python
# TODO: générer des séquences synthétiques, entraîner MiniTransformer avec CrossEntropyLoss
# TODO: comparer la vitesse de convergence avec le LSTM du module 9
```

---

## Conclusion

Ce module a décortiqué chaque mécanisme du Transformer : self-attention, multi-head attention, masquage causal, encodage positionnel, connexions résiduelles, et les trois grandes familles d'architectures (encoder-only, decoder-only, encoder-decoder). Cette compréhension approfondie éclaire directement ce qui se passe à l'intérieur des modèles pré-entraînés utilisés au module suivant avec Hugging Face — vous ne les utiliserez plus comme des boîtes noires.
