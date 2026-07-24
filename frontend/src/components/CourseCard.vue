<script setup>
defineProps({
  course: {
    type: Object,
    required: true
  }
})

const getCategoryIcon = (category) => {
  const icons = {  }
  for (const [key, icon] of Object.entries(icons)) {
    if (category && category.toLowerCase().includes(key.toLowerCase())) return icon
  }
  return icons['default']
}

const getCourseImage = (course) => {
  if (course.image) return course.image
  const cat = (course.category || '').toLowerCase()
  const slug = (course.slug || '').toLowerCase()
  if (slug.includes('html') || slug.includes('css')) {
    return 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80'
  }
  if (slug.includes('javascript') || cat.includes('programmation')) {
    return 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=600&q=80'
  }
  if (slug.includes('vue') || cat.includes('vue')) {
    return 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=600&q=80'
  }
  if (slug.includes('numpy') || slug.includes('pandas') || cat.includes('machine learning') || cat.includes('intelligence')) {
    return 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'
  }
  return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'
}
</script>

<template>
  <router-link
    :to="{ name: 'course', params: { slug: course.slug } }"
    class="course-card"
  >
    <div class="course-card-header">
      <img
        :src="getCourseImage(course)"
        :alt="course.title"
        class="course-card-img"
        loading="lazy"
      />
    </div>
    <div class="course-card-body">
      <span class="course-card-category">{{ course.category }}</span>
      <h2 class="course-card-title">{{ course.title }}</h2>
      <p class="course-card-description">{{ course.description }}</p>
    </div>
  </router-link>
</template>
