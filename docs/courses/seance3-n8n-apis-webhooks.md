---
title: "Séance 3 : APIs et Webhooks"
description: "Comprendre ce qu'est une API REST, savoir l'appeler depuis n8n, et maîtriser le fonctionnement des webhooks."
category: "n8n"
difficulty: "Intermédiaire"
duration: "2h à 2h30"
order: 4
---

# Séance 3 : APIs et Webhooks

**Objectif :** comprendre ce qu'est une API REST, savoir l'appeler depuis n8n, et maîtriser le fonctionnement des webhooks.
**Durée estimée :** 2h à 2h30
**Prérequis :** Séances 1 et 2 (JSON, HTTP Request de base, Webhook trigger vu rapidement)

---

## 1. Qu'est-ce qu'une API ?

**Définition**
Une API (Application Programming Interface) est une interface qui permet à deux systèmes informatiques de communiquer entre eux, sans que l'un ait besoin de connaître les détails internes de l'autre.

**Analogie**
Un serveur au restaurant : le client (l'application) passe commande au serveur (l'API), qui va chercher le plat en cuisine (le système) sans que le client ait besoin d'entrer en cuisine.

**Ce qu'une API expose généralement**
- Des données (lire une liste de produits, un profil utilisateur)
- Des actions (créer une commande, envoyer un message)

---

## 2. REST

**Définition**
REST (Representational State Transfer) est un style d'architecture pour construire des APIs, aujourd'hui le plus répandu. Une API REST expose des **ressources** (ex. `/clients`, `/commandes`) accessibles via des URLs et manipulées avec des méthodes HTTP standard.

**Principes clés**
- Chaque ressource a une URL propre : `https://api.exemple.com/clients/42`
- Les réponses sont généralement en JSON
- Chaque requête est indépendante (pas de mémoire entre deux appels, sauf via authentification)

---

## 3. GET / POST (et les autres méthodes)

| Méthode | Usage | Exemple |
|---|---|---|
| **GET** | Lire des données, sans les modifier | Récupérer la liste des produits |
| **POST** | Créer une nouvelle ressource | Créer une nouvelle commande |
| **PUT / PATCH** | Modifier une ressource existante | Mettre à jour le stock d'un produit |
| **DELETE** | Supprimer une ressource | Annuler une commande |

**Règle simple à retenir**
GET ne doit jamais modifier de données côté serveur. Si on veut créer, modifier ou supprimer, on utilise POST/PUT/PATCH/DELETE.

---

## 4. Headers

**Définition**
Les headers (en-têtes) sont des métadonnées envoyées avec une requête HTTP, en plus des données elles-mêmes.

**Headers courants**
- `Content-Type: application/json` - indique que le corps de la requête est du JSON
- `Authorization: Bearer <token>` - transmet une clé d'authentification
- `Accept: application/json` - indique le format de réponse souhaité

**Dans n8n**
Se configurent dans l'onglet "Headers" du node HTTP Request, en ajoutant des paires nom/valeur.

---

## 5. Body

**Définition**
Le body (corps) est le contenu envoyé avec une requête POST/PUT/PATCH, généralement au format JSON.

**Exemple de body pour créer une commande**
```json
{
  "client": "Awa",
  "produit": "riz",
  "quantite": 2
}
```

**Dans n8n**
Dans le node HTTP Request, activer "Send Body", choisir le type (JSON généralement), puis remplir soit en mode formulaire (clé/valeur), soit en JSON brut.

**Différence avec GET**
Une requête GET n'a normalement pas de body - les paramètres passent dans l'URL (query params, ex. `?ville=Lome`) ou dans le path (`/clients/42`).

---

## 6. JSON (dans le contexte des APIs)

**Rappel**
Format d'échange standard entre client et API. Presque toutes les APIs modernes envoient et reçoivent du JSON.

**Point clé de cette séance**
Savoir lire la documentation d'une API pour connaître :
- La structure du JSON attendu en entrée (body)
- La structure du JSON renvoyé en sortie (response)

---

## 7. API Key

**Définition**
Une clé d'authentification qui identifie l'application ou l'utilisateur faisant l'appel, permettant à l'API de savoir qui fait la requête et d'appliquer des droits/quotas.

**Façons courantes de transmettre une clé API**
- Dans un header : `Authorization: Bearer <clé>` ou `x-api-key: <clé>`
- Dans l'URL en query param : `?api_key=<clé>` (moins sécurisé, à éviter si possible)

**Bonne pratique n8n**
Ne jamais coller une clé API en dur dans l'URL ou un champ texte du node. Utiliser un **Credential** dédié (type "Header Auth" ou spécifique au service) - lien direct avec la notion de Credentials vue en Séance 1.

---

## 8. HTTP Request node (approfondissement)

**Rappel de la Séance 1**
Node générique permettant d'appeler n'importe quelle API.

**Options avancées à explorer cette séance**
- **Authentication** : None, Generic Credential Type (Header/Basic/OAuth2), ou credential spécifique
- **Query Parameters** : paramètres ajoutés automatiquement à l'URL
- **Body Content Type** : JSON, Form-Data, Form-Urlencoded, Raw
- **Options → Response Format** : JSON (par défaut), texte brut, fichier
- **Retry on Fail** : utile pour les APIs instables
- **Pagination** : pour les APIs qui renvoient les résultats par pages

**Méthodologie recommandée pour tout nouvel appel API**
1. Lire la documentation officielle de l'API
2. Identifier : méthode, URL, headers requis, body requis, authentification
3. Tester d'abord hors n8n (navigateur pour un GET simple, ou Postman/curl) si possible
4. Reproduire exactement la même configuration dans le HTTP Request node

---

## 9. Webhooks (approfondissement)

**Rappel de la Séance 2**
Un webhook reçoit une requête HTTP entrante pour déclencher un workflow.

**Différence fondamentale avec HTTP Request**
- **HTTP Request** : n8n appelle un service externe (n8n est client)
- **Webhook** : un service externe appelle n8n (n8n est serveur)

**Cas d'usage type par branche**
Beaucoup de services (WhatsApp Business API, Stripe, Telegram, Google Forms via add-on) fonctionnent par webhooks : ils préviennent n8n en temps réel dès qu'un événement se produit, au lieu que n8n doive vérifier en boucle (polling).

**Sécuriser un webhook**
- Vérifier une signature ou un token envoyé par le service source (souvent dans les headers)
- Restreindre le path à quelque chose de non devinable
- Ajouter un node IF juste après le webhook pour valider les données avant de continuer

---

## 10. Tester une API

**Outils possibles**
- Navigateur : suffit pour un simple GET sans authentification
- **Postman** ou **Insomnia** : interface dédiée pour construire et sauvegarder des requêtes
- **curl** en ligne de commande
- Directement dans n8n via le HTTP Request node et "Execute step"

**Démarche recommandée**
Toujours tester une requête en dehors de n8n avant de l'intégrer, pour isoler les problèmes : si ça ne marche pas dans Postman, ce n'est pas un problème n8n mais un problème de configuration de la requête elle-même.

---

## 11. Lire une réponse API

**Éléments à observer dans une réponse**
- **Status code** : `200` (succès), `201` (créé), `400` (mauvaise requête), `401`/`403` (authentification/droits), `404` (introuvable), `500` (erreur serveur)
- **Headers de réponse** : parfois utiles (ex. informations de pagination, rate limit restant)
- **Body de réponse** : les données JSON réellement utiles pour la suite du workflow

**Dans n8n**
Le panneau "Output" du HTTP Request node affiche le JSON complet de la réponse ; l'onglet dédié permet de voir le status code et les headers de réponse.

**Diagnostic rapide**
Si une réponse retourne un `status: 401`, la cause est une authentification absente ou invalide : vérifiez le token, la clé API ou les credentials configurés.

---

## Récapitulatif de fin de séance

- Une API REST expose des ressources manipulées via des méthodes HTTP (GET, POST, PUT, DELETE)
- Headers et Body transportent respectivement les métadonnées et les données de la requête
- Une API Key doit toujours passer par un Credential n8n, jamais en dur
- HTTP Request node = n8n appelle l'extérieur ; Webhook = l'extérieur appelle n8n
- Toujours tester une requête hors n8n avant de l'intégrer
- Le status code est le premier réflexe de diagnostic en cas d'échec

**Pour aller plus loin**
Vous pouvez créer un compte Google Cloud Console (pour les APIs Gmail / Google Sheets) ou configurer un Bot Telegram avec BotFather pour vous préparer aux automatisations multi-services.

---

<script setup>
import { seance3Quiz } from "../.vitepress/theme/data/n8n-quizzes.js"
</script>

<Quiz
  title="Quiz de validation - Séance 3 : APIs et Webhooks"
  :count="20"
  :questions="seance3Quiz"
/>
