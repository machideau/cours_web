---
slug: hugging-face-modeles-pretraines
title: "Hugging Face : Utiliser et Fine-tuner des Modèles Pré-entraînés"
description: "Prendre en main l'écosystème Hugging Face : pipelines, AutoModel/AutoTokenizer, datasets, fine-tuning avec Trainer et LoRA."
category: "Intelligence Artificielle & Machine Learning"
order: 10
---

# Hugging Face : Utiliser et Fine-tuner des Modèles Pré-entraînés

Premier module de la partie écosystème open-source. Plutôt que d'entraîner des Transformers depuis zéro (module 9), on exploite ici des modèles déjà pré-entraînés sur d'immenses corpus, disponibles via le Hub Hugging Face.

## 1. Vue d'ensemble de l'écosystème

- **Le Hub** : plus de 500 000 modèles, avec fiches modèle (model card), licences et benchmarks — toujours vérifier la licence avant usage en production
- **La librairie `transformers`** : API unifiée fonctionnant avec PyTorch, TensorFlow ou JAX pour charger n'importe quel modèle du Hub
- **`datasets`** : chargement et manipulation de jeux de données standardisés
- **`pipeline()`** : la façon la plus rapide de faire de l'inférence, pour du prototypage
- **`AutoModel` / `AutoTokenizer`** : accès bas niveau, nécessaire pour le fine-tuning et le contrôle fin de l'inférence

## 2. Inférence rapide avec `pipeline()`

```python
from transformers import pipeline

# Analyse de sentiment
classifieur = pipeline("sentiment-analysis")
print(classifieur("J'adore ce cours de machine learning !"))

# Génération de texte
generateur = pipeline("text-generation", model="gpt2")
print(generateur("Le machine learning permet de", max_new_tokens=30))

# Résumé automatique
resumeur = pipeline("summarization")
print(resumeur(long_texte, max_length=60, min_length=20))
```

`pipeline()` télécharge et met en cache automatiquement le modèle et son tokenizer associés — pratique pour prototyper, mais peu flexible pour du contrôle fin (batching, device, paramètres de génération).

## 3. Contrôle fin avec AutoModel et AutoTokenizer

Le principe des classes `Auto*` : elles lisent la configuration du modèle sur le Hub et sélectionnent automatiquement la bonne architecture — plus besoin de connaître la classe exacte du modèle à l'avance.

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

nom_modele = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(nom_modele)
modele = AutoModelForSequenceClassification.from_pretrained(nom_modele)

textes = ["Ce produit est excellent", "Je suis déçu de cet achat"]
entrees = tokenizer(textes, padding=True, truncation=True, return_tensors="pt")

with torch.no_grad():
    sorties = modele(**entrees)
    probabilites = torch.softmax(sorties.logits, dim=-1)

print(probabilites)
```

On retrouve ici le softmax vu au module 2 : les logits bruts du modèle sont convertis en probabilités interprétables.

## 4. La librairie `datasets`

```python
from datasets import load_dataset

dataset = load_dataset("imdb")
print(dataset)
print(dataset["train"][0])

# Tokenisation de tout le dataset en une passe
def tokeniser(exemples):
    return tokenizer(exemples["text"], padding="max_length", truncation=True)

dataset_tokenise = dataset.map(tokeniser, batched=True)
```

## 5. Fine-tuning avec l'API `Trainer`

Le fine-tuning consiste à repartir des poids pré-entraînés et à continuer l'entraînement (rétropropagation + descente de gradient, modules 2 et 6) sur ses propres données, généralement avec un learning rate faible pour ne pas détruire les connaissances déjà apprises.

```python
from transformers import AutoModelForSequenceClassification, TrainingArguments, Trainer
import numpy as np
import evaluate

modele = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=2)

metrique = evaluate.load("accuracy")

def calculer_metriques(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    return metrique.compute(predictions=predictions, references=labels)

arguments_entrainement = TrainingArguments(
    output_dir="./resultats",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    num_train_epochs=3,
    evaluation_strategy="epoch",
    save_strategy="epoch",
)

entraineur = Trainer(
    model=modele,
    args=arguments_entrainement,
    train_dataset=dataset_tokenise["train"],
    eval_dataset=dataset_tokenise["test"],
    compute_metrics=calculer_metriques,
)

entraineur.train()
```

## 6. Fine-tuning efficace avec LoRA / QLoRA (PEFT)

Le fine-tuning complet d'un grand modèle (plusieurs milliards de paramètres) nécessite un matériel coûteux. **LoRA** (Low-Rank Adaptation) fige les poids originaux et n'entraîne que de petites matrices additionnelles insérées dans chaque couche, réduisant considérablement le nombre de paramètres entraînables. **QLoRA** combine LoRA avec une quantification 4-bit du modèle de base, permettant de fine-tuner un modèle de 7 milliards de paramètres sur un seul GPU grand public.

```python
from peft import LoraConfig, get_peft_model, TaskType

config_lora = LoraConfig(
    task_type=TaskType.SEQ_CLS,
    r=8,                # rang des matrices de décomposition
    lora_alpha=16,
    lora_dropout=0.1,
    target_modules=["q_lin", "v_lin"]  # couches d'attention ciblées
)

modele_lora = get_peft_model(modele, config_lora)
modele_lora.print_trainable_parameters()  # affiche : ex. 0.3% des paramètres entraînables
```

Le reste de l'entraînement (Trainer, TrainingArguments) reste identique à la section précédente.

## 7. Publier son modèle sur le Hub

```python
modele_lora.push_to_hub("mon-compte/mon-modele-finetune")
tokenizer.push_to_hub("mon-compte/mon-modele-finetune")
```

## 8. Framework-agnostique : PyTorch, TensorFlow, JAX

Un même checkpoint du Hub peut être chargé indifféremment :

```python
# PyTorch (par défaut)
modele_pt = AutoModelForSequenceClassification.from_pretrained(nom_modele)

# TensorFlow
from transformers import TFAutoModelForSequenceClassification
modele_tf = TFAutoModelForSequenceClassification.from_pretrained(nom_modele)
```

---

## 9. Exercices

**Exercice 1 — Comparer pipeline() et AutoModel**

Réalise la même tâche de classification de sentiment avec `pipeline()` puis avec `AutoTokenizer`/`AutoModelForSequenceClassification`. Vérifie que les résultats (probabilités) sont identiques.

```python
# TODO: comparer les deux approches sur les mêmes phrases
```

**Exercice 2 — Fine-tuning complet sur un dataset personnalisé**

Fine-tune `distilbert-base-uncased` sur un petit dataset de classification de texte de ton choix (ex : avis clients en français avec un modèle multilingue comme `camembert-base`). Évalue l'accuracy avant/après fine-tuning.

```python
# TODO: charger le dataset personnalisé, tokeniser, entraîner avec Trainer
```

**Exercice 3 — LoRA vs fine-tuning complet**

Sur le même dataset, compare le fine-tuning complet et le fine-tuning LoRA : nombre de paramètres entraînables, temps d'entraînement, accuracy finale.

```python
# TODO: comparer print_trainable_parameters() et les métriques finales des deux approches
```

**Exercice 4 — Pipeline de génération contrainte**

Utilise `pipeline("text-generation")` avec différents paramètres (`temperature`, `top_p`, `max_new_tokens`) et observe l'effet sur la diversité et la cohérence des textes générés.

```python
# TODO: générer avec plusieurs configurations de température/top_p et comparer
```

---

## Conclusion

Hugging Face permet de bénéficier de modèles pré-entraînés à l'état de l'art sans les coûts d'entraînement associés, et LoRA/QLoRA rendent le fine-tuning accessible même sur du matériel limité. Le module suivant aborde le versioning des modèles et des données, ainsi que le suivi d'expérimentation avec MLflow ou Weights & Biases — des outils indispensables dès qu'on multiplie les entraînements et les itérations.
