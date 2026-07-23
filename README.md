# 🎓 Cours Web — Plateforme de Cours en Ligne

Une plateforme légère et performante conçue pour publier et partager des cours sous format Markdown. Construite avec **Vue 3 (Vite)** pour l'interface utilisateur et **Node.js (Express)** pour le serveur de contenu.

## ✨ Fonctionnalités Principales

*   **Rendu Markdown Avancé** : Support complet du Markdown pour rédiger facilement des cours structurés.
*   **Coloration Syntaxique** : Mise en évidence automatique du code source (HTML, CSS, JS, etc.) via `highlight.js`.
*   **Recherche Intégrale (Full-Text)** : Barre de recherche performante pour trouver instantanément une notion dans le titre, la description ou **l'intégralité du texte** des cours.
*   **Encadrés Pédagogiques (Callouts)** : Des alertes stylisées pour attirer l'attention (`Note`, `Astuce`, `Attention`, `Important`).
*   **Sommaire Interactif (TOC)** : Un menu flottant généré automatiquement à partir des titres (`##`) pour une navigation rapide dans le cours.
*   **Ressources Téléchargeables** : Possibilité d'attacher des fichiers, exercices ou TP en téléchargement direct en haut du cours.
*   **Mode Sombre / Clair** : Thème personnalisable sauvegardé dans les préférences locales de l'utilisateur.
*   **Bouton de Copie de Code** : Un bouton intelligent apparaissant au survol pour copier les extraits de code en un clic.
*   **Optimisation pour l'Impression** : Masquage automatique de l'interface (navigation, boutons) pour imprimer le cours ou l'exporter proprement en PDF.

## 🏗️ Architecture du Projet

Le projet est divisé en trois dossiers principaux :

*   `/frontend` : L'application web cliente (Vue.js 3, Vue Router, Vite, Marked, Highlight.js).
*   `/backend` : L'API serveur (Node.js, Express) qui lit et distribue les fichiers Markdown.
*   `/courses` : Le dossier contenant tous vos cours au format `.md`.

## ✍️ Comment écrire un cours ?

Pour ajouter un nouveau cours, il suffit de créer un fichier `.md` dans le dossier `/courses/`. 
Le fichier doit commencer par un **Front-matter** (bloc YAML) contenant les métadonnées du cours.

**Exemple de structure d'un fichier cours (`mon-nouveau-cours.md`) :**

```markdown
---
title: "Mon Nouveau Cours"
description: "Une brève description de ce que l'on va apprendre."
category: "Général"
difficulty: "Débutant"
duration: "10 min"
order: 1
resources:
  - title: "Fichiers d'exercice"
    url: "/downloads/exo.zip"
---

Ici commence votre cours en Markdown normal.

## 1. Mon premier titre

Voici un exemple de code :

\`\`\`javascript
const message = "La coloration syntaxique est automatique !";
console.log(message);
\`\`\`

> [!TIP]
> Ceci est un encadré d'astuce qui sera formaté automatiquement en vert sur le site.
```

### Types d'encadrés disponibles :
*   `> [!NOTE]` (Bleu) - Pour des informations générales.
*   `> [!TIP]` (Vert) - Pour des astuces ou conseils.
*   `> [!WARNING]` (Orange) - Pour des mises en garde.
*   `> [!IMPORTANT]` (Rouge) - Pour des notions cruciales à retenir.

## 🚀 Installation et Lancement

### Prérequis
*   [Node.js](https://nodejs.org/) installé sur votre machine.

### 1. Démarrer le Backend
Ouvrez un terminal et naviguez dans le dossier `backend/` :
```bash
cd backend
npm install
npm start
```
Le serveur backend sera lancé sur `http://localhost:3000`.

### 2. Démarrer le Frontend
Ouvrez un second terminal et naviguez dans le dossier `frontend/` :
```bash
cd frontend
npm install
npm run dev
```
L'interface web sera disponible à l'adresse indiquée par Vite (généralement `http://localhost:5173`).

---

**Construit avec ❤️ pour un apprentissage moderne et fluide.**
