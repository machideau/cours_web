<script setup>
import '../styles/home.css'
import { useSeo } from '../composables/useSeo.js'
import { useCourses } from '../composables/useCourses.js'
import CourseCard from '../components/CourseCard.vue'

useSeo({
  title: 'Cours de Machideau — Plateforme de cours en ligne',
  description: 'Plateforme de cours en ligne pour apprendre le développement web : HTML, CSS, JavaScript, Vue.js et plus encore. Cours rédigés en français, accessibles à tous les niveaux.',
  url: window.location.origin + '/'
})

const {
  loading,
  error,
  selectedCategory,
  selectedDifficulty,
  filteredCourses,
  fetchCourses
} = useCourses()
</script>

<template>
  <div class="home-page animate-fade-in">
    <section class="main-content">
      <div class="container">
        <div class="courses-area">
          <div v-if="loading" class="loading-state">
            <div class="spinner" role="status" aria-label="Chargement"></div>
            <p>Chargement des cours...</p>
          </div>

          <div v-else-if="error" class="error-state">
            <span class="empty-state-icon">⚠️</span>
            <h3>Erreur de connexion</h3>
            <p>{{ error }}</p>
            <button class="btn btn-primary" @click="fetchCourses">Réessayer</button>
          </div>

          <div v-else>
            <div class="results-header">
              <p class="results-count">
                {{ filteredCourses.length }} cours
                <span v-if="selectedCategory !== 'Tous' || selectedDifficulty !== 'Tous'">filtrés</span>
                <span v-else>disponibles</span>
              </p>
            </div>

            <div v-if="filteredCourses.length === 0" class="empty-state">
              <span class="empty-state-icon"></span>
              <h3>Aucun cours trouvé</h3>
              <p>Essayez de modifier votre recherche ou vos filtres.</p>
            </div>

            <div v-else class="courses-grid">
              <CourseCard
                v-for="course in filteredCourses"
                :key="course.slug"
                :course="course"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
