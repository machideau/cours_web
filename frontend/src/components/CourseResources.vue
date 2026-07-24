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
    <span class="resources-title">📎 Ressources &amp; Exercices</span>
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
