---
title: "Séance 6 : Construire une automatisation IA"
description: "Construire un assistant commercial automatisé complet sur WhatsApp ou Telegram avec IA et Google Sheets."
category: "n8n"
difficulty: "Avancé"
duration: "2h à 3h"
order: 9
---

# Séance 6 : Construire une automatisation IA

**Objectif :** construire un assistant commercial automatisé complet, fonctionnant sur WhatsApp ou Telegram, qui comprend une demande client, consulte un stock, répond avec un ton naturel, et enregistre la conversation.
**Prérequis :** séances 4 (connexion Telegram/WhatsApp) et 5 (prompts, classification, extraction).

---

## 1. Présentation du projet : Assistant commercial automatisé

Tu vas construire un workflow qui reçoit un message d'un client sur WhatsApp ou Telegram, comprend ce qu'il demande, va vérifier une information réelle (le stock dans une Google Sheet), et répond de façon naturelle et personnalisée, sans intervention humaine.

**Ce que ce projet combine, concrètement**
- Le trigger de messagerie (Telegram ou WhatsApp, vu en séance 4)
- La classification d'intention par IA (vue en séance 5)
- Le Switch pour router selon l'intention (vu en séance 2)
- La lecture de données réelles dans Google Sheets (vue en séance 4)
- La génération de réponse personnalisée par IA (vue en séance 5)
- L'enregistrement de la conversation (Google Sheets, vu en séance 4)

C'est la séance où toutes les briques des séances précédentes se combinent dans un seul projet cohérent.

---

## 2. Préparer les données du catalogue

Avant de construire le workflow, prépare une Google Sheet simple qui représente le stock de la boutique.

1. Crée une nouvelle Google Sheet nommée `Catalogue Boutique`
2. En-têtes de la première ligne : `produit`, `prix_fcfa`, `stock_disponible`
3. Remplis quelques lignes d'exemple :

| produit | prix_fcfa | stock_disponible |
|---|---|---|
| riz local 25kg | 15000 | 12 |
| huile palme 5L | 6000 | 0 |
| savon artisanal | 500 | 50 |

Cette feuille sera consultée en temps réel par ton assistant pour répondre avec des informations exactes, plutôt que de laisser le modèle inventer un prix ou une disponibilité.

---

## 3. Construire le workflow étape par étape

### 3.1 Le trigger de messagerie

1. Crée un nouveau workflow : `Projet - Assistant Commercial`
2. Ajoute un node **Telegram Trigger** (recommandé pour la rapidité de mise en place) ou **WhatsApp Trigger** si ta configuration Meta est prête
3. Vérifie que le credential correspondant (créé en séance 4) est bien sélectionné
4. Active "Listen for test event" et envoie un message de test depuis ton téléphone : `Bonjour, avez-vous du riz en stock ?`

**Vérification** : le node reçoit le message, avec le texte sous `$json.message.text` (Telegram) ou `$json.body...` selon la structure exacte de WhatsApp.

### 3.2 Classifier l'intention du message

1. Ajoute un node **Basic LLM Chain**
2. Prompt :
```
Tu es un assistant qui classe les messages recus par une boutique en ligne.

Classe le message suivant dans une seule de ces categories exactement :
"question_produit", "commande", "reclamation", "autre"

Message : "{{ $json.message.text }}"

Reponds uniquement avec un JSON de cette forme, sans aucun texte avant ou apres :
{ "categorie": "..." }
```
3. Ajoute un node **Edit Fields (Set)** en mode JSON pour nettoyer la sortie :
```json
{
  "categorie": "={{ JSON.parse($json.text).categorie }}"
}
```

### 3.3 Router selon l'intention (Switch)

1. Ajoute un node **Switch** juste après
2. Configure les cas sur <code v-pre>{{ $json.categorie }}</code> : `question_produit`, `commande`, `reclamation`, avec fallback sur `autre`
3. Pour cette séance, tu développes en détail uniquement la branche `question_produit` ; les autres branches reçoivent une réponse générique simple pour l'instant (à développer toi-même en séance 7 si ton projet final va dans cette direction)

### 3.4 Extraire le produit demandé

Sur la branche `question_produit` :

1. Ajoute un node **Basic LLM Chain**
2. Prompt :
```
Extrait le nom du produit mentionne dans ce message, de la facon la plus proche possible d'un nom de produit standard (sans quantite, sans unite) :

Message : "{{ $('Telegram Trigger').item.json.message.text }}"

Reponds uniquement avec un JSON de cette forme :
{ "produit": "..." }
```
3. Ajoute un node **Edit Fields (Set)** pour nettoyer :
```json
{
  "produit": "={{ JSON.parse($json.text).produit }}"
}
```

### 3.5 Consulter le stock réel (Google Sheets)

1. Ajoute un node **Google Sheets**
2. Operation : `Get Row(s)`
3. Document : `Catalogue Boutique`
4. Dans les options de filtre, configure une recherche où la colonne `produit` contient la valeur extraite : <code v-pre>{{ $json.produit }}</code>

**Point d'attention important**
La correspondance entre ce que le client écrit ("riz", "du riz", "riz local") et le nom exact dans ta feuille ("riz local 25kg") ne sera pas toujours parfaite avec une simple recherche "contient". Pour une version plus robuste, tu peux demander au modèle à l'étape 3.4 de choisir parmi une liste fermée de produits que tu lui donnes directement dans le prompt, plutôt que de le laisser extraire librement.

**Version améliorée recommandée du prompt 3.4** :
```
Voici la liste exacte des produits disponibles : "riz local 25kg", "huile palme 5L", "savon artisanal".

Le client a ecrit : "{{ $('Telegram Trigger').item.json.message.text }}"

Identifie lequel de ces produits exacts correspond le mieux a sa demande.
Si aucun ne correspond clairement, reponds avec "inconnu".

Reponds uniquement avec un JSON de cette forme :
{ "produit": "..." }
```

Cette approche, où tu donnes au modèle les options exactes plutôt que de le laisser inventer librement, est une technique essentielle à retenir : plus tu contraints les choix possibles, plus la sortie du modèle devient fiable et exploitable par le reste du workflow.

### 3.6 Générer la réponse finale

1. Ajoute un node **IF** après le Google Sheets : vérifie si une ligne a été trouvée (<code v-pre>{{ $json.produit }}</code> n'est pas vide, ou utilise le nombre d'items renvoyés)
2. Branche **True** → ajoute un node **Basic LLM Chain** :
```
Tu es un assistant commercial chaleureux pour une boutique en ligne togolaise.

Le client a demande des informations sur : {{ $json.produit }}
Voici les donnees reelles du stock :
- Prix : {{ $json.prix_fcfa }} FCFA
- Stock disponible : {{ $json.stock_disponible }} unites

Redige une reponse courte (maximum 3 phrases), polie et naturelle, qui donne ces informations au client.
Si le stock disponible est 0, informe-le poliment que le produit est actuellement indisponible, sans donner le prix dans ce cas.
Ne mentionne jamais que tu es une intelligence artificielle.
```
3. Branche **False** (produit non trouvé) → ajoute un node **Basic LLM Chain** avec un prompt simple qui informe poliment le client que le produit n'a pas été identifié et propose de reformuler sa demande

### 3.7 Envoyer la réponse

1. Ajoute un node **Telegram** (ou **WhatsApp**) après chaque branche
2. Operation : `Send Message`
3. Chat ID : <code v-pre>{{ $('Telegram Trigger').item.json.message.chat.id }}</code> (récupéré automatiquement du message entrant, pas besoin de le chercher manuellement)
4. Text : <code v-pre>{{ $json.text }}</code> (la réponse générée par le node précédent)

### 3.8 Enregistrer la conversation

1. Ajoute un node **Google Sheets** en fin de chaîne (après l'envoi, sur toutes les branches si possible, en les reconnectant via un **Merge**)
2. Operation : `Append Row`
3. Crée au préalable une feuille `Historique Conversations` avec les colonnes : `date`, `client_id`, `message_recu`, `categorie`, `reponse_envoyee`
4. Mappe chaque colonne avec les expressions correspondantes récupérées tout au long du workflow

---

## 4. Tester le workflow complet

Envoie successivement ces messages à ton bot et observe le comportement à chaque étape dans l'onglet Executions :

1. `"Avez-vous du riz en stock ?"` → doit renvoyer le prix et le stock du riz
2. `"Combien coute l'huile de palme ?"` → doit informer que le stock est à 0 et ne pas donner de prix
3. `"Je veux acheter 3 sacs de ciment"` → le produit n'existe pas dans le catalogue, doit renvoyer la réponse de la branche False

---

## 5. Pièges fréquents à surveiller

| Symptôme | Cause probable |
|---|---|
| Le produit n'est jamais retrouvé dans Google Sheets | Le nom extrait par l'IA ne correspond pas exactement aux noms du catalogue - utilise la version améliorée du prompt avec liste fermée |
| Le chat_id n'est pas trouvé pour la réponse | Structure du message différente entre Telegram et WhatsApp - vérifie l'onglet Output du trigger pour le chemin exact |
| La réponse finale mentionne un prix alors que le stock est à 0 | Consigne insuffisamment explicite dans le prompt de l'étape 3.6 - renforce la condition dans le texte du prompt |
| Le node IF de l'étape 3.6 ne fonctionne pas correctement | Vérifie si Google Sheets Get Row(s) renvoie bien 0 item (et non un item vide) quand rien n'est trouvé - adapte la condition en conséquence (ex. tester sur le nombre d'items plutôt que sur un champ précis) |

---

## 6. Ce que tu dois retenir de ce projet

- Un assistant IA fiable ne laisse jamais le modèle "inventer" une donnée métier (prix, stock) : il va toujours chercher la vraie donnée dans une source fiable (ici Google Sheets) avant de répondre
- Contraindre les choix possibles du modèle (lui donner une liste fermée plutôt que de le laisser extraire librement) améliore fortement la fiabilité de l'extraction
- Combiner plusieurs appels IA successifs, chacun avec un rôle précis et limité, donne un résultat plus robuste qu'un seul gros prompt qui essaierait de tout faire en même temps
- Enregistrer chaque échange permet de garder une trace exploitable pour améliorer le système plus tard, ou pour qu'un humain reprenne la conversation en cas de besoin
