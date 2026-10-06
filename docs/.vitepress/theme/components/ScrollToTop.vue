<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)
const scrollProgress = ref(0)
const circumference = 2 * Math.PI * 18 // radius is 18

const calculateScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  
  if (docHeight > 0) {
    const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
    scrollProgress.value = progress
  } else {
    scrollProgress.value = 0
  }

  // Apparaître dès qu'on a scrollé plus de 250px
  isVisible.value = scrollTop > 250
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', calculateScroll, { passive: true })
  calculateScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', calculateScroll)
})
</script>

<template>
  <transition name="fade-slide">
    <button
      v-if="isVisible"
      class="scroll-to-top-btn"
      @click="scrollToTop"
      title="Remonter en haut de la page"
      aria-label="Remonter en haut de page"
    >
      <!-- Circular Progress Ring -->
      <svg class="progress-ring" width="44" height="44" viewBox="0 0 44 44">
        <circle
          class="progress-ring-bg"
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke-width="2.5"
        />
        <circle
          class="progress-ring-circle"
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke-width="2.5"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="circumference - (scrollProgress / 100) * circumference"
        />
      </svg>

      <!-- Arrow Icon -->
      <div class="icon-container">
        <svg
          class="arrow-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </div>
      
      <!-- Tooltip -->
      <span class="btn-tooltip">Haut de page</span>
    </button>
  </transition>
</template>

<style scoped>
.scroll-to-top-btn {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(8px);
}

.scroll-to-top-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(217, 119, 87, 0.25), 0 3px 10px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.scroll-to-top-btn:active {
  transform: translateY(0) scale(0.96);
}

.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
  pointer-events: none;
}

.progress-ring-bg {
  stroke: var(--vp-c-divider);
}

.progress-ring-circle {
  stroke: var(--vp-c-brand-1);
  stroke-linecap: round;
  transition: stroke-dashoffset 0.1s ease;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: transform 0.2s ease;
}

.scroll-to-top-btn:hover .icon-container {
  transform: translateY(-2px);
}

.btn-tooltip {
  position: absolute;
  right: 56px;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transform: translateX(6px);
  transition: all 0.2s ease;
}

.scroll-to-top-btn:hover .btn-tooltip {
  opacity: 1;
  transform: translateX(0);
}

/* Animations d'apparition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.9);
}

@media (max-width: 768px) {
  .scroll-to-top-btn {
    bottom: 20px;
    right: 20px;
    width: 42px;
    height: 42px;
  }
  .btn-tooltip {
    display: none;
  }
}
</style>
