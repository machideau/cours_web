---
title: "Séance 2 : Les fondamentaux des workflows"
description: "Maîtriser les triggers, les expressions, le mapping des données et la logique conditionnelle dans n8n."
category: "n8n"
difficulty: "Débutant"
duration: "2h30"
order: 3
---

# Séance 2 : Les fondamentaux des workflows

**Objectif :** maîtriser les différents types de triggers, savoir manipuler et router les données, et construire des workflows avec de la logique conditionnelle.
**Durée estimée :** 2h à 2h30
**Prérequis :** avoir suivi la Séance 1 (notions de node, JSON, workflow)

---

## 1. Rappel rapide (5-10 min)

- Un workflow = trigger + suite de nodes connectés
- Les données circulent en JSON, sous forme d'items
- On récupère une donnée avec une expression <code v-pre>{{ $json.champ }}</code>

---

## 2. Trigger manuel (rappel + limites)

**Rappel**
Le Manual Trigger sert uniquement à tester en développement. Il ne peut pas être utilisé pour un workflow actif en production, puisqu'il exige un clic humain.

**Quand l'utiliser**
- Phase de construction et de test d'un workflow
- Débogage étape par étape

---

## 3. Schedule Trigger

**Définition**
Déclenche le workflow à intervalle régulier ou à une heure précise, sans intervention humaine.

**Configuration principale**
- Mode "Interval" : toutes les X minutes/heures
- Mode "Cron" : expression cron pour un contrôle précis (ex. tous les lundis à 8h)
- Fuseau horaire à vérifier (important si l'équipe/les utilisateurs sont au Togo)

**Cas d'usage typiques**
- Rapport hebdomadaire automatique
- Vérification périodique d'un stock
- Nettoyage ou synchronisation de données à heure fixe

**Point de vigilance**
Un workflow avec Schedule Trigger doit être **activé** (toggle en haut à droite) pour tourner réellement en arrière-plan.

---

## 4. Webhook

**Définition**
Déclenche le workflow dès qu'une requête HTTP arrive sur une URL unique générée par n8n. C'est le pont entre un service externe et n8n.

**Fonctionnement**
- n8n génère une URL de test et une URL de production
- L'URL de test ne fonctionne que pendant que le workflow est ouvert et qu'on clique sur "Listen for test event"
- L'URL de production fonctionne en continu une fois le workflow activé

**Configuration**
- Méthode HTTP attendue (GET, POST...)
- Chemin (path) personnalisable
- Réponse renvoyée (Respond immediately, ou via un node "Respond to Webhook")

**Cas d'usage typiques**
- Recevoir un message WhatsApp entrant
- Recevoir la soumission d'un formulaire externe
- Recevoir une notification d'un service tiers (Stripe, GitHub, etc.)

**Démo suggérée**
Créer un webhook, copier l'URL de test, envoyer une requête depuis le navigateur ou un outil comme Postman/curl, montrer les données reçues dans n8n.

---

## 5. Expressions

**Définition**
Une expression est un bout de code entre <code v-pre>{{ ... }}</code> qui permet de calculer, transformer ou aller chercher une valeur dynamiquement, au lieu d'écrire une valeur fixe.

**Syntaxe de base**
- Valeur simple : <code v-pre>{{ $json.nom }}</code>
- Concaténation : <code v-pre>{{ $json.prenom + " " + $json.nom }}</code>
- Donnée d'un node précédent (pas forcément le dernier) : <code v-pre>{{ $('Nom du node').item.json.champ }}</code>
- Fonctions intégrées : <code v-pre>{{ $now }}</code>, <code v-pre>{{ $json.texte.toUpperCase() }}</code>, <code v-pre>{{ $json.prix * 1.18 }}</code>

**Astuce pratique**
Le petit bouton "Expression" (icône engrenage/fx) à côté de chaque champ ouvre un éditeur avec aperçu en direct du résultat - toujours l'utiliser pour vérifier avant de valider.

---

## 6. Variables

**Types de variables dans n8n**
- `$json` : les données de l'item en cours de traitement
- `$node` / `$('Nom du node')` : accès aux données d'un node spécifique, même ancien dans la chaîne
- `$workflow` : infos sur le workflow lui-même (id, nom)
- `$now` / `$today` : date et heure actuelles
- Variables d'environnement (si configurées côté instance) : constantes réutilisables (ex. une URL de base)

**Différence variable vs expression**
La variable est la donnée elle-même ; l'expression est la syntaxe utilisée pour l'appeler ou la transformer.

---

## 7. JSON (approfondissement)

**Rappel de la Séance 1**
Structure clé/valeur, items en tableau.

**Cette séance : structures imbriquées**
```json
{
  "client": {
    "nom": "Awa",
    "contact": {
      "email": "awa@example.com",
      "telephone": "+228..."
    }
  },
  "produits": ["riz", "huile", "savon"]
}
```
- Accéder à une valeur imbriquée : <code v-pre>{{ $json.client.contact.email }}</code>
- Accéder à un élément de tableau : <code v-pre>{{ $json.produits[0] }}</code>

**Erreur fréquente**
Confondre un objet `{}` et un tableau `[]` - un tableau se parcourt par index, un objet par nom de clé.

---

## 8. Mapping des données

**Définition**
Le mapping consiste à relier une donnée produite par un node à un champ attendu par le node suivant.

**Méthodes disponibles dans n8n**
- **Glisser-déposer** : depuis le panneau "Input" vers le champ cible, n8n génère l'expression automatiquement
- **Saisie manuelle** de l'expression
- **Mode "Fixed" vs "Expression"** sur chaque champ d'un node

**Bonne pratique**
Toujours vérifier l'onglet "Output" du node source pour connaître le nom exact des champs avant de les référencer, plutôt que de deviner.

---

## 9. IF

**Définition**
Node de branchement conditionnel simple : sépare les items en deux sorties, "True" et "False", selon une ou plusieurs conditions.

**Configuration**
- Choisir le champ à tester (ex. <code v-pre>{{ $json.temperature }}</code>)
- Choisir l'opérateur (supérieur à, égal à, contient, est vide, etc.)
- Combiner plusieurs conditions avec AND / OR

**Cas d'usage typique**
Température > 30 → branche "True" envoie une alerte ; sinon branche "False" continue normalement.

---

## 10. Switch

**Définition**
Version étendue du IF : permet de créer plusieurs branches (plus de deux) selon la valeur d'un champ.

**Cas d'usage typique**
Router un message WhatsApp selon son intention détectée : branche "image", branche "vidéo", branche "question", branche "autre" - exactement la logique utilisée dans un classificateur d'intention.

**Différence avec IF**
IF = 2 sorties maximum (vrai/faux). Switch = autant de sorties que de cas définis, plus une sortie "fallback" optionnelle.

---

## 11. Merge

**Définition**
Combine les données de deux branches (ou plus) en une seule sortie.

**Modes principaux**
- **Append** : met bout à bout les items des différentes branches
- **Combine (Merge by field / by position)** : fusionne des items ayant un champ commun (ex. un ID client) ou à la même position
- **Choose Branch** : garde uniquement les données d'une des branches selon une condition

**Cas d'usage typique**
Récupérer des infos client depuis Google Sheets d'un côté, et le contenu de sa commande d'un autre côté, puis les fusionner par ID avant d'envoyer un email récapitulatif.

---

## 12. Loop (Split in Batches)

**Définition**
Permet de traiter les items un par un ou par petits groupes (batches), au lieu de tous les traiter en une seule fois.

**Pourquoi c'est nécessaire**
- Certaines APIs limitent le nombre de requêtes simultanées (rate limit)
- Certains traitements doivent respecter un ordre strict
- Besoin d'ajouter une pause (Wait node) entre chaque item

**Fonctionnement**
- Le node "Loop Over Items (Split in Batches)" a deux sorties : "done" (quand tout est traité) et "loop" (le lot en cours)
- On reconnecte la sortie "loop" vers le traitement, qui revient ensuite vers le Loop node pour continuer

**Cas d'usage typique**
Envoyer un email personnalisé à chaque client d'une liste de 200 contacts, un par un, avec une petite pause entre chaque envoi.

---

## 13. Manipulation des données

**Nodes utiles à connaître**
- **Filter** : ne garde que les items respectant une condition
- **Sort** : trie les items selon un champ
- **Remove Duplicates** : élimine les doublons
- **Split Out** : transforme un tableau en plusieurs items distincts
- **Aggregate** : regroupe plusieurs items en un seul tableau
- **Rename Keys / Edit Fields** : renomme ou restructure les champs

**Exemple d'application**
Pour filtrer une liste de commandes et ne conserver que celles dont le montant est supérieur à 5 000 FCFA, le node dédié est le node **Filter** (condition : <code v-pre>{{ $json.montant }} > 5000</code>).

---

## Récapitulatif de fin de séance

- Trois façons de déclencher un workflow : manuel (test), Schedule (temporel), Webhook (événementiel externe)
- Les expressions <code v-pre>{{ ... }}</code> permettent d'aller chercher n'importe quelle donnée, même d'un node ancien
- IF pour un choix binaire, Switch pour plusieurs branches
- Merge pour recombiner des données séparées
- Loop pour traiter les items un par un, notamment face aux limites d'API
- Une bonne maîtrise du JSON imbriqué et du mapping évite 80% des erreurs de configuration

**Pour aller plus loin**
Identifiez, dans un service ou outil que vous utilisez régulièrement (passerelle de paiement, réseau social, SaaS, météo), si une API publique existe et comment sa documentation est structurée.

---

<script setup>
import { seance2Quiz } from "../.vitepress/theme/data/n8n-quizzes.js"
</script>

<Quiz
  title="Quiz de validation - Séance 2 : Fondamentaux des workflows"
  :count="20"
  :questions="seance2Quiz"
/>
