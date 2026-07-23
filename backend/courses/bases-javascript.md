---
slug: bases-javascript
title: "Les Bases de JavaScript"
description: "Découvrez comment rendre vos pages web interactives et dynamiques grâce aux scripts JavaScript."
category: "Programmation & Logique"
resources:
  - title: "LISEZ_MOI"
    url: "/downloads/LISEZ_MOI.txt"
difficulty: "Débutant"
order: 2
---

# Les Bases de JavaScript

Après avoir vu comment structurer et styliser une page, il est temps de lui donner vie ! C'est le rôle de **JavaScript**, un langage de programmation incontournable du Web.

## 1. Introduction à JavaScript

JavaScript s'exécute directement dans le navigateur de l'utilisateur. Il permet de manipuler le contenu de la page, réagir aux clics, effectuer des calculs ou charger des données sans recharger la page.

### Intégration dans le HTML
On utilise la balise `<script>` :

```html
<script>
    console.log("Bonjour depuis JavaScript !");
</script>
```

Ou via un fichier externe (fortement recommandé) :
```html
<script src="app.js" defer></script>
```
L'attribut `defer` permet de charger le script en tâche de fond et de ne l'exécuter qu'une fois le document HTML complètement analysé.

---

## 2. Variables et Types de Données

Les variables servent à stocker des informations. En JavaScript moderne (ES6+), on utilise principalement `const` (pour les valeurs constantes) et `let` (pour les valeurs qui peuvent changer).

```javascript
const name = "Alice"; // String
let score = 10;      // Number
const isStudent = true; // Boolean
const tags = ["web", "js", "html"]; // Array
const user = { name: "Alice", age: 25 }; // Object
```

---

## 3. Les Fonctions

Les fonctions permettent de regrouper un ensemble d'instructions pour les exécuter facilement.

```javascript
// Fonction standard
function saluer(prenom) {
    return "Bonjour " + prenom + " !";
}

// Fonction fléchée (Arrow function)
const multiplier = (a, b) => a * b;

console.log(saluer("Alice")); // Affiche: Bonjour Alice !
console.log(multiplier(3, 4)); // Affiche: 12
```

---

## 4. Manipuler le DOM

Le **DOM** (Document Object Model) est la représentation en mémoire de votre page HTML. JavaScript permet d'y accéder et de le modifier.

```javascript
// Sélectionner un élément
const titre = document.querySelector("h1");

// Modifier le texte
titre.textContent = "Nouveau titre dynamique !";

// Ajouter un écouteur d'événement (Event Listener)
const bouton = document.querySelector("#monBouton");
bouton.addEventListener("click", () => {
    alert("Le bouton a été cliqué !");
});
```

---

## Conclusion

Vous maîtrisez désormais les variables, les fonctions et la manipulation de base du DOM ! Dans le prochain cours, nous verrons comment structurer une application moderne complète avec le framework Vue.js.
