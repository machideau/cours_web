<script setup>
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import DashboardProgress from './components/DashboardProgress.vue'

const { Layout } = DefaultTheme
const route = useRoute()

const completedCourses = ref([])
const showDashboard = ref(false)
const isFocusMode = ref(false)
const hasQuiz = ref(false)

const loadProgress = () => {
  const saved = localStorage.getItem('completed_courses')
  if (saved) {
    try {
      completedCourses.value = JSON.parse(saved)
    } catch (e) {
      completedCourses.value = []
    }
  }
}

// Réinitialiser l'état du quiz à chaque changement de page
watch(() => route.path, () => {
  hasQuiz.value = false
})

const onQuizAvailable = () => { hasQuiz.value = true }

onMounted(() => {
  loadProgress()
  window.addEventListener('quiz-available', onQuizAvailable)
})

onUnmounted(() => {
  window.removeEventListener('quiz-available', onQuizAvailable)
})

const toggleCompletion = () => {
  const path = route.path
  if (completedCourses.value.includes(path)) {
    completedCourses.value = completedCourses.value.filter(p => p !== path)
  } else {
    completedCourses.value.push(path)
  }
  localStorage.setItem('completed_courses', JSON.stringify(completedCourses.value))
  window.dispatchEvent(new CustomEvent('course-completion-changed'))
}

const isCompleted = () => completedCourses.value.includes(route.path)

const openQuiz = () => {
  window.dispatchEvent(new CustomEvent('open-quiz-modal'))
}

const toggleFocusMode = () => {
  isFocusMode.value = !isFocusMode.value
  if (isFocusMode.value) {
    document.body.classList.add('zen-focus-mode')
  } else {
    document.body.classList.remove('zen-focus-mode')
  }
}
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <button class="nav-dash-btn" @click="showDashboard = true" title="Voir mes progrès d'apprentissage">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 20v-6M6 20V10M18 20V4"></path>
        </svg>
        <span class="nav-dash-text">Mes Progrès</span>
        <span v-if="completedCourses.length > 0" class="nav-dash-count">{{ completedCourses.length }}</span>
      </button>
    </template>

    <template #doc-before>
      <div v-if="route.path.startsWith('/courses/') && route.path !== '/courses/'" class="course-top-toolbar">
        <div class="toolbar-left">
          <div class="course-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            <span>Formation Gratuite</span>
          </div>

          <button class="btn-tool" @click="toggleFocusMode" :title="isFocusMode ? 'Quitter le mode lecture zen' : 'Activer le mode lecture zen sans distraction'">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
            <span>{{ isFocusMode ? 'Quitter Mode Zen' : 'Mode Lecture Zen' }}</span>
          </button>
        </div>

        <div class="toolbar-right">
          <!-- Bouton Quiz : visible uniquement si le cours est validé et a un quiz -->
          <button
            v-if="isCompleted() && hasQuiz"
            class="btn-tool btn-quiz-open"
            @click="openQuiz"
            title="Faire le quiz de ce cours"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>Quiz</span>
          </button>

          <button class="btn-complete" @click="toggleCompletion" :class="{ 'completed': isCompleted() }">
            <svg v-if="isCompleted()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
            <span>{{ isCompleted() ? 'Cours validé' : 'Marquer comme validé' }}</span>
          </button>
        </div>
      </div>
    </template>
    
    <template #doc-after>
      <div v-if="route.path.startsWith('/courses/') && route.path !== '/courses/'" class="comments-section" :key="route.path">
        <h3>Commentaires & Questions</h3>
        <p><em>Posez vos questions ou partagez vos remarques sur ce cours.</em></p>
      </div>
    </template>
  </Layout>

  <!-- Modal Dashboard des statistiques -->
  <DashboardProgress :isOpen="showDashboard" @close="showDashboard = false" />
</template>

<style scoped>
.nav-dash-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  margin-left: 12px;
  border-radius: 9999px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-dash-btn:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.nav-dash-count {
  font-size: 0.72rem;
  padding: 1px 6px;
  border-radius: 9999px;
  background: var(--claude-peach-bg);
  color: var(--claude-peach-text);
  border: 1px solid var(--claude-peach-border);
  font-weight: 700;
}

.course-top-toolbar {
  margin-bottom: 2.5rem;
  padding: 12px 18px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.course-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;
  background: var(--claude-peach-bg);
  color: var(--claude-peach-text);
  border: 1px solid var(--claude-peach-border);
}

.btn-tool {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-tool:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-3);
}

.btn-quiz-open {
  border-color: var(--vp-c-brand-1) !important;
  color: var(--vp-c-brand-1) !important;
  font-weight: 600 !important;
}

.btn-quiz-open:hover {
  background: var(--vp-c-brand-1) !important;
  color: #ffffff !important;
}

.btn-complete {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-family: var(--vp-font-family-base);
  font-size: 0.88rem;
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-complete:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.btn-complete.completed {
  background: var(--vp-c-brand-1);
  color: #FFFFFF;
  border-color: var(--vp-c-brand-1);
}

.comments-section {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.comments-section h3 {
  font-family: var(--vp-font-family-heading);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.comments-section p {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

@media (max-width: 640px) {
  .course-top-toolbar {
    padding: 10px 14px;
    margin-bottom: 1.5rem;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .toolbar-left, .toolbar-right {
    width: 100%;
    justify-content: space-between;
  }
  .btn-complete, .btn-quiz-open, .btn-tool {
    padding: 6px 10px;
    font-size: 0.78rem;
  }
  .nav-dash-text {
    display: none;
  }
  .nav-dash-btn {
    padding: 4px 8px;
    margin-left: 6px;
  }
}
</style>
