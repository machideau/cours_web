<script setup>
import { computed } from 'vue'
import '../styles/home.css'
import { useSeo } from '../composables/useSeo.js'
import { useCourses } from '../composables/useCourses.js'
import CourseCard from '../components/CourseCard.vue'

useSeo({
  title: 'Cours de Machideau — Plateforme de cours en ligne',
  description: 'Parcours d\'apprentissage structurés en développement web et Machine Learning.',
  url: window.location.origin + '/'
})

const { loading, error, courses, filteredCourses, searchQuery, fetchCourses } = useCourses()

const coursesByCategory = computed(() => {
  const map = new Map()
  filteredCourses.value.forEach(c => {
    if (!map.has(c.category)) map.set(c.category, [])
    map.get(c.category).push(c)
  })
  return Array.from(map.entries()).map(([cat, items]) => ({ cat, items }))
})
</script>

<template>
  <div class="home-page animate-fade-in">
    <!-- Hero -->
    <section class="hero">
      <div class="container hero-content">
        <h1 class="hero-title">Parcours d'apprentissage</h1>
        <p class="hero-subtitle">
          Des parcours structurés pour apprendre le développement web et le Machine Learning,
          rédigés en français, accessibles à tous les niveaux.
        </p>
        
        <div style="margin-top: 1.5rem; max-width: 400px; position: relative;">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Rechercher un cours ou un sujet..." 
            style="width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border-radius: var(--radius-btn); border: 1.5px solid var(--border-color); background: var(--bg-surface); color: var(--text-primary); font-size: 0.95rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s;"
            onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='0 0 0 3px var(--color-primary-light)';"
            onblur="this.style.borderColor='var(--border-color)'; this.style.boxShadow='none';"
          />
          <svg style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </div>

        <div class="hero-meta">
          <span class="hero-meta-item">
            <span class="hero-meta-dot"></span>
            {{ courses.length }} cours disponibles
          </span>
        </div>
      </div>
    </section>

    <!-- Course groups by category -->
    <section class="courses-section">
      <div class="container">
        <!-- Loading -->
        <div v-if="loading" class="loading-state" style="padding:3rem 0">
          <div class="spinner" role="status" aria-label="Chargement"></div>
          <p>Chargement des cours...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="error-state" style="padding:3rem 0">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <h3>Erreur de connexion</h3>
          <p>{{ error }}</p>
          <button class="btn btn-primary" @click="fetchCourses">Réessayer</button>
        </div>

        <!-- Grouped by category -->
        <template v-else>
          <div v-if="coursesByCategory.length === 0" style="padding: 3rem 0; text-align: center; color: var(--text-muted);">
            <svg style="margin: 0 auto 1rem; color: var(--text-muted); opacity: 0.5;" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <p>Aucun cours ne correspond à votre recherche.</p>
          </div>
          <div v-else v-for="group in coursesByCategory" :key="group.cat" class="courses-group">
            <span class="courses-group-label">{{ group.cat }}</span>
            <div class="courses-grid">
              <CourseCard v-for="course in group.items" :key="course.slug" :course="course" />
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>
