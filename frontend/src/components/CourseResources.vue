<script setup>
defineProps({
  resources: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div v-if="resources && resources.length > 0" class="resources-card">
    <span class="resources-title">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
      Ressources &amp; Exercices
    </span>
    <div class="resources-list">
      <a
        v-for="(res, index) in resources"
        :key="index"
        :href="res.url"
        target="_blank"
        rel="noopener"
        class="resource-item"
      >
        ↓ {{ res.title || 'Ressource jointe' }}
      </a>
    </div>
  </div>
</template>
