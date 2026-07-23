<script setup>
import { ref, onMounted } from 'vue'
import './styles/app.css'

const currentTheme = ref('light')

const toggleTheme = () => {
  const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
  currentTheme.value = newTheme
  
  // Persist preference
  localStorage.setItem('color-scheme', newTheme)
  
  // Apply theme to DOM
  document.documentElement.setAttribute('data-theme', newTheme)
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]')
  if (metaColorScheme) {
    metaColorScheme.content = newTheme
  }
}

onMounted(() => {
  // Sync the local component state with the applied theme
  const activeTheme = document.documentElement.getAttribute('data-theme') || 'light'
  currentTheme.value = activeTheme

  // Set up listener for system color-scheme changes if no preference is pinned
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = (e) => {
    if (!localStorage.getItem('color-scheme')) {
      const systemTheme = e.matches ? 'dark' : 'light'
      currentTheme.value = systemTheme
      document.documentElement.setAttribute('data-theme', systemTheme)
    }
  }
  
  // Modern browsers support addEventListener on MediaQueryList
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange)
  }
})
</script>

<template>
  <header class="navbar">
    <div class="container navbar-content">
      <router-link to="/" class="logo-link">
        <div class="logo">
          <span class="logo-text">Cours<span class="gradient-text">Machideau</span></span>
        </div>
      </router-link>
      
      <div class="nav-actions">
        <router-link to="/" class="nav-link" active-class="active-nav">
          Tous les cours
        </router-link>
        
        <button 
          class="theme-toggle btn btn-secondary" 
          @click="toggleTheme" 
          :aria-label="currentTheme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'"
          title="Changer de thème"
        >
          <span class="toggle-text">{{ currentTheme === 'light' ? 'Mode Sombre' : 'Mode Clair' }}</span>
        </button>

      </div>
    </div>
  </header>

  <!-- Decorative background blobs -->
  <div class="bg-decoration blob-1"></div>
  <div class="bg-decoration blob-2"></div>

  <main class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" :key="$route.path" />
      </transition>
    </router-view>
  </main>


  <footer class="app-footer">
    <div class="container footer-content">
      <p>&copy; 2026 Antigravity Cours. Conçu pour le développement web moderne.</p>
    </div>
  </footer>
</template>

