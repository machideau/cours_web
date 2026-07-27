<script setup>
import { computed } from 'vue'
import { useCourses } from '../composables/useCourses.js'
import { useRoute } from 'vue-router'

const props = defineProps({
  currentCourse: {
    type: Object,
    default: null
  }
})

const { courses } = useCourses()
const route = useRoute()

// Grouper les cours par catégorie pour la sidebar
const coursesByCategory = computed(() => {
  const map = new Map()
  courses.value.forEach(c => {
    if (!map.has(c.category)) map.set(c.category, [])
    map.get(c.category).push(c)
  })
  return Array.from(map.entries()).map(([cat, items]) => ({ cat, items }))
})
</script>

<template>
  <aside class="course-sidebar">
    <div class="sidebar-header">
      <router-link to="/" class="sidebar-back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Tous les parcours
      </router-link>
    </div>
    <nav class="sidebar-nav">
      <div v-for="group in coursesByCategory" :key="group.cat" class="sidebar-group">
        <h4 class="sidebar-group-title">{{ group.cat }}</h4>
        <ul class="sidebar-list">
          <li v-for="c in group.items" :key="c.slug">
            <router-link 
              :to="{ name: 'course', params: { slug: c.slug } }"
              class="sidebar-link"
              :class="{ 'active': route.params.slug === c.slug }"
            >
              {{ c.title }}
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>
