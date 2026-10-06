---
title: "Séance 7 : Construis ton propre projet"
description: "Choisir un cas d'usage et construire un workflow complet, fonctionnel et présentable."
category: "n8n"
difficulty: "Avancé"
duration: "2h à 3h"
order: 11
---

# Séance 7 : Construis ton propre projet

**Objectif :** choisir un cas d'usage qui te correspond, et construire un workflow complet, fonctionnel et présentable, à partir de tout ce que tu as appris depuis la séance 1.
**Prérequis :** séances 1 à 6 (triggers, logique conditionnelle, APIs, outils du quotidien, IA).

---

## 1. Avant de commencer : choisir ton cas d'usage

Tu as le choix entre six pistes de projet. Chacune reprend les briques déjà vues, assemblées différemment selon le contexte. Choisis celle qui correspond le plus à ton quotidien, ton métier, ou ce que tu veux pouvoir montrer dans ton portfolio.

### Commerce : Commande → Google Sheets → notification vendeur → confirmation client

**Ce que ce projet démontre**
Un pipeline de vente de bout en bout, de la réception d'une commande jusqu'à sa confirmation, avec une notification en temps réel pour le vendeur.

**Schéma de workflow**
1. Trigger : Webhook (simulant un site e-commerce) ou Telegram/WhatsApp
2. Extraction des détails de la commande (IA, comme vu en séance 6)
3. Enregistrement dans Google Sheets
4. Notification Telegram/WhatsApp au vendeur avec les détails
5. Email ou message de confirmation au client

**Point à soigner particulièrement**
La vérification du stock avant confirmation (comme fait en séance 6, exercice partie A) - un projet qui confirme une commande sans vérifier la disponibilité réelle n'est pas convaincant.

---

### Marketing : Nouveau prospect → enregistrement → IA → email personnalisé

**Ce que ce projet démontre**
Un pipeline de qualification et de prise de contact automatisée pour un nouveau lead.

**Schéma de workflow**
1. Trigger : Webhook (formulaire de contact) ou Google Sheets Trigger (si le formulaire alimente une feuille)
2. Enregistrement du prospect (Google Sheets ou Notion)
3. Génération par IA d'un email personnalisé, basé sur les informations fournies par le prospect (secteur d'activité, besoin exprimé)
4. Envoi via Gmail
5. (Optionnel) Notification à l'équipe commerciale sur Telegram pour un suivi humain

**Point à soigner particulièrement**
La personnalisation réelle de l'email généré : le prompt doit exploiter les informations spécifiques du prospect, pas produire un texte générique qui pourrait s'appliquer à n'importe qui.

---

### Administration : Formulaire → traitement → génération de document → notification

**Ce que ce projet démontre**
Une automatisation de traitement de demande administrative, avec génération d'un document final.

**Schéma de workflow**
1. Trigger : Google Forms (via Sheets, comme vu en séance 4) ou Webhook
2. Validation des données reçues (IF, vérification des champs obligatoires)
3. Génération du contenu d'un document (IA pour rédiger le texte, ou simple remplissage de template)
4. Création du document (selon tes outils disponibles : génération de texte simple enregistré, ou intégration plus poussée si tu as accès à un générateur de PDF)
5. Notification par email ou message à la personne concernée

**Point à soigner particulièrement**
La fiabilité de la validation en amont (étape 2) : un document généré à partir de données incomplètes ou mal formées n'a aucune valeur.

---

### Réseaux sociaux : Sujet → IA → génération de contenu → validation → publication

**Ce que ce projet démontre**
Un pipeline de création de contenu assisté par IA, avec une étape de validation humaine avant publication - reprend directement la logique du node "Send and Wait for Response" vue en séance 6, exercice partie B.

**Schéma de workflow**
1. Trigger : Manual Trigger ou Schedule Trigger (ex. tous les lundis, génération d'une idée de post)
2. Génération du contenu par IA (texte du post, éventuellement une légende ou des hashtags)
3. Envoi de la proposition pour validation (Gmail ou Telegram, avec Send and Wait for Response)
4. Si validé : publication (selon les outils disponibles - un simple enregistrement dans Google Sheets comme "contenu prêt à publier" est une version simplifiée tout à fait valable si tu n'as pas de connexion directe à un réseau social)
5. Si rejeté : le workflow s'arrête ou redemande une nouvelle génération

**Point à soigner particulièrement**
Ne jamais publier automatiquement sans validation humaine pour ce type de contenu - c'est justement ce qui rend ce projet réaliste et responsable.

---

### Support client : Message → IA → classification → réponse → enregistrement

**Ce que ce projet démontre**
Un système de support client automatisé, très proche de l'assistant commercial de la séance 6, mais recentré sur la résolution de problèmes plutôt que la vente.

**Schéma de workflow**
1. Trigger : Telegram, WhatsApp, ou Webhook
2. Classification de l'urgence et du type de demande par IA
3. Switch selon la catégorie (question simple, problème technique, urgent)
4. Réponse automatique pour les cas simples, ou escalade humaine pour les cas urgents (reprend la logique de validation vue en séance 6)
5. Enregistrement de chaque échange dans Google Sheets ou Notion, avec un statut (résolu, en attente, escaladé)

**Point à soigner particulièrement**
La distinction claire entre ce que l'IA peut traiter seule et ce qui doit être escaladé à un humain - un bon projet de support montre que tu sais poser cette limite, pas que tu automatises tout sans discernement.

---

### Éducation : Inscription étudiant → base de données → email → notification

**Ce que ce projet démontre**
Un pipeline d'inscription complet, proche de l'exercice de synthèse de la séance 4, mais que tu vas ici approfondir et personnaliser.

**Schéma de workflow**
1. Trigger : Google Forms (via Sheets) ou Webhook
2. Enregistrement dans une base de données (Google Sheets ou Notion)
3. Email de bienvenue personnalisé (généré par IA à partir des informations fournies, ex. la formation choisie, le niveau déclaré)
4. Notification à l'équipe pédagogique
5. (Optionnel) Vérification automatique des places disponibles, avec alerte si complet (reprend la logique de comptage vue en séance 4)

**Point à soigner particulièrement**
La gestion du cas "complet" ou "places limitées" - un projet qui ne gère que le cas optimiste (toujours de la place) est incomplet.

---

## 2. Méthodologie pour construire ton projet

### Étape 1 - Définir précisément le scénario

Avant d'ouvrir n8n, écris en une à deux phrases ce que ton workflow doit accomplir, du déclenchement jusqu'au résultat final. Exemple :
```
Quand un client envoie un message WhatsApp pour signaler un probleme avec sa commande,
le systeme classe l'urgence, repond automatiquement aux cas simples,
et transfere a un humain les cas urgents, en enregistrant chaque echange.
```

### Étape 2 - Dessiner le schéma avant de construire

Liste, dans l'ordre, les nodes dont tu auras besoin, avant de les ajouter dans n8n. Reprends le schéma proposé pour ton cas d'usage ci-dessus comme point de départ, et adapte-le à ta situation réelle.

### Étape 3 - Construire par petits blocs testables

Ne construis pas tout le workflow puis teste-le à la fin. Construis un bloc (ex. le trigger + la première transformation), teste-le avec Execute step, puis ajoute le bloc suivant. C'est la méthode que tu pratiques depuis la séance 1.

### Étape 4 - Prévoir les cas d'échec

Pour chaque étape qui dépend d'une donnée externe (une API, une IA, une feuille Google Sheets), demande-toi : "Que se passe-t-il si cette étape échoue ou renvoie quelque chose d'inattendu ?" Un projet présentable gère au moins les cas d'échec évidents (donnée manquante, produit introuvable, stock insuffisant), pas seulement le chemin optimal.

### Étape 5 - Nommer et documenter ton workflow

- Renomme chaque node avec un nom clair plutôt que de garder les noms par défaut (ex. "Classifier intention client" plutôt que "Basic LLM Chain1")
- Ajoute des sticky notes sur le canvas pour expliquer les sections complexes de ton workflow - utile autant pour toi que pour la présentation finale de la séance 8

---

## 3. Grille d'auto-évaluation avant la séance 8

Avant la dernière séance, vérifie que ton projet répond à ces critères :

- [ ] Le workflow se déclenche correctement et de façon fiable (teste plusieurs fois)
- [ ] Au moins une étape utilise l'IA de façon pertinente (pas juste pour "faire de l'IA", mais parce que ça résout un vrai besoin de compréhension ou de génération)
- [ ] Les cas d'échec ou les données manquantes sont gérés, pas seulement le chemin idéal
- [ ] Les credentials utilisés sont valides et les connexions fonctionnent de bout en bout
- [ ] Les nodes sont nommés clairement et le workflow est lisible visuellement
- [ ] Tu peux expliquer, étape par étape, pourquoi chaque node est là et ce qu'il fait

---

## 4. Pièges fréquents à cette étape du parcours

| Symptôme | Cause probable |
|---|---|
| Le projet devient trop ambitieux et bloque | Trop de fonctionnalités voulues en même temps - reviens à un scénario minimal qui fonctionne de bout en bout, puis enrichis-le seulement si le temps le permet |
| L'IA est utilisée partout, même là où ce n'est pas nécessaire | Une simple condition IF suffit parfois (ex. un montant à comparer) - garde l'IA pour ce qui a réellement besoin de compréhension de langage libre |
| Le workflow fonctionne en test mais jamais en conditions réelles | Les credentials, triggers ou données de test ne reflètent pas des cas réels - teste avec des messages/variations que tu n'as pas toi-même écrits pour construire le prompt |

---

## Ce que tu dois retenir de cette séance

- Un bon projet n'est pas celui qui utilise le plus de nodes possible, mais celui qui résout clairement un besoin réel, de bout en bout
- Construire par petits blocs testables reste la méthode la plus fiable, même sur un projet plus ambitieux
- Prévoir les cas d'échec fait la différence entre une démo fragile et un projet réellement utilisable
- Tu arrives à la séance 8 avec un projet que tu dois être capable d'expliquer et de défendre, pas seulement de faire fonctionner une fois
