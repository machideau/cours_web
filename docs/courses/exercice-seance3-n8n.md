---
title: "Exercice pratique - Séance 3 : APIs et Webhooks"
description: "Pratiquer GET/POST, headers, body, lecture de status code, et construire un webhook qui répond."
category: "n8n"
difficulty: "Intermédiaire"
duration: "40 à 50 min"
order: 5
---

# Exercice pratique - Séance 3 : APIs et Webhooks

**Durée estimée :** 40 à 50 min
**Objectif :** pratiquer GET/POST, headers, body, lecture de status code, et construire un webhook qui répond.

---

## Partie A - Appeler une API REST (GET et POST)

On utilise **reqres.in**, une API de test publique et gratuite, sans clé requise, qui simule un vrai comportement REST (création, lecture, codes de statut réalistes).

### A1 - GET : lire une ressource

1. Nouveau workflow : `Exercice - API Reqres`
2. **Manual Trigger**
3. Ajouter un **HTTP Request** :
   - Method : `GET`
   - URL : `https://reqres.in/api/users/2`
4. Exécuter le node

**Vérification** : la réponse contient un objet `data` avec `id`, `email`, `first_name`, `last_name`. Status code attendu : `200`.

**À observer** : ouvrir l'onglet qui affiche le status code et les headers de réponse, pas seulement le body.

---

### A2 - POST : créer une ressource avec body et headers

1. Ajouter un second **HTTP Request** (node séparé, pas connecté au premier pour l'instant)
2. Configurer :
   - Method : `POST`
   - URL : `https://reqres.in/api/users`
   - Dans **Headers** : ajouter `Content-Type` = `application/json`
   - Activer **Send Body**, type JSON :
```json
{
  "name": "Awa",
  "job": "Formatrice n8n"
}
```
3. Exécuter le node

**Vérification** : la réponse renvoie un `id`, le `name`, le `job`, et un `createdAt`. Status code attendu : `201` (créé).

**À noter** : Le status code `201 Created` confirme spécifiquement qu'une nouvelle ressource a été créée sur le serveur, contrairement à un simple `200 OK`.

---

### A3 - Tester hors n8n (si le temps le permet)

Reproduire la requête POST de l'étape A2 dans Postman ou avec curl, pour comparer le résultat et confirmer la méthodologie "tester hors n8n avant d'intégrer" vue en cours.

```bash
curl -X POST https://reqres.in/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Awa", "job": "Formatrice n8n"}'
```

---

## Partie B - Construire un webhook qui répond

**Scénario** : un client envoie une commande via webhook, n8n vérifie si la commande est valide (montant renseigné et positif), puis renvoie une confirmation ou une erreur.

### B1 - Créer le webhook

1. Nouveau workflow : `Exercice - Webhook Commande`
2. Ajouter un node **Webhook** :
   - Method : `POST`
   - Path : `commande-test`
   - Respond : `Using Respond to Webhook Node`
3. Cliquer sur **Listen for test event**, copier l'URL de test affichée

### B2 - Envoyer une requête de test

Depuis Postman, curl, ou un navigateur avec extension REST client, envoyer :
```json
{
  "client": "Kofi",
  "montant": 4500
}
```
vers l'URL de test copiée, en méthode POST.

**Vérification** : le webhook reçoit la requête et le workflow se met en pause, prêt à continuer.

### B3 - Valider la commande (IF)

1. Ajouter un node **IF** après le Webhook
2. Condition : <code v-pre>{{ $json.body.montant }}</code> **supérieur à** `0`

::: tip Remarque importante
Les données envoyées dans le body d'un webhook se trouvent sous `$json.body`, pas directement sous `$json` - point à souligner explicitement.
:::

### B4 - Répondre selon le résultat

1. Sur la branche **True**, ajouter un node **Respond to Webhook** :
   - Response Body (JSON) :
```json
{
  "status": "ok",
  "message": "Commande recue pour [client]"
}
```
*(Dans n8n, remplacer `[client]` par l'expression* <code v-pre>{{ $json.body.client }}</code> *dans le champ du node.)*

2. Sur la branche **False**, ajouter un second node **Respond to Webhook** :
   - Response Code : `400`
   - Response Body (JSON) :
```json
{
  "status": "erreur",
  "message": "Montant invalide"
}
```

### B5 - Tester les deux cas

1. Renvoyer la requête de test B2 (montant positif) → vérifier la réponse `status: ok`
2. Renvoyer une requête avec `"montant": -100` ou sans le champ `montant` → vérifier la réponse `status: erreur` avec code `400`

---

## Erreurs fréquentes à anticiper

| Symptôme | Cause probable |
|---|---|
| POST renvoie une erreur côté n8n | "Send Body" non activé, ou mauvais Content-Type |
| Le webhook ne reçoit rien | URL de test expirée (il faut recliquer sur "Listen for test event" à chaque nouveau test) |
| <code v-pre>{{ $json.montant }}</code> ne fonctionne pas dans le IF après le Webhook | Oubli du `.body` - les données d'un webhook POST sont dans <code v-pre>{{ $json.body.montant }}</code> |
| Respond to Webhook ne renvoie rien | Le mode de réponse du Webhook node n'est pas réglé sur "Using Respond to Webhook Node" |

---

## Points clés à retenir

- GET pour lire, POST pour créer - toujours vérifier le status code renvoyé
- Une clé API ou un header d'authentification ne doit jamais être codé en dur en production
- Les données reçues par un webhook POST sont imbriquées sous `body`
- Respond to Webhook permet de renvoyer une réponse différente selon la logique du workflow, exactement comme une vraie API
