---
slug: intro-html-css
title: "Introduction à HTML5 et CSS3"
description: "Apprenez les bases indispensables pour structurer et embellir vos pages Web."
category: "Design & Frontend"
difficulty: "Débutant"
image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80"
order: 1
---

# Introduction à HTML5 et CSS3

Bienvenue dans ce premier cours ! Nous allons poser les bases du développement Web en explorant HTML5 (la structure) et CSS3 (le style).

## 1. Qu'est-ce que HTML ?

**HTML** (HyperText Markup Language) est le langage de balisage utilisé pour structurer une page web. Il utilise des balises (`<tag>`) pour définir les différents types de contenu (titres, paragraphes, images, liens, etc.).

Voici un exemple simple de structure HTML :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Mon Premier Site</title>
</head>
<body>
    <h1>Bonjour le monde !</h1>
    <p>Ceci est un paragraphe de texte.</p>
</body>
</html>
```

### Les balises les plus courantes
- `<h1>` à `<h6>` : Pour les titres de différents niveaux.
- `<p>` : Pour les paragraphes de texte.
- `<a>` : Pour créer des liens hypertextes.
- `<img>` : Pour insérer des images.

---

## 2. Qu'est-ce que CSS ?

**CSS** (Cascading Style Sheets) est utilisé pour mettre en forme la structure HTML. Il permet de gérer les couleurs, les polices, les espacements, et la mise en page (layout) de votre site.

Voici comment modifier le style de notre page HTML :

```css
body {
    background-color: #f0f2f5;
    font-family: 'Inter', sans-serif;
    color: #333;
}

h1 {
    color: #4f46e5;
    text-align: center;
}
```

### Méthodes d'intégration du CSS
1. **Externe** (recommandé) : Via un fichier `.css` relié par une balise `<link>`.
2. **Interne** : Dans une balise `<style>` située dans le `<head>`.
3. **En ligne** : Directement sur l'élément via l'attribut `style="..."`.

---

## 3. Le Modèle de Boîte (Box Model)

En CSS, chaque élément est considéré comme une boîte rectangulaire. Ce modèle se compose de quatre parties essentielles :
1. **Content** : Le texte ou l'image de l'élément.
2. **Padding** : L'espace interne autour du contenu.
3. **Border** : La bordure entourant le padding.
4. **Margin** : L'espace externe séparant l'élément des autres.

> [!TIP]
> Utilisez toujours `box-sizing: border-box;` dans votre CSS pour que les paddings et les bordures soient inclus dans la largeur totale définie d'un élément, ce qui simplifie grandement les calculs de mise en page !

---

## Conclusion

Félicitations, vous connaissez maintenant les rôles de HTML5 et CSS3 ! Dans le prochain cours, nous rendrons nos pages dynamiques grâce à JavaScript.
