---
title: "Séance 4 : Automatiser les outils du quotidien"
description: "Savoir connecter n8n aux outils réellement utilisés au quotidien (Google Sheets, Gmail, Telegram, WhatsApp, Google Forms, Notion)."
category: "n8n"
difficulty: "Intermédiaire"
duration: "2h30 à 3h"
order: 5
---

# Séance 4 : Automatiser les outils du quotidien

**Objectif :** savoir connecter n8n aux outils réellement utilisés au quotidien (Google Sheets, Gmail, Telegram, WhatsApp, Google Forms, Notion), créer les credentials correspondants, et construire des automatisations concrètes combinant plusieurs de ces outils.
**Durée estimée :** 2h30 à 3h
**Prérequis :** Séances 1 à 3 (JSON, triggers, HTTP Request, webhooks). Avoir créé en amont un compte Google Cloud Console et un bot Telegram (BotFather), comme demandé en fin de séance 3.

---

## Introduction : la logique commune à tous ces outils

Avant de rentrer dans le détail de chaque service, il est important de comprendre que n8n traite toujours ces intégrations de la même façon, quel que soit l'outil :

1. **Un credential** est créé une fois (authentification au service)
2. **Un trigger** écoute ou interroge le service pour détecter un événement (nouveau mail, nouveau message, nouvelle ligne)
3. **Un ou plusieurs nodes d'action** interagissent avec le service (écrire, envoyer, créer, modifier)

Ce schéma se répète à l'identique pour Google Sheets, Gmail, Telegram, WhatsApp, Google Forms et Notion. Une fois ce principe compris pour un outil, les autres s'apprennent très vite par analogie.

**Deux grandes familles de triggers pour ces outils**
- **Polling** : n8n interroge régulièrement le service ("y a-t-il du nouveau ?"), ex. Google Sheets Trigger, Gmail Trigger
- **Push / Webhook** : le service prévient n8n en temps réel dès qu'un événement survient, ex. Telegram Trigger, WhatsApp Business Cloud, Google Forms (via Apps Script ou Sheets lié)

---

## 1. Google Sheets

### 1.1 Présentation

Google Sheets est souvent le point d'entrée le plus simple pour stocker ou lire des données structurées sans base de données dédiée : liste de clients, suivi de commandes, journal d'événements.

### 1.2 Créer le credential

1. Aller sur **console.cloud.google.com**, créer un projet (ou utiliser un projet existant)
2. Activer l'API **Google Sheets API** (menu "API et services" → "Bibliothèque")
3. Créer des identifiants OAuth 2.0 ("Écran de consentement OAuth" à configurer en premier, puis "Identifiants" → "Créer des identifiants" → "ID client OAuth")
4. Dans n8n, créer un credential de type **Google Sheets OAuth2 API**, coller le Client ID et le Client Secret
5. Suivre le lien de redirection affiché par n8n pour autoriser l'accès, et le coller dans la configuration de l'écran de consentement Google ("URI de redirection autorisés")
6. Se connecter avec le compte Google concerné et valider les autorisations demandées

**Point de vigilance pédagogique** : c'est souvent le moment le plus délicat de la séance pour un débutant. Prévoir du temps dédié et vérifier que chaque participant a bien activé l'API avant de créer les identifiants (erreur très fréquente : credential créé sans l'API activée).

### 1.3 Triggers disponibles

**Google Sheets Trigger**
- Déclenche le workflow selon un intervalle défini (polling), quand une ligne est ajoutée ou modifiée
- Paramètres : Spreadsheet (sélection via liste ou ID), Sheet (onglet), Event (Row Added, Row Updated, Any Update)
- Limite à connaître : c'est un trigger à intervalle, pas un push en temps réel - un délai de quelques minutes peut exister selon la fréquence configurée

### 1.4 Actions disponibles (node Google Sheets)

| Opération | Usage |
|---|---|
| **Append Row** | Ajouter une nouvelle ligne à la fin |
| **Append or Update Row** | Ajouter une ligne, ou mettre à jour si une colonne clé correspond déjà |
| **Update Row** | Modifier une ligne existante, identifiée par son numéro ou une colonne clé |
| **Get Row(s)** | Lire une ou plusieurs lignes, avec filtre possible |
| **Delete Row/Column** | Supprimer une ligne ou colonne |
| **Clear** | Vider une plage de cellules |

### 1.5 Exemple de configuration concrète

Scénario : enregistrer une commande reçue par webhook dans Google Sheets.
- Node Google Sheets, opération **Append Row**
- Spreadsheet : sélectionner dans la liste déroulante (ou coller l'ID présent dans l'URL du document)
- Sheet : `Commandes`
- Colonnes à mapper : `client` = <code v-pre>{{ $json.body.client }}</code>, `montant` = <code v-pre>{{ $json.body.montant }}</code>, `date` = <code v-pre>{{ $now.format('yyyy-MM-dd HH:mm') }}</code>

### 1.6 Pièges fréquents

| Symptôme | Cause probable |
|---|---|
| "Spreadsheet not found" | Mauvais ID, ou document non partagé avec le compte Google autorisé |
| Colonnes vides après Append | Noms de colonnes dans n8n ne correspondant pas exactement aux en-têtes réels de la feuille |
| Trigger ne détecte rien | Intervalle de polling trop long, ou mauvaise feuille sélectionnée |

---

## 2. Gmail

### 2.1 Présentation

Gmail permet d'automatiser la lecture (déclenchement sur réception d'email) et l'envoi (notifications, confirmations, rapports) d'emails.

### 2.2 Créer le credential

1. Même projet Google Cloud Console que pour Sheets (ou nouveau projet dédié)
2. Activer l'API **Gmail API**
3. Réutiliser ou créer un identifiant OAuth 2.0, avec les scopes Gmail nécessaires
4. Dans n8n, credential de type **Gmail OAuth2**, même procédure d'autorisation que Google Sheets

**Note pédagogique** : si le même compte Google Cloud a déjà servi pour Google Sheets, seule l'activation de l'API Gmail et l'ajout du scope sont nécessaires - pas besoin de tout recréer depuis zéro.

### 2.3 Triggers disponibles

**Gmail Trigger**
- Déclenche le workflow quand un nouvel email arrive (polling)
- Filtres disponibles : expéditeur, objet, libellé (label), présence de pièce jointe
- Paramètre important : "Simple" vs "Raw" pour le format des données renvoyées (Simple suffit dans la grande majorité des cas)

### 2.4 Actions disponibles (node Gmail)

| Opération | Usage |
|---|---|
| **Send Email** | Envoyer un email (destinataire, objet, corps en texte ou HTML) |
| **Send and Wait for Response** | Envoyer un email et mettre le workflow en pause jusqu'à une réponse ou une action (utile pour une validation humaine) |
| **Get Message(s)** | Lire un ou plusieurs emails |
| **Add/Remove Label** | Organiser les emails automatiquement |
| **Reply to Message** | Répondre dans le même fil de discussion |

### 2.5 Exemple de configuration concrète

Scénario : envoyer une confirmation automatique après l'ajout d'une commande dans Google Sheets.
- Node Gmail, opération **Send Email**
- To : <code v-pre>{{ $json.body.email }}</code>
- Subject : `Confirmation de votre commande`
- Message (HTML activable) :
```
Bonjour {{ $json.body.client }},

Votre commande de {{ $json.body.montant }} FCFA a bien ete enregistree.

Merci de votre confiance.
```

### 2.6 Pièges fréquents

| Symptôme | Cause probable |
|---|---|
| Email jamais détecté par le trigger | Mauvais filtre (ex. label inexistant), ou email déjà lu avant l'activation du workflow |
| Erreur d'envoi 403 | Scope OAuth insuffisant - vérifier que le scope d'envoi (`gmail.send`) a bien été autorisé |
| Email part en spam côté destinataire | Problème d'authentification du domaine expéditeur (SPF/DKIM), hors périmètre de n8n lui-même |

---

## 3. Telegram

### 3.1 Présentation

Telegram est souvent le canal le plus simple pour démarrer avec la messagerie automatisée : création de bot rapide, API bien documentée, aucun processus de validation business contrairement à WhatsApp.

### 3.2 Créer le credential

1. Ouvrir Telegram, chercher le bot **@BotFather**
2. Envoyer la commande `/newbot`, suivre les instructions (nom, username se terminant par "bot")
3. BotFather renvoie un **token** (ex. `123456789:ABCdefGhIJKlmNoPQRstuVWXyz`)
4. Dans n8n, credential de type **Telegram API**, coller ce token

**Astuce pour récupérer son chat_id**
Envoyer un message au bot créé, puis appeler `https://api.telegram.org/bot<TOKEN>/getUpdates` dans un navigateur pour voir le `chat.id` correspondant - nécessaire pour envoyer un message à un utilisateur ou groupe précis.

### 3.3 Triggers disponibles

**Telegram Trigger**
- Fonctionne en webhook (push en temps réel, pas de polling)
- Déclenche le workflow dès qu'un message, une commande, ou une interaction (clic sur un bouton) arrive sur le bot
- Paramètre "Updates" à cocher selon le type d'événement voulu (message, callback_query, etc.)

### 3.4 Actions disponibles (node Telegram)

| Opération | Usage |
|---|---|
| **Send Message** | Envoyer un message texte |
| **Send Photo / Document / Video** | Envoyer un média |
| **Send Chat Action** | Afficher "en train d'écrire..." pour une meilleure expérience utilisateur |
| **Edit Message Text** | Modifier un message déjà envoyé |
| **Answer Callback Query** | Répondre à un clic sur un bouton inline |

### 3.5 Exemple de configuration concrète

Scénario : notifier un canal Telegram interne dès qu'une grosse commande (plus de 5000 FCFA) est enregistrée - réutilisation directe de la logique IF vue en séance 2.
- Après le node IF (branche True), ajouter un node **Telegram**
- Opération : **Send Message**
- Chat ID : celui du canal ou groupe de l'équipe
- Text : <code v-pre>`Nouvelle grosse commande : {{ $json.body.client }} - {{ $json.body.montant }} FCFA`</code>

### 3.6 Pièges fréquents

| Symptôme | Cause probable |
|---|---|
| Le bot ne répond jamais | Webhook du Telegram Trigger non actif (workflow non activé), ou bot bloqué par l'utilisateur |
| "chat not found" à l'envoi | Mauvais chat_id, ou l'utilisateur n'a jamais initié de conversation avec le bot (le bot ne peut pas écrire en premier à un utilisateur qui ne lui a jamais parlé) |
| Caractères spéciaux mal affichés | Mode de formatage (Markdown/HTML) activé sans échapper certains caractères |

---

## 4. WhatsApp

### 4.1 Présentation

Deux approches possibles pour connecter WhatsApp à n8n :
- **WhatsApp Business Cloud API** (officielle Meta) : nécessite un compte Meta Business, un numéro vérifié, et une configuration plus longue, mais stable et conforme aux conditions d'utilisation
- **Solutions non officielles** (bibliothèques tierces type Baileys) : plus rapides à mettre en place pour un test, mais plus fragiles et à risque de bannissement du numéro - à ne mentionner qu'à titre informatif, sans encourager leur usage en production

Cette séance se concentre sur l'API officielle, seule recommandable pour un usage réel.

### 4.2 Créer le credential

1. Créer un compte sur **business.facebook.com** (Meta Business Suite)
2. Créer une application dans **developers.facebook.com**, ajouter le produit "WhatsApp"
3. Un numéro de test est fourni gratuitement par Meta pour commencer (limité à quelques destinataires vérifiés)
4. Récupérer le **Temporary Access Token** (ou configurer un token permanent via un System User pour la production)
5. Dans n8n, credential de type **WhatsApp API**, renseigner l'Access Token et le Phone Number ID

**Point de vigilance pédagogique** : cette configuration est nettement plus longue que Telegram. Prévoir d'y consacrer un temps dédié, et accepter que certains participants testent uniquement avec le numéro de démo Meta pendant la séance.

### 4.3 Triggers disponibles

**WhatsApp Trigger**
- Fonctionne en webhook
- Nécessite de configurer l'URL du webhook n8n dans le tableau de bord Meta for Developers, avec un "Verify Token" à faire correspondre des deux côtés
- Déclenche le workflow à la réception d'un message, d'un statut de livraison, ou d'une interaction avec un bouton

### 4.4 Actions disponibles (node WhatsApp)

| Opération | Usage |
|---|---|
| **Send Message** | Envoyer un message texte simple |
| **Send Template Message** | Envoyer un message à partir d'un template pré-approuvé par Meta (obligatoire pour initier une conversation en dehors de la fenêtre de 24h) |
| **Send Media Message** | Envoyer image, document, audio, vidéo |
| **Mark as Read** | Marquer un message comme lu |

**Notion essentielle : la fenêtre des 24h**
Une entreprise ne peut envoyer un message libre à un utilisateur que dans les 24h suivant son dernier message. Passé ce délai, seul un **template pré-approuvé** par Meta peut être utilisé pour relancer la conversation.

### 4.5 Exemple de configuration concrète

Scénario proche d'un projet déjà connu : classifier l'intention d'un message entrant puis répondre en conséquence.
- WhatsApp Trigger → Switch (intention : image / vidéo / question) → traitement correspondant → WhatsApp **Send Message** avec le résultat

### 4.6 Pièges fréquents

| Symptôme | Cause probable |
|---|---|
| Webhook jamais appelé | Verify Token différent entre Meta et n8n, ou URL non accessible publiquement (instance n8n locale sans tunnel) |
| Message refusé en envoi | Tentative d'envoi hors fenêtre 24h sans template approuvé |
| Token expiré après 24h | Utilisation du Temporary Access Token au lieu d'un token permanent (System User) |

---

## 5. Google Forms

### 5.1 Présentation

Google Forms n'a pas de trigger natif direct dans n8n. Deux approches fonctionnent en pratique :
- **Via Google Sheets** : lier le formulaire à une feuille de réponses, puis utiliser le Google Sheets Trigger vu en 1.3 - approche la plus simple et recommandée pour cette formation
- **Via Google Apps Script** : un script côté Google Forms appelle un Webhook n8n directement à chaque soumission - plus réactif (temps réel) mais demande d'écrire un petit script

### 5.2 Méthode recommandée (via Google Sheets)

1. Dans Google Forms, onglet "Réponses", cliquer sur l'icône Google Sheets pour lier une feuille de calcul
2. Chaque nouvelle soumission crée automatiquement une nouvelle ligne dans cette feuille
3. Utiliser un **Google Sheets Trigger** pointant sur cette feuille, événement "Row Added"

### 5.3 Méthode alternative (Apps Script + Webhook)

1. Dans Google Forms, menu "..." → "Éditeur de script"
2. Écrire une fonction déclenchée "Sur une nouvelle réponse", qui envoie les données du formulaire vers l'URL de production du Webhook n8n via `UrlFetchApp.fetch()`
3. Configurer un trigger Apps Script "Form Submit" sur cette fonction

**Comparatif pédagogique à présenter**

| Critère | Via Sheets | Via Apps Script |
|---|---|---|
| Simplicité | Très simple, pas de code | Nécessite d'écrire un script |
| Réactivité | Délai de polling | Temps réel |
| Niveau requis | Débutant | Intermédiaire |

### 5.4 Exemple de configuration concrète

Scénario : une inscription à un événement via Google Forms déclenche l'enregistrement et un email de bienvenue.
- Google Sheets Trigger (feuille liée au formulaire) → Edit Fields (nettoyage des noms de colonnes) → Gmail Send Email de confirmation

---

## 6. Notion (ou outil équivalent)

### 6.1 Présentation

Notion sert souvent de base de données légère et lisible pour une équipe (suivi de projets, CRM simplifié, base de connaissances). Si l'outil utilisé par les participants est différent (Airtable, Coda...), la logique de credential/trigger/action reste la même et transposable.

### 6.2 Créer le credential

1. Aller sur **notion.so/my-integrations**, créer une nouvelle intégration interne
2. Copier le token généré (**Internal Integration Token**)
3. Dans n8n, credential de type **Notion API**, coller ce token
4. Étape souvent oubliée : dans Notion, ouvrir la base de données à connecter, menu "..." → "Connexions" → ajouter l'intégration créée. Sans cette étape, n8n ne voit aucune donnée même avec un credential valide.

### 6.3 Triggers disponibles

**Notion Trigger**
- Fonctionne en polling
- Événements : "Page Added to Database", "Page Updated in Database"
- Nécessite de sélectionner la base de données cible (visible uniquement si l'étape de connexion ci-dessus a été faite)

### 6.4 Actions disponibles (node Notion)

| Opération | Usage |
|---|---|
| **Create Page (Database)** | Créer une nouvelle entrée dans une base |
| **Update Page** | Modifier une entrée existante |
| **Get Page(s)** | Lire une ou plusieurs entrées, avec filtre |
| **Append Block** | Ajouter du contenu (texte, liste) dans une page |

### 6.5 Exemple de configuration concrète

Scénario : centraliser dans Notion toutes les commandes reçues via webhook, en complément de Google Sheets.
- Node Notion, opération **Create Page (Database)**
- Base de données : `Suivi Commandes`
- Propriétés mappées : `Client` (title) = <code v-pre>{{ $json.body.client }}</code>, `Montant` (number) = <code v-pre>{{ $json.body.montant }}</code>, `Statut` (select) = `Nouvelle`

### 6.6 Pièges fréquents

| Symptôme | Cause probable |
|---|---|
| Base de données invisible dans n8n | Intégration non connectée à la base dans Notion (étape 6.2 oubliée) |
| Erreur sur un champ de type Select | La valeur envoyée ne correspond à aucune option existante dans Notion |

---

## Exercice de synthèse de la séance

**Scénario proposé - "Inscription à un événement"**
1. **Google Forms** (via Sheets) : un participant s'inscrit à un événement
2. **Google Sheets Trigger** détecte la nouvelle ligne
3. **Notion** : création automatique d'une fiche participant dans une base de suivi
4. **Gmail** : envoi d'un email de confirmation au participant
5. **Telegram** : notification à l'équipe organisatrice dans un groupe interne

Chaque participant adapte ce squelette à son propre cas d'usage.

---

## Récapitulatif de fin de séance

- Chaque intégration suit le même schéma : credential → trigger → actions
- Google Sheets et Notion fonctionnent en polling ; Telegram et WhatsApp fonctionnent en webhook (temps réel)
- WhatsApp Business Cloud exige une configuration plus lourde que Telegram, avec la contrainte stricte de la fenêtre des 24h et des templates approuvés
- Google Forms n'a pas de trigger natif : passer par Google Sheets (simple) ou Apps Script + Webhook (temps réel)
- L'étape souvent oubliée par les débutants : l'autorisation ou la connexion explicite entre le service et l'intégration (partage du document, connexion de la base Notion, activation de l'API)
