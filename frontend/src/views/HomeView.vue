<script setup>
import { ref, onMounted, computed } from 'vue'
import '../styles/home.css'

const courses = ref([])
const loading = ref(true)
const error = ref(null)

// Search & Filter state
const searchQuery = ref('')
const selectedCategory = ref('Tous')
const selectedDifficulty = ref('Tous')

// Fetch course metadata list from Node API
const fetchCourses = async () => {
  try {
    loading.value = true
    const res = await fetch('http://localhost:3000/api/courses')
    if (!res.ok) {
      throw new Error('Impossible de charger la liste des cours.')
    }
    courses.value = await res.json()
  } catch (err) {
    console.error(err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Available categories computed from loaded courses
const categories = computed(() => {
  const list = new Set(courses.value.map(c => c.category))
  return ['Tous', ...Array.from(list)]
})

// Available difficulties computed from loaded courses
const difficulties = computed(() => {
  const list = new Set(courses.value.map(c => c.difficulty))
  return ['Tous', ...Array.from(list)]
})

// Filter and search computation
const filteredCourses = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  return courses.value.filter(course => {
    const matchesSearch = !query ||
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      (course.content && course.content.toLowerCase().includes(query))

    const matchesCategory =
      selectedCategory.value === 'Tous' ||
      course.category === selectedCategory.value

    const matchesDifficulty =
      selectedDifficulty.value === 'Tous' ||
      course.difficulty === selectedDifficulty.value

    return matchesSearch && matchesCategory && matchesDifficulty
  })
})

onMounted(() => {
  fetchCourses()
})
</script>

<template>
  <div class="container dashboard animate-fade-in">

    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">Cours disponibles</h1>
      <p class="page-subtitle">Retrouvez ici tous les cours de la formation. Cliquez sur un cours pour le lire.</p>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="toolbar glass-panel">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un cours..."
          aria-label="Rechercher des cours"
        />
      </div>

      <div class="filters">
        <div class="filter-group">
          <span class="filter-label">Catégorie :</span>
          <div class="pills">
            <button
              v-for="cat in categories"
              :key="cat"
              class="pill"
              :class="{ active: selectedCategory === cat }"
              @click="selectedCategory = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <span class="filter-label">Niveau :</span>
          <div class="pills">
            <button
              v-for="diff in difficulties"
              :key="diff"
              class="pill"
              :class="{ active: selectedDifficulty === diff }"
              @click="selectedDifficulty = diff"
            >
              {{ diff }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement des cours...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state glass-panel">
      <h3>Erreur de connexion</h3>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="fetchCourses">Réessayer</button>
    </div>

    <div v-else>
      <div v-if="filteredCourses.length === 0" class="empty-state glass-panel">
        <h3>Aucun cours ne correspond</h3>
        <p>Essayez de modifier votre recherche ou vos filtres.</p>
      </div>

      <div v-else class="courses-grid">
        <router-link
          v-for="course in filteredCourses"
          :key="course.slug"
          :to="{ name: 'course', params: { slug: course.slug } }"
          class="course-card glass-panel"
        >
          <span class="course-category">{{ course.category }}</span>
          <h2 class="course-title">{{ course.title }}</h2>
          <p class="course-description">{{ course.description }}</p>
        </router-link>
      </div>
    </div>

  </div>
</template>

