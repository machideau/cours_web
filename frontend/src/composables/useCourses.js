import { ref, computed, onMounted } from 'vue'

export function useCourses() {
  const courses = ref([])
  const loading = ref(true)
  const error = ref(null)

  const searchQuery = ref('')
  const selectedCategory = ref('Tous')
  const selectedDifficulty = ref('Tous')

  const fetchCourses = async () => {
    try {
      loading.value = true
      const res = await fetch('/api/courses')
      if (!res.ok) throw new Error('Impossible de charger la liste des cours.')
      courses.value = await res.json()
    } catch (err) {
      console.error(err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const categories = computed(() => {
    const list = new Set(courses.value.map(c => c.category))
    return ['Tous', ...Array.from(list)]
  })

  const difficulties = computed(() => {
    const list = new Set(courses.value.map(c => c.difficulty))
    return ['Tous', ...Array.from(list)]
  })

  const filteredCourses = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    return courses.value.filter(course => {
      const matchesSearch = !query ||
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        (course.content && course.content.toLowerCase().includes(query))

      const matchesCategory = selectedCategory.value === 'Tous' || course.category === selectedCategory.value
      const matchesDifficulty = selectedDifficulty.value === 'Tous' || course.difficulty === selectedDifficulty.value

      return matchesSearch && matchesCategory && matchesDifficulty
    })
  })

  onMounted(fetchCourses)

  return {
    courses,
    loading,
    error,
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    categories,
    difficulties,
    filteredCourses,
    fetchCourses
  }
}
