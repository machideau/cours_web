---
title: "Exercice pratique - Séance 4 : Pipeline d'inscription multi-outils"
description: "Construire un workflow complet combinant Google Sheets, Gmail et Telegram."
category: "n8n"
difficulty: "Intermédiaire"
duration: "1h à 1h15"
order: 6
---

# Exercice pratique - Séance 4 : Pipeline d'inscription multi-outils

**Durée estimée :** 1h à 1h15 (exercice le plus long jusqu'ici, car il combine plusieurs credentials)
**Objectif :** construire un workflow complet combinant Google Sheets, Gmail et Telegram, en réutilisant IF et expressions déjà vus en séances 2 et 3.

**Scénario**
Une personne s'inscrit à un événement via un formulaire simulé (on utilisera un Webhook pour simuler la soumission, afin de ne pas dépendre de la configuration Google Forms pendant l'exercice). On veut :
- enregistrer l'inscription dans Google Sheets
- envoyer un email de confirmation au participant
- notifier l'équipe sur Telegram si le nombre de participants dépasse un seuil (simulation d'alerte de capacité)

---

## Étape 0 - Préparer les credentials

Avant de commencer, vérifier que ces trois credentials existent dans n8n (créés en suivant la séance) :
1. **Google Sheets OAuth2 API**
2. **Gmail OAuth2**
3. **Telegram API**

Si l'un manque, le créer maintenant en se référant à la séance avant de continuer.

---

## Étape 1 - Préparer la feuille Google Sheets

1. Créer une nouvelle Google Sheet nommée `Inscriptions Evenement`
2. Première ligne (en-têtes), exactement : `nom`, `email`, `date_inscription`, `total_inscrits`
3. Garder l'onglet ouvert, on en aura besoin pour récupérer son ID ou le sélectionner depuis n8n

---

## Étape 2 - Créer le workflow

1. **Workflows** → **Add workflow**
2. Renommer : `Exercice - Pipeline Inscription`

---

## Étape 3 - Simuler la soumission du formulaire (Webhook)

1. Ajouter un node **Webhook**
   - Method : `POST`
   - Path : `inscription`
   - Respond : `Using Respond to Webhook Node`
2. Cliquer sur **Listen for test event**, copier l'URL de test

3. Envoyer cette requête de test (via Postman, curl, ou extension navigateur) :
```json
{
  "nom": "Ama Koffi",
  "email": "ama.koffi@example.com"
}
```

**Vérification** : le node Webhook reçoit la requête, les données sont visibles sous `$json.body`.

---

## Étape 4 - Enregistrer dans Google Sheets (Append Row)

1. Ajouter un node **Google Sheets** après le Webhook
2. Credential : sélectionner celui créé en séance
3. Resource : `Sheet within Document`, Operation : `Append Row`
4. Document : sélectionner `Inscriptions Evenement`
5. Sheet : l'onglet par défaut (souvent `Feuille 1` ou `Sheet1`)
6. Mapper les colonnes :
   - `nom` = <code v-pre>{{ $json.body.nom }}</code>
   - `email` = <code v-pre>{{ $json.body.email }}</code>
   - `date_inscription` = <code v-pre>{{ $now.format('yyyy-MM-dd HH:mm') }}</code>
   - `total_inscrits` : laisser vide pour l'instant (rempli à l'étape suivante)
7. Exécuter le node

**Vérification** : une nouvelle ligne apparaît dans la Google Sheet avec les bonnes valeurs.

---

## Étape 5 - Compter le nombre total d'inscrits (Google Sheets - Get Rows)

1. Ajouter un node **Google Sheets** après le précédent
2. Operation : `Get Row(s)`
3. Document et Sheet : les mêmes que précédemment
4. Exécuter le node

**Vérification** : le node renvoie un item par ligne existante dans la feuille (donc autant d'items que d'inscrits).

5. Ajouter un node **Aggregate** juste après :
   - Mode : "Aggregate All Item Data" ou utiliser "Code" simplifié si disponible, sinon utiliser un node **Summarize** avec "Count" sur une colonne (ex. `nom`)

**Vérification** : le résultat final doit donner un seul champ numérique, le nombre total d'inscrits (ex. `count = 6`).

---

## Étape 6 - Envoyer l'email de confirmation (Gmail)

Pour accéder aux données d'origine du webhook (nom, email) après être passé par Get Rows/Aggregate, on utilise l'expression `$('Webhook').item.json.body...` vue en séance 2.

1. Ajouter un node **Gmail**
2. Operation : `Send Email`
3. To : <code v-pre>{{ $('Webhook').item.json.body.email }}</code>
4. Subject : `Confirmation de votre inscription`
5. Message :
```
Bonjour {{ $('Webhook').item.json.body.nom }},

Votre inscription a bien ete enregistree.
Vous etes actuellement le/la {{ $json.count }}eme inscrit(e).

A bientot !
```
6. Exécuter le node

**Vérification** : un email part réellement vers l'adresse testée (utiliser une adresse réelle accessible pendant l'exercice).

---

## Étape 7 - Alerter l'équipe si le seuil est dépassé (IF + Telegram)

1. Ajouter un node **IF** après l'Aggregate (en parallèle de l'étape 6, pas après)
   - Condition : <code v-pre>{{ $json.count }}</code> **supérieur ou égal à** `5`
2. Sur la branche **True**, ajouter un node **Telegram**
   - Operation : `Send Message`
   - Chat ID : celui du groupe/canal de test
   - Text : <code v-pre>`Attention : {{ $json.count }} inscrits a l'evenement, seuil de capacite atteint`</code>
3. La branche **False** ne fait rien (laisser sans suite, ou ajouter un **NoOp** pour la clarté visuelle)

---

## Étape 8 - Répondre au Webhook

1. Après le Gmail (et indépendamment de la branche IF), ajouter un node **Respond to Webhook**
2. Response Body (JSON) :
```json
{
  "status": "ok",
  "message": "Inscription confirmee"
}
```

---

## Étape 9 - Exécuter le workflow complet

1. Activer **Listen for test event** sur le Webhook
2. Renvoyer la requête de test de l'étape 3 avec un nouveau nom (ex. `"nom": "Kossi Mensah"`)
3. Observer dans l'onglet **Executions** : chaque node s'exécute dans l'ordre, les deux branches (Gmail et IF→Telegram) se déroulent en parallèle après l'Aggregate

**Vérification finale**
- Nouvelle ligne dans Google Sheets
- Email reçu avec le bon rang d'inscription
- Message Telegram envoyé uniquement si le seuil de 5 est atteint ou dépassé

---

## Variante / défi bonus

- Remplacer le seuil fixe (5) par une variable d'environnement n8n, pour pouvoir l'ajuster sans modifier le workflow
- Ajouter une vérification IF supplémentaire juste après le Webhook : si `email` est vide ou mal formé (regex simple), répondre directement avec une erreur 400 sans aller jusqu'à Google Sheets

---

## Erreurs fréquentes à anticiper

| Symptôme | Cause probable |
|---|---|
| "Spreadsheet not found" | Document non sélectionné correctement, ou credential Google Sheets lié à un autre compte que celui propriétaire de la feuille |
| Le compteur `total_inscrits` ne correspond pas au nombre réel de lignes | Le node Get Rows a été placé avant l'Append Row au lieu d'après - vérifier l'ordre des nodes |
| Gmail renvoie une erreur d'autorisation | Scope `gmail.send` non accordé lors de la création du credential - recréer le credential en vérifiant les cases cochées |
| Le Telegram ne part jamais | Le seuil du IF n'est jamais atteint pendant le test (normal si peu de lignes dans la feuille) - abaisser temporairement le seuil à 1 pour tester |
| <code v-pre>{{ $('Webhook').item.json.body.nom }}</code> renvoie une erreur | Nom du node Webhook renommé ou différent de "Webhook" - toujours vérifier le nom exact affiché sur le node |

---


---
## Quiz de validation

Testez vos connaissances sur cette séance !

<script setup>
import { seance4Quiz } from '../.vitepress/theme/data/n8n-quizzes.js'
</script>

<Quiz title="Quiz de validation - Séance 4 : Automatiser les outils du quotidien" :questions="seance4Quiz" />
