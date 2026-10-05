# MachLearn - Plateforme Open Source 100% Gratuite

Une plateforme de cours en ligne générée statiquement (SSG) via **VitePress**. Spécialement conçue pour être gratuite à héberger, facile à contribuer et accessible hors ligne.

## Fonctionnalités 

*   **Hébergement Gratuit (SSG)** : Se déploie facilement sur GitHub Pages, Vercel ou Netlify sans backend Node.js (0 coût de serveur).
*   **Suivi de Progression Local** : Vos cours terminés sont marqués et enregistrés dans le navigateur, pas besoin de compte ou de base de données.
*   **Commentaires Giscus** : Laissez des commentaires en bas des cours grâce à l'intégration gratuite avec les Discussions GitHub.
*   **Mode Hors-Ligne (PWA)** : Bientôt disponible, permet de consulter les cours sans connexion internet.
*   **Contribution Open Source** : Un bouton permet de corriger/suggérer des modifications facilement.

## Comment ajouter un cours ?

1. Ajoutez simplement un fichier `.md` dans le dossier `docs/courses/`.
2. Le système de navigation le détectera automatiquement grâce au front-matter.

Exemple d'entête (Front-matter) :
```yaml
---
title: "Mon Nouveau Cours"
category: "Général"
order: 1
---
```

## Installation locale

1. Installer les dépendances :
   ```bash
   npm install
   ```

2. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
   Le site sera accessible sur `http://localhost:5173`.

## Déploiement

Pour générer le site statique prêt à être déployé :
```bash
npm run build
```
Les fichiers générés se trouveront dans `docs/.vitepress/dist`.
