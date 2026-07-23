---
slug: decouverte-vuejs
title: "Découverte de Vue.js 3"
description: "Apprenez à structurer des interfaces utilisateur réactives avec la Composition API de Vue.js."
category: "Design & Frontend"
difficulty: "Intermédiaire"
order: 3
---

# Découverte de Vue.js 3

Lorsque les applications web grandissent, manipuler le DOM à la main devient difficile à maintenir. C'est ici qu'interviennent les frameworks modernes comme **Vue.js**, qui synchronisent automatiquement les données avec l'interface graphique.

## 1. Qu'est-ce que Vue.js ?

Vue.js est un framework progressif JavaScript conçu pour simplifier le développement d'interfaces utilisateur. Il repose sur le concept de **composants** (des blocs d'interface autonomes et réutilisables) et de la **réactivité**.

---

## 2. La Composition API & Réactivité

En Vue 3, nous utilisons la **Composition API** avec la syntaxe `<script setup>` pour écrire notre logique. La fonction `ref()` permet de définir une variable réactive. Lorsque sa valeur change, Vue met à jour le DOM automatiquement.

Voici un exemple classique de compteur interactif :

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
}
</script>

<template>
  <div class="counter">
    <p>Valeur actuelle : {{ count }}</p>
    <button @click="increment">Incrémenter</button>
  </div>
</template>

<style scoped>
.counter {
  padding: 1rem;
  border-radius: 8px;
  background: var(--bg-surface);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
button {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

---

## 3. Directives de Base

Vue propose des attributs spéciaux dans les templates appelés **directives**, préfixés par `v-` :

- `v-bind` (raccourci `:`) : Lie un attribut HTML à une variable JavaScript (ex: `:href="url"`).
- `v-on` (raccourci `@`) : Écoute les événements du DOM (ex: `@click="doSomething"`).
- `v-if` / `v-else` : Affiche conditionnellement un élément du DOM.
- `v-for` : Effectue le rendu d'une liste d'éléments en boucle.

### Exemple de boucle `v-for` et condition `v-if`
```vue
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <span v-if="item.completed">OK</span>
      {{ item.name }}
    </li>
  </ul>
</template>
```

---

## 4. Computed Properties et Watchers

### Les Propriétés Calculées (`computed`)
Elles permettent de calculer une valeur dérivée d'autres variables réactives. Elles sont mises en cache et ne sont recalculées que si leurs dépendances changent.

```javascript
import { ref, computed } from 'vue'

const items = ref([
  { name: 'Apprendre HTML', completed: true },
  { name: 'Apprendre JS', completed: false }
])

const completedCount = computed(() => {
  return items.value.filter(item => item.completed).length
})
```

---

## Conclusion

Vous connaissez maintenant les bases de Vue.js 3 ! Avec la réactivité, les directives et les propriétés calculées, vous avez toutes les clés en main pour concevoir le frontend de notre plateforme de cours.
