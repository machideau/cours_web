import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { setMeta } from './useSeo.js'

export function useCourseDetail() {
  const route = useRoute()
  const course = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const fetchCourseContent = async (slug) => {
    try {
      loading.value = true
      error.value = null
      const res = await fetch(`/api/courses/${slug}`)
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Ce cours n\'existe pas.')
        }
        throw new Error('Erreur de chargement du cours.')
      }
      course.value = await res.json()
      setMeta({
        title: `${course.value.title} — Cours de Machideau`,
        description: course.value.description || `Lisez le cours "${course.value.title}" sur la plateforme Cours de Machideau.`,
        url: window.location.href
      })
    } catch (err) {
      console.error(err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  watch(() => route.params.slug, (newSlug) => {
    if (newSlug) fetchCourseContent(newSlug)
  })

  onMounted(() => {
    if (route.params.slug) fetchCourseContent(route.params.slug)
  })

  return {
    course,
    loading,
    error,
    fetchCourseContent
  }
}
