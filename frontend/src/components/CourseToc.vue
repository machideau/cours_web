<script setup>
import { computed } from 'vue'
import '../styles/course-toc.css'

const props = defineProps({
  activeTocId: { type: String, default: '' }
})

const headings = computed(() => {
  const h = document.querySelectorAll('.course-body h2, .course-body h3')
  return Array.from(h).map(el => ({
    id: el.id,
    text: el.textContent.replace(/^#+\s*/, ''),
    level: el.tagName === 'H2' ? 2 : 3
  }))
})
</script>

<template>
  <aside class="course-toc" v-if="headings.length">
    <p class="toc-title">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      Sommaire
    </p>
    <ul class="toc-list">
      <li v-for="h in headings" :key="h.id">
        <a
          :href="`#${h.id}`"
          class="toc-link"
          :class="[h.level === 3 ? 'level-3' : '', activeTocId === h.id ? 'active' : '']"
        >
          {{ h.text }}
        </a>
      </li>
    </ul>
  </aside>
</template>
