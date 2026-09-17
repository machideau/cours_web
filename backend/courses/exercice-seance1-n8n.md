---
title: "Exercice pratique - Séance 1 : Mon premier workflow n8n"
description: "Construire un workflow complet allant d'un déclenchement manuel jusqu'à l'appel d'une API externe."
category: "n8n"
difficulty: "Débutant"
duration: "30 min"
order: 2
---

# Exercice pratique - Séance 1 : Mon premier workflow n8n

**Durée estimée :** 30 min
**Objectif :** construire un workflow complet allant d'un déclenchement manuel jusqu'à l'appel d'une API externe, et savoir lire les données JSON à chaque étape.

**Prérequis**
- Un compte n8n (cloud ou instance déjà installée)
- Connexion internet (l'exercice appelle une API météo publique et gratuite, sans clé requise)

---

## 1. Créer le workflow

1. Aller dans **Workflows** → **Add workflow**
2. Renommer le workflow : `Exercice - Meteo Ville`
3. Sauvegarder (Ctrl+S / Cmd+S)

---

## 2. Ajouter le déclencheur

1. Cliquer sur le bouton **+** au centre du canvas
2. Chercher **Manual Trigger** et l'ajouter
3. Ce node représente le point de départ : on lancera le workflow à la main pour ce premier essai

**Vérification** : le node "When clicking 'Execute Workflow'" apparaît sur le canvas.

---

## 3. Définir la ville (node Set / Edit Fields)

1. Cliquer sur le **+** à droite du Manual Trigger
2. Chercher **Edit Fields (Set)** et l'ajouter
3. Dans le node, ajouter un champ :
   - Nom du champ : `ville`
   - Valeur : `Lome` (sans accent, pour éviter les problèmes d'encodage dans l'URL)
4. Ajouter un second champ :
   - Nom du champ : `pays`
   - Valeur : `Togo`
5. Cliquer sur **Execute step** pour tester ce node isolément

**Vérification** : dans le panneau de sortie (à droite), vous devez voir :
```json
{
  "ville": "Lome",
  "pays": "Togo"
}
```

**Question à poser aux participants** : "Où est passée la donnée créée par le Manual Trigger ?" (Réponse : le Manual Trigger ne produit pas de données utiles, seul le Set node en génère ici — bonne occasion de clarifier que chaque node transforme ou enrichit les données reçues.)

---

## 4. Appeler une API météo (node HTTP Request)

1. Ajouter un node **HTTP Request** après le Set
2. Configurer :
   - Method : `GET`
   - URL : `https://wttr.in/{{ $json.ville }}?format=j1`
3. Cliquer sur **Execute step**

**Vérification** : le panneau de sortie renvoie un gros JSON avec plusieurs sections, notamment `current_condition`.

**Point pédagogique clé**
Montrer aux participants comment l'expression `{{ $json.ville }}` va chercher la valeur produite par le node précédent (le Set) et l'insère directement dans l'URL. C'est le mécanisme central de n8n : chaque node peut réutiliser les données de n'importe quel node précédent dans la chaîne.

---

## 5. Extraire uniquement la température (second node Set)

1. Ajouter un nouveau node **Edit Fields (Set)** après le HTTP Request
2. Créer un champ :
   - Nom : `temperature`
   - Valeur : `{{ $json.current_condition[0].temp_C }}`
3. Créer un second champ :
   - Nom : `ville_resultat`
   - Valeur : `{{ $('Edit Fields').item.json.ville }}`
   (ceci montre comment aller chercher une donnée d'un node plus ancien que le node juste précédent)
4. Exécuter le node

**Vérification** : la sortie doit afficher un objet simple, par exemple :
```json
{
  "temperature": "27",
  "ville_resultat": "Lome"
}
```

---

## 6. Exécuter le workflow complet

1. Cliquer sur **Execute Workflow** en haut du canvas
2. Observer l'exécution se propager node par node (chaque node se colore en vert)
3. Ouvrir l'onglet **Executions** dans le menu latéral et retrouver cette exécution dans l'historique

**Vérification finale** : le dernier node affiche la température actuelle de la ville choisie.

---

## Variante / défi bonus (si le temps le permet)

Demander aux participants plus rapides de :
- Changer la ville dans le node Set de l'étape 2 et relancer le workflow, pour voir le résultat changer
- Ajouter un node **IF** après l'étape 4 : si la température dépasse 30°C, créer une branche qui ajoute un champ `alerte = "Il fait chaud"`

---

## Erreurs fréquentes à anticiper (pour l'animateur)

| Symptôme | Cause probable |
|---|---|
| Le node HTTP Request renvoie une erreur | Faute de frappe dans l'URL ou dans `{{ $json.ville }}` |
| Le champ `temperature` est vide | Mauvais chemin JSON — vérifier la structure réelle renvoyée par l'API dans l'onglet JSON du node précédent |
| "undefined" affiché quelque part | Référence à un champ qui n'existe pas encore à ce niveau du workflow |
| Le workflow ne s'exécute pas | Un node est mal connecté (vérifier les flèches entre les nodes) |

**Conseil d'animation** : à chaque erreur rencontrée par un participant, la faire résoudre collectivement en projetant l'exécution en erreur et en lisant ensemble le message et le JSON — c'est la meilleure façon d'ancrer le réflexe de débogage.

---

## Ce que les participants doivent retenir en sortant de cet exercice

- Un workflow se construit et se teste node par node
- Les données produites par un node sont toujours accessibles aux nodes suivants via des expressions `{{ }}`
- Lire un JSON pour y trouver la bonne valeur est une compétence qui se muscle avec la pratique
- L'onglet Executions est le meilleur ami pour comprendre ce qui s'est réellement passé
