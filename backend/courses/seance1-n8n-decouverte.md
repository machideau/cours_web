---
title: "Séance 1 : Découvrir n8n"
description: "Comprendre comment fonctionne n8n et construire son premier workflow."
category: "n8n"
difficulty: "Débutant"
duration: "1h"
order: 1
---

# Séance 1 : Découvrir n8n

**Objectif :** comprendre comment fonctionne n8n et construire son premier workflow.
**Durée estimée :** 1h
**Prérequis :** aucun, notions de base en informatique suffisantes

---

## 1. Qu'est-ce que l'automatisation ?

**Définition**
L'automatisation consiste à faire exécuter par un système informatique une tâche qui serait normalement réalisée manuellement, de façon répétée et sans intervention humaine directe une fois configurée.

**Principe de base**
Une automatisation suit toujours la même logique :
`Déclencheur (quand ?) → Traitement (quoi faire ?) → Résultat (où ça va ?)`

**Exemples concrets**
- Un client remplit un formulaire → un email de confirmation part automatiquement
- Une commande est passée → le stock est mis à jour et l'équipe est notifiée sur Slack/WhatsApp
- Chaque lundi à 8h → un rapport de ventes est généré et envoyé par email
- Un nouveau message WhatsApp arrive → une réponse générée par IA est envoyée

**Ce qui est automatisable VS non automatisable**
- Automatisable : tâches répétitives, à règles claires, déclenchées par un événement identifiable
- Difficilement automatisable : tâches nécessitant un jugement humain complexe et non standardisable (mais l'IA réduit cette limite)

---

## 2. Pourquoi automatiser une tâche ?

**Bénéfices**
- **Gain de temps** : une tâche de 10 min répétée 20 fois/semaine = plusieurs heures récupérées
- **Réduction des erreurs** : un système ne saute pas d'étape, n'oublie pas
- **Scalabilité** : traiter 10 ou 10 000 demandes ne change rien pour le workflow
- **Disponibilité 24/7** : un workflow fonctionne même la nuit ou le week-end
- **Traçabilité** : chaque exécution est loggée, on peut voir ce qui s'est passé

**Quand ne pas automatiser**
- Tâche faite une seule fois
- Processus encore instable ou en cours de définition
- Décision nécessitant un vrai jugement humain à chaque fois

**Question à poser avant d'automatiser**
"Est-ce que je referais exactement la même chose la prochaine fois ?" Si oui → bon candidat à l'automatisation.

---

## 3. n8n vs Zapier / Make

| Critère | n8n | Zapier | Make |
|---|---|---|---|
| Modèle | Open-source, self-hostable ou cloud | Propriétaire, cloud uniquement | Propriétaire, cloud uniquement |
| Coût | Gratuit en self-hosted, cloud payant | Cher au-delà de quelques centaines d'exécutions | Intermédiaire |
| Flexibilité | Code JS/Python intégré, logique complexe | Limité, orienté no-code strict | Assez flexible, moins que n8n |
| Visibilité des données | JSON visible à chaque étape | Abstrait, moins transparent | Assez visible |
| Communauté / nodes | Très large, nodes communautaires | Large mais fermé | Large |
| Courbe d'apprentissage | Un peu plus technique | Très accessible débutant | Accessible |

**Pourquoi choisir n8n**
- Contrôle total sur ses données (surtout en self-hosted, pertinent pour la confidentialité)
- Pas de coût qui explose avec le volume d'exécutions en self-hosted
- Capacité à écrire du code personnalisé (Function node) quand le no-code ne suffit plus
- Idéal pour des automatisations avancées incluant de l'IA (agents, LLM, MCP)

**Limite honnête** : 
n8n demande un peu plus de rigueur technique au démarrage que Zapier. C'est un compromis flexibilité contre simplicité immédiate.

---

## 4. Présentation de l'interface

**Zones principales de l'éditeur**
- **Canvas** (zone centrale) : espace de travail où on place et connecte les nodes
- **Panneau de nodes** : bibliothèque de tous les nodes disponibles, accessible via le bouton "+"
- **Barre supérieure** : nom du workflow, bouton Save, bouton Execute Workflow, toggle Active/Inactive
- **Menu latéral gauche** : Workflows, Credentials, Executions, Settings, Templates

**Vues importantes**
- **Workflows** : liste de tous les workflows créés, actifs ou non
- **Credentials** : gestion centralisée des connexions authentifiées (API keys, OAuth, etc.)
- **Executions** : historique de chaque exécution, avec statut (succès, erreur, en cours) et données à chaque étape
- **Settings** : paramètres du compte/instance

**Démo live suggérée**
Ouvrir un workflow existant simple et montrer : cliquer sur un node, voir l'input/output, relancer une exécution, consulter l'historique.

---

## 5. Workflows

**Définition**
Un workflow est une suite de nodes connectés entre eux, représentant un processus automatisé complet, de son déclenchement à son résultat final.

**Caractéristiques**
- Un workflow doit contenir au moins un trigger
- Les nodes sont reliés par des connexions qui définissent le sens de circulation des données
- Un workflow peut être linéaire (une seule branche) ou ramifié (plusieurs branches conditionnelles)
- Un workflow peut être actif (tourne automatiquement) ou inactif (exécution manuelle uniquement)

**Bonnes pratiques dès le départ**
- Nommer clairement chaque workflow
- Ajouter des notes (sticky notes) pour expliquer la logique
- Tester avec Execute Workflow avant d'activer

---

## 6. Nodes

**Définition**
Un node est une brique représentant une action, une transformation ou un déclenchement. C'est l'unité de base de tout workflow.

**Catégories de nodes**
- **Trigger nodes** : démarrent le workflow (voir section 7)
- **Action nodes / App nodes** : interagissent avec un service externe (Gmail, Google Sheets, WhatsApp, etc.)
- **Nodes de transformation de données** : Set, Edit Fields, Merge, Filter, Split Out, Aggregate
- **Nodes logiques** : IF, Switch, pour créer des branches conditionnelles
- **Nodes de code** : Function/Code node, pour écrire du JavaScript ou Python directement

**Anatomie d'un node**
- Un panneau de paramètres à configurer (dépend du type de node)
- Un input (données reçues) et un output (données transmises)
- Un bouton "Execute step" pour tester ce node isolément

---

## 7. Triggers

**Définition**
Le trigger est le node qui déclenche l'exécution du workflow. Chaque workflow doit obligatoirement en avoir au moins un.

**Types principaux**
- **Manual Trigger** : déclenchement manuel en cliquant sur "Execute Workflow", idéal pour tester
- **Schedule Trigger** : déclenchement à intervalle régulier (toutes les heures, chaque jour à 8h, etc.)
- **Webhook Trigger** : déclenchement quand une requête HTTP arrive sur une URL générée par n8n (ex. formulaire externe, WhatsApp, Stripe)
- **App Triggers** : spécifiques à un service (nouveau mail Gmail, nouvelle ligne Google Sheets, nouveau message WhatsApp)

**Point clé**
Le choix du trigger dépend entièrement de la question : "Qu'est-ce qui doit déclencher cette automatisation ?"

---

## 8. Actions

**Définition**
Une action est une opération effectuée par un node une fois le workflow déclenché : lire, créer, modifier, envoyer, supprimer des données.

**Exemples d'actions courantes**
- Envoyer un email (Gmail, SMTP)
- Écrire une ligne dans Google Sheets
- Envoyer un message WhatsApp/Slack
- Appeler une API externe (HTTP Request node)
- Créer un enregistrement dans une base de données

**Distinction Trigger vs Action**
Dans n8n, beaucoup de nodes d'app proposent les deux : une opération Trigger (icône éclair) et des opérations Action classiques, à choisir selon l'usage dans le workflow.

---

## 9. Credentials

**Définition**
Les credentials sont les identifiants de connexion (API key, OAuth, login/mot de passe) permettant à n8n de communiquer avec un service externe de façon sécurisée.

**Fonctionnement**
- Créées une fois, réutilisables dans plusieurs nodes/workflows
- Stockées chiffrées
- Gérées depuis le menu "Credentials" ou directement depuis un node lors de sa configuration

**Bonnes pratiques**
- Ne jamais mettre une clé API en dur dans un node texte ou une note
- Utiliser des credentials à portée limitée (scopes minimaux nécessaires) quand le service le permet
- Nommer les credentials clairement (ex. "Gmail - compte formation" plutôt que "Gmail 1")

---

## 10. Exécutions (Executions)

**Définition**
Une exécution est une instance unique du déroulement d'un workflow, du trigger jusqu'au dernier node.

**Informations disponibles**
- Statut : succès, erreur, en cours, en attente
- Données exactes reçues et produites à chaque node
- Durée d'exécution
- Possibilité de relancer une exécution échouée

**Utilité pédagogique**
C'est l'outil principal de débogage : quand un workflow ne fonctionne pas comme prévu, on ouvre l'exécution concernée et on inspecte node par node où les données divergent de ce qui était attendu.

---

## 11. Comprendre les données JSON

**Pourquoi c'est central dans n8n**
Toutes les données qui circulent entre les nodes sont au format JSON (JavaScript Object Notation). Comprendre le JSON est la compétence n°1 pour progresser rapidement dans n8n.

**Structure de base**
```json
{
  "nom": "Awa",
  "age": 28,
  "ville": "Kara"
}
```
- Une paire clé/valeur : `"clé": valeur`
- Les valeurs peuvent être du texte, un nombre, un booléen, un objet, ou un tableau

**Notion d'"item"**
n8n manipule des tableaux d'objets appelés items :
```json
[
  { "nom": "Awa", "ville": "Kara" },
  { "nom": "Kofi", "ville": "Lomé" }
]
```
Chaque node reçoit et renvoie une liste d'items. Un workflow qui reçoit 5 items peut, selon le node, en produire 5, 1, ou davantage (avec Split ou Merge par exemple).

**Accéder à une donnée**
Dans un node, on référence une valeur avec une expression du type :
`{{ $json.nom }}`

**Exercice pratique proposé**
Montrer un JSON simple à l'écran, demander aux participants d'identifier les clés, les valeurs, et de dire à l'oral comment ils écriraient l'expression pour récupérer une valeur précise.

---

## 12. Premier workflow (exercice pratique)

**Objectif pédagogique** : voir concrètement les données circuler et se transformer entre nodes.

**Étapes**
1. Créer un nouveau workflow, le nommer "Mon premier workflow"
2. Ajouter un **Manual Trigger**
3. Ajouter un node **Set / Edit Fields** : créer deux champs, ex. `ville = "Kara"` et `pays = "Togo"`
4. Ajouter un node **HTTP Request** : appeler une API publique gratuite (ex. API météo) en utilisant la valeur `ville` créée à l'étape précédente
5. Exécuter le workflow (Execute Workflow) et observer :
   - Le JSON produit par le Set node
   - Le JSON de réponse renvoyé par l'API dans le HTTP Request
6. Ajouter un second node Set pour extraire uniquement les informations utiles de la réponse (ex. température)

**Points à souligner pendant l'exercice**
- Chaque node a un input et un output visibles et inspectables
- On peut cliquer sur "Execute step" node par node pour tester progressivement
- L'erreur la plus fréquente chez les débutants : mauvaise référence au champ JSON (faute de frappe dans `{{ $json.champ }}`)

**Pour aller plus loin (à mentionner en fin de séance sans développer)**
- Ajouter un node IF pour créer une branche conditionnelle selon la température
- Envoyer le résultat par email ou WhatsApp

---

## Récapitulatif de fin de séance

- Automatisation = déclencheur + traitement + résultat
- n8n = flexibilité et contrôle, contre un peu plus de technicité que Zapier/Make
- Un workflow est composé de nodes reliés entre eux, démarré par un trigger
- Les credentials sécurisent les connexions aux services externes
- Les executions permettent de suivre et déboguer chaque run
- Tout circule en JSON : c'est la compétence de base à maîtriser en priorité
