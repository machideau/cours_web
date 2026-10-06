---
title: "Séance 5 : Introduire l'IA dans n8n"
description: "Comprendre comment un LLM s'intègre dans un workflow, écrire de bons prompts, et utiliser l'IA."
category: "n8n"
difficulty: "Intermédiaire"
duration: "1h30 à 2h"
order: 7
---

# Séance 5 : Introduire l'IA dans n8n

**Objectif :** comprendre comment un LLM s'intègre dans un workflow, écrire de bons prompts, et utiliser l'IA pour générer du texte, classifier, extraire de l'information et résumer du contenu.
**Prérequis :** avoir une clé API sur OpenRouter, Google AI Studio (Gemini) ou OpenAI.

---

## 1. Pourquoi connecter l'IA à une automatisation ?

Jusqu'ici, tes workflows traitent des données structurées : du JSON avec des champs précis, des conditions claires (montant supérieur à X, ville égale à Y). Mais une grande partie des données réelles que tu reçois sont non structurées : un message WhatsApp écrit en langage libre, un email dont tu dois extraire l'intention, un commentaire client à résumer.

Un LLM (Large Language Model) te permet d'ajouter une étape de "compréhension" dans ton workflow, là où un simple IF ou Switch ne suffit plus. Au lieu de chercher un mot-clé exact, tu demandes au modèle de comprendre le sens et de te renvoyer une réponse structurée, exploitable par le reste du workflow.

**Ce que l'IA ajoute concrètement à tes automatisations**
- Comprendre une demande formulée librement, sans format fixe
- Produire un texte personnalisé plutôt qu'un modèle figé
- Transformer du texte non structuré en données structurées (JSON) exploitables par les nodes suivants
- Prendre une petite décision contextuelle (classer, prioriser, résumer) sans règle codée à la main

**Ce que l'IA n'est pas dans ce contexte**
Elle n'est pas magique ni infaillible : un LLM peut se tromper, halluciner une information, ou répondre dans un format inattendu. Tu dois toujours garder un contrôle derrière (validation, IF, relecture humaine pour les cas sensibles).

---

## 2. LLM : comprendre ce que c'est

Un LLM (grand modèle de langage) est un modèle entraîné sur d'énormes quantités de texte, capable de prédire la suite la plus probable d'un texte donné. Concrètement, tu lui donnes un texte en entrée (le prompt) et il te renvoie un texte en sortie (la réponse), généré mot après mot selon ce qui est statistiquement cohérent avec l'entraînement et le contexte que tu lui donnes.

**Points essentiels à retenir**
- Le modèle n'a pas de mémoire entre deux appels séparés, sauf si tu lui renvoies l'historique de la conversation toi-même dans le prompt
- Il ne "sait" rien en dehors de ce que tu lui donnes dans le prompt, sauf les connaissances apprises pendant son entraînement (qui ont une date de coupure)
- Plus le prompt est précis, plus la réponse est fiable et exploitable

**Quelques modèles courants que tu rencontreras**
- **GPT** (OpenAI)
- **Gemini** (Google)
- **Claude** (Anthropic)
- Des modèles open-source accessibles via OpenRouter (Llama, Mistral, etc.)

Dans n8n, le choix du modèle se fait via le credential et le node utilisé - la logique de construction du workflow reste identique quel que soit le modèle choisi derrière.

---

## 3. Le prompt

Le prompt est l'instruction que tu donnes au modèle. C'est l'élément le plus important de tout ton travail avec l'IA : un prompt flou donne une réponse flou, un prompt précis donne une réponse exploitable directement par le reste de ton workflow.

**Les composantes d'un bon prompt**
- **Le rôle** : qui le modèle doit incarner (ex. "Tu es un assistant commercial pour une boutique en ligne")
- **La tâche** : ce qu'il doit faire précisément (ex. "Classe ce message selon son intention")
- **Le contexte** : les informations nécessaires pour répondre correctement (ex. les catégories possibles, les données du client)
- **Le format de sortie attendu** : décrire exactement comment la réponse doit être structurée (ex. "Réponds uniquement avec un JSON contenant les champs intention et confiance")
- **Des exemples** (facultatif mais puissant) : montrer un ou plusieurs exemples d'entrée/sortie attendue pour cadrer le style de réponse

**Exemple de prompt mal construit**
```
Dis-moi ce que veut ce client.
```

**Exemple de prompt bien construit**
```
Tu es un assistant qui classe les messages clients d'une boutique en ligne.

Classe le message suivant dans une de ces categories exactement :
"commande", "reclamation", "question_produit", "autre"

Message du client : "{{ $json.message }}"

Reponds uniquement avec un JSON de cette forme, sans aucun texte autour :
{ "categorie": "..." }
```

**Technique utile : le "system prompt"**
Beaucoup de nodes IA dans n8n séparent le **System Prompt** (le rôle et les règles générales, fixes pour tout le workflow) du **message utilisateur** (la donnée variable à traiter à chaque exécution). Cette séparation te permet de garder tes règles stables pendant que le contenu change à chaque appel.

---

## 4. Input / Output

**Input (entrée)**
Ce que tu envoies au modèle : le prompt complet, construit à partir de données dynamiques de ton workflow grâce aux expressions <code v-pre>{{ }}</code> que tu maîtrises déjà depuis la séance 2.

**Output (sortie)**
Ce que le modèle te renvoie : un texte brut par défaut. Tu dois donc explicitement demander un format structuré si tu veux réutiliser cette sortie dans les nodes suivants (IF, Switch, Google Sheets, etc.).

**Un piège fréquent à connaître**
Le modèle peut renvoyer du texte autour du JSON demandé (ex. "Voici le resultat : { ... }"), ce qui casse le parsing JSON dans n8n. Pour éviter cela :
- Insiste explicitement dans le prompt : "Réponds uniquement avec le JSON, sans aucun texte avant ou après"
- Utilise, quand il est disponible sur le node IA que tu utilises, le mode de sortie structurée (souvent appelé "Structured Output" ou "JSON mode"), qui force le modèle à respecter un schéma précis
- Ajoute un node de nettoyage juste après (ex. extraire uniquement ce qui se trouve entre les premières et dernières accolades) si le mode structuré n'est pas disponible

---

## 5. Gemini / OpenAI (connexion dans n8n)

### 5.1 Créer le credential

**Pour Gemini (Google AI Studio)**
1. Va sur **aistudio.google.com**, génère une clé API gratuite
2. Dans n8n, crée un credential de type **Google Gemini (PaLM) API**, colle la clé

**Pour OpenAI**
1. Va sur **platform.openai.com**, section API Keys, génère une clé
2. Dans n8n, crée un credential de type **OpenAI API**, colle la clé

**Pour OpenRouter (accès à de nombreux modèles via une seule clé)**
1. Va sur **openrouter.ai**, génère une clé API
2. Dans n8n, crée un credential de type **OpenRouter API** (ou configure un credential générique "OpenAI API" en changeant l'URL de base, selon la version de n8n), colle la clé

### 5.2 Les nodes disponibles

**Basic LLM Chain**
Le node le plus simple pour un premier contact avec l'IA : tu lui donnes un prompt, il te renvoie une réponse texte. Idéal pour commencer.

**Message a Model (ou "OpenAI"/"Google Gemini" node selon le fournisseur)**
Un appel direct au modèle choisi, avec plus d'options de configuration fines (température, longueur maximale, format de sortie).

**AI Agent**
Vu en détail à la section 6 ci-dessous - un node bien plus puissant, capable d'utiliser des outils.

### 5.3 Paramètres importants à connaître

- **Model** : le modèle précis à utiliser (ex. `gemini-2.0-flash`, `gpt-4o-mini`) - un modèle plus petit/rapide suffit pour des tâches simples comme la classification, un modèle plus puissant est préférable pour de la génération de contenu élaborée
- **Temperature** : contrôle le degré de créativité/aléatoire de la réponse. Une valeur basse (0 à 0.3) donne des réponses stables et prévisibles (idéal pour classification/extraction) ; une valeur plus haute (0.7 à 1) donne des réponses plus créatives et variées (idéal pour de la génération de contenu)
- **Max Tokens** : la longueur maximale de la réponse générée

---

## 6. AI Agent : introduction

Le node **AI Agent** va plus loin qu'un simple appel au modèle : il permet au modèle de décider lui-même d'utiliser des outils (d'autres nodes, des API, des recherches) pour construire sa réponse, plutôt que de répondre uniquement à partir de ce qu'il "sait" déjà.

**Différence entre un appel simple et un AI Agent**

| | Appel simple (Basic LLM Chain) | AI Agent |
|---|---|---|
| Fonctionnement | Prompt → réponse directe | Prompt → le modèle peut choisir d'utiliser un ou plusieurs outils avant de répondre |
| Exemple d'usage | Résumer un texte donné | Répondre à une question en consultant d'abord une base de données ou une API externe |
| Complexité | Simple à configurer | Demande de connecter des "Tools" supplémentaires au node |

**Les "Tools" connectables à un AI Agent dans n8n**
- Un autre workflow n8n (Sub-workflow)
- Un appel HTTP Request (ex. consulter une API météo si l'utilisateur pose une question sur le temps)
- Une recherche dans une base vectorielle (pour des cas plus avancés type RAG)
- Un calculateur, une recherche web, etc. selon les nodes disponibles

**Pour cette séance**
Tu n'as pas besoin de construire un AI Agent complet dès maintenant - l'important est de comprendre la différence conceptuelle. Les séances 6 et suivantes iront plus loin dans la pratique, notamment avec le projet d'assistant commercial automatisé.

---

## 7. Génération de texte

**Cas d'usage typique**
Générer une réponse personnalisée à un client, rédiger un email, créer une description de produit.

**Exemple de prompt pour générer une réponse client**
```
Tu es un assistant commercial chaleureux et professionnel pour une boutique en ligne togolaise.

Un client a ecrit ce message : "{{ $json.message }}"

Redige une reponse courte (3 phrases maximum), polie, qui repond directement a sa demande.
Ne mentionne jamais que tu es une intelligence artificielle.
```

**Point d'attention**
Toujours fixer une limite de longueur dans le prompt (ex. "3 phrases maximum"), sinon le modèle peut générer des réponses disproportionnées par rapport à l'usage prévu (ex. dans un message WhatsApp, une réponse trop longue nuit à l'expérience).

---

## 8. Classification

**Cas d'usage typique**
Déterminer la catégorie d'un message pour le router ensuite avec un node Switch, exactement comme vu en séance 2, mais ici la décision est prise par le modèle plutôt que par une condition fixe.

**Exemple de prompt pour classifier une intention**
```
Classe le message suivant dans une seule de ces categories exactement :
"vente", "support", "reclamation", "autre"

Message : "{{ $json.message }}"

Reponds uniquement avec un JSON de cette forme :
{ "categorie": "..." }
```

**Ce qui vient après dans le workflow**
Une fois la sortie JSON obtenue et parsée, tu peux brancher un node **Switch** directement sur le champ <code v-pre>{{ $json.categorie }}</code>, exactement comme tu l'as fait avec des données fixes en séance 2.

---

## 9. Extraction d'informations

**Cas d'usage typique**
Transformer un texte libre en champs structurés exploitables, par exemple extraire d'un message les informations nécessaires pour créer une commande.

**Exemple de prompt pour extraire des informations**
```
Extrait les informations suivantes du message ci-dessous :
- nom du produit demande
- quantite (nombre, si mentionnee, sinon null)
- ville de livraison (si mentionnee, sinon null)

Message : "{{ $json.message }}"

Reponds uniquement avec un JSON de cette forme exacte :
{ "produit": "...", "quantite": ..., "ville": "..." }
```

**Point d'attention**
Toujours prévoir le cas où une information est absente du message (d'où le `null` explicitement autorisé dans le prompt). Sans cette précision, le modèle peut inventer une valeur plausible mais fausse - exactement le type d'hallucination à anticiper.

---

## 10. Résumé automatique

**Cas d'usage typique**
Résumer un long email, un commentaire client, un document, pour en extraire l'essentiel avant de le transmettre à quelqu'un ou de l'enregistrer.

**Exemple de prompt pour résumer**
```
Resume le texte suivant en 2 phrases maximum, en gardant uniquement les informations essentielles :

{{ $json.texte }}
```

**Variante avec contrainte de format**
```
Resume ce texte en exactement 3 points cles, sous forme de liste a puces courtes :

{{ $json.texte }}
```

---

## Ce qu'il faut maîtriser à la fin de cette séance

- La différence entre le rôle, la tâche, le contexte et le format de sortie dans un prompt
- Comment forcer une sortie JSON exploitable par le reste d'un workflow, et comment éviter le texte parasite autour du JSON
- La différence entre un appel simple au modèle et un AI Agent capable d'utiliser des outils
- Les quatre grands usages pratiques : génération de texte, classification, extraction d'informations, résumé
- L'importance de garder un contrôle (IF, validation) après chaque sortie IA, car le modèle peut se tromper ou mal formater sa réponse
