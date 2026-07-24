<script setup>
import { ref, computed, watch } from 'vue'
import '../styles/course.css'
import { parseCourseMarkdown } from '../utils/markdown.js'
import { addCopyButtons, setupScrollSpy, scrollToTop } from '../utils/courseDom.js'
import { useCourseDetail } from '../composables/useCourseDetail.js'
import CourseResources from '../components/CourseResources.vue'
// import CourseQuiz from '../components/CourseQuiz.vue'
import CourseToc from '../components/CourseToc.vue'

const { course, loading, error } = useCourseDetail()
const activeTocId = ref('')

const parsedContent = computed(() => {
  if (!course.value || !course.value.content) return ''
  return parseCourseMarkdown(course.value.content)
})

watch([parsedContent, loading], () => {
  if (!loading.value) {
    addCopyButtons()
    setupScrollSpy(activeTocId)
  }
}, { immediate: true })
</script>

<template>
  <div class="course-page animate-fade-in">
    <div v-if="loading" class="container">
      <div class="loading-state">
        <div class="spinner" role="status" aria-label="Chargement"></div>
        <p>Chargement du cours...</p>
      </div>
    </div>

    <div v-else-if="error" class="container">
      <div class="error-state">
        <span style="font-size:2.5rem; color:var(--text-muted)">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </span>
        <h3>Erreur</h3>
        <p>{{ error }}</p>
        <router-link to="/" class="btn btn-primary">← Retour à l'accueil</router-link>
      </div>
    </div>

    <template v-else>
      <div class="course-layout">
        <div class="container">
          <CourseToc :activeTocId="activeTocId" />
          <div class="course-main">
            <CourseResources :resources="course.resources" />
            <article class="course-body markdown-body" v-html="parsedContent"></article>
            <CourseQuiz :questions="course.quiz || []" />
            <div class="course-bottom-bar">
              <button class="btn btn-outline top-btn" @click="scrollToTop">
                ↑ Haut de page
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
