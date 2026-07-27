<script setup>
defineProps({ course: { type: Object, required: true } })
</script>

<template>
  <router-link
    :to="{ name: 'course', params: { slug: course.slug } }"
    class="course-card"
  >
    <div class="course-card-inner">
      <h2 class="course-card-title">{{ course.title }}</h2>
      <div style="display:flex; align-items:center; gap:0.5rem; flex-shrink:0">
        <span v-if="course.difficulty" class="course-card-diff">{{ course.difficulty }}</span>
        <svg class="course-card-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
      </div>
    </div>
  </router-link>
</template>
