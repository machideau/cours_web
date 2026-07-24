<script setup>
import { ref, onMounted, computed } from 'vue'
import '../styles/home.css'

// --- SEO ---
function setMeta({ title, description, url }) {
  document.title = title
  const setTag = (sel, attr, val) => {
    const el = document.querySelector(sel)
    if (el) el.setAttribute(attr, val)
  }
  setTag('meta[name="description"]', 'content', description)
  setTag('meta[property="og:title"]', 'content', title)
  setTag('meta[property="og:description"]', 'content', description)
  setTag('meta[property="og:url"]', 'content', url)
  setTag('meta[name="twitter:title"]', 'content', title)
  setTag('meta[name="twitter:description"]', 'content', description)
  setTag('link[rel="canonical"]', 'href', url)
}

onMounted(() => {
  setMeta({
    title: 'Cours de Machideau — Plateforme de cours en ligne',
    description: 'Plateforme de cours en ligne pour apprendre le développement web : HTML, CSS, JavaScript, Vue.js et plus encore. Cours rédigés en français, accessibles à tous les niveaux.',
    url: window.location.origin + '/'
  })
})

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
    const res = await fetch('/api/courses')
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

// Icône selon la catégorie
const getCategoryIcon = (category) => {
  const icons = {
    'HTML': '', 'CSS': '', 'JavaScript': '', 'Vue': '',
    'React': '', 'Python': '', 'Node': '', 'Git': '',
    'Base de données': '', 'SQL': '', 'API': '',
    'Algorithmes': '', 'TypeScript': '', 'default': ''
  }
  for (const [key, icon] of Object.entries(icons)) {
    if (category && category.toLowerCase().includes(key.toLowerCase())) return icon
  }
  return icons['default']
}

// Classe CSS pour la difficulté
const getDifficultyClass = (difficulty) => {
  if (!difficulty) return ''
  return `difficulty-${difficulty.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`
}

onMounted(() => {
  fetchCourses()
})
</script>

<template>
  <div class="home-page animate-fade-in">

    <!-- ── Contenu principal ── -->
    <section class="main-content">
      <div class="container">

        <!-- Zone des cours -->
        <div class="courses-area">

          <!-- Loading state -->
          <div v-if="loading" class="loading-state">
            <div class="spinner" role="status" aria-label="Chargement"></div>
            <p>Chargement des cours...</p>
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="error-state">
            <span class="empty-state-icon">⚠️</span>
            <h3>Erreur de connexion</h3>
            <p>{{ error }}</p>
            <button class="btn btn-primary" @click="fetchCourses">Réessayer</button>
          </div>

          <div v-else>
            <!-- En-tête résultats -->
            <div class="results-header">
              <p class="results-count">
                {{ filteredCourses.length }} cours
                <span v-if="selectedCategory !== 'Tous' || selectedDifficulty !== 'Tous'">
                  filtrés
                </span>
                <span v-else>disponibles</span>
              </p>
            </div>

            <!-- Aucun résultat -->
            <div v-if="filteredCourses.length === 0" class="empty-state">
              <span class="empty-state-icon"></span>
              <h3>Aucun cours trouvé</h3>
              <p>Essayez de modifier votre recherche ou vos filtres.</p>
            </div>

            <!-- Grille de cours -->
            <div v-else class="courses-grid">
              <router-link
                v-for="course in filteredCourses"
                :key="course.slug"
                :to="{ name: 'course', params: { slug: course.slug } }"
                class="course-card"
              >
                <!-- Header coloré avec icône -->
                <div class="course-card-header">
                  <span class="course-card-icon" aria-hidden="true">{{ getCategoryIcon(course.category) }}</span>
                </div>

                <!-- Corps de la carte -->
                <div class="course-card-body">
                  <span class="course-card-category">{{ course.category }}</span>
                  <h2 class="course-card-title">{{ course.title }}</h2>
                  <p class="course-card-description">{{ course.description }}</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

