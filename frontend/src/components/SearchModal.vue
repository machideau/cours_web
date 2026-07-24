<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import '../styles/search-modal.css'
import '../styles/search-results.css'

const props = defineProps({ courses: { type: Array, default: () => [] } })
const open = ref(false), query = ref(''), activeIndex = ref(0)
const router = useRouter()

const COLORS = {
  'Design & Frontend': '#6366f1', 'Programmation & Logique': '#f59e0b',
  'Vue.js': '#42b883', 'Intelligence Artificielle & Machine Learning': '#10b981',
}
const catColor = cat => COLORS[cat] || '#6366f1'
const catBg    = cat => catColor(cat) + '18'

const results = computed(() => {
  if (!query.value.trim()) return props.courses.slice(0, 6)
  const q = query.value.toLowerCase()
  return props.courses.filter(c =>
    c.title.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q)
  )
})

const openModal  = () => { open.value = true; query.value = ''; activeIndex.value = 0 }
const closeModal = () => { open.value = false }
const navigate   = c  => { closeModal(); router.push(`/cours/${c.slug}`) }

function onKeydown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openModal() }
  if (!open.value) return
  if (e.key === 'Escape')    closeModal()
  if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1) }
  if (e.key === 'ArrowUp')   { e.preventDefault(); activeIndex.value = Math.max(activeIndex.value - 1, 0) }
  if (e.key === 'Enter' && results.value[activeIndex.value]) navigate(results.value[activeIndex.value])
}
onMounted(()      => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
defineExpose({ openModal })
</script>

<template>
  <button class="search-trigger" @click="openModal" aria-label="Rechercher un cours">
    <svg class="search-trigger-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
    <span class="search-trigger-label">Rechercher un cours...</span>
    <span class="search-trigger-kbd"><kbd>⌘</kbd><kbd>K</kbd></span>
  </button>

  <Teleport to="body">
    <div v-if="open" class="search-overlay" @click.self="closeModal">
      <div class="search-modal" role="dialog" aria-modal="true">
        <div class="search-input-row">
          <svg class="search-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input class="search-input" v-model="query" placeholder="Titre, catégorie..." autofocus @input="activeIndex = 0" />
          <button class="search-close-btn" @click="closeModal">Esc</button>
        </div>

        <div class="search-results" role="listbox">
          <p class="search-section-label">{{ query ? 'Résultats' : 'Tous les cours' }}</p>
          <div v-if="!results.length" class="search-empty">Aucun cours pour &ldquo;{{ query }}&rdquo;</div>
          <div v-for="(c, i) in results" :key="c.slug" class="search-item" role="option"
            :class="{ 'is-active': i === activeIndex }" @click="navigate(c)" @mouseenter="activeIndex = i">
            <div class="search-item-icon-wrap" :style="{ background: catBg(c.category), color: catColor(c.category) }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <div class="search-item-body">
              <div class="search-item-title">{{ c.title }}</div>
              <div class="search-item-desc">{{ c.description }}</div>
            </div>
            <span class="search-item-badge">{{ c.category }}</span>
            <svg class="search-item-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>
        </div>

        <div class="search-footer">
          <span class="search-footer-hint"><kbd>↵</kbd> Ouvrir</span>
          <span class="search-footer-hint"><kbd>↑</kbd><kbd>↓</kbd> Naviguer</span>
          <span class="search-footer-hint"><kbd>Esc</kbd> Fermer</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>
