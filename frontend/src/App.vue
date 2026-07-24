<script setup>
import { ref, onMounted } from 'vue'
import './styles/app.css'

const currentTheme = ref('light')

const toggleTheme = () => {
  const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
  currentTheme.value = newTheme
  localStorage.setItem('color-scheme', newTheme)
  document.documentElement.setAttribute('data-theme', newTheme)
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]')
  if (metaColorScheme) {
    metaColorScheme.content = newTheme
  }
}

onMounted(() => {
  const activeTheme = document.documentElement.getAttribute('data-theme') || 'light'
  currentTheme.value = activeTheme

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = (e) => {
    if (!localStorage.getItem('color-scheme')) {
      const systemTheme = e.matches ? 'dark' : 'light'
      currentTheme.value = systemTheme
      document.documentElement.setAttribute('data-theme', systemTheme)
    }
  }

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange)
  }
})
</script>

<template>
  <header class="navbar">
    <div class="container navbar-content">
      <!-- Logo image -->
      <router-link to="/" class="logo-link" title="Cours de Machideau - Accueil">
        <div class="logo">
          <div class="logo-img-wrapper">
            <img src="/logo.png" alt="Cours de Machideau" class="logo-img" />
          </div>
        </div>
      </router-link>

      <!-- Nav links (centre) -->
      <nav class="nav-links">
        <router-link to="/" class="nav-link">
          Tous les cours
        </router-link>
      </nav>

      <!-- Actions (droite) -->
      <div class="nav-actions">
        <button
          class="theme-toggle btn btn-secondary"
          @click="toggleTheme"
          :aria-label="currentTheme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'"
          title="Changer de thème"
        >
          <span v-if="currentTheme === 'light'">🌙</span>
          <span v-else>☀️</span>
          <span class="toggle-text">{{ currentTheme === 'light' ? 'Mode sombre' : 'Mode clair' }}</span>
        </button>
      </div>
    </div>
  </header>

  <main class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" :key="$route.path" />
      </transition>
    </router-view>
  </main>

  <footer class="app-footer">
    <div class="container footer-content">
      <p class="footer-copy">© 2026 <span class="footer-brand">CoursMachideau</span>. Tous droits réservés.</p>
      <p class="footer-copy">Conçu pour aider les passionnés du code.</p>
    </div>
  </footer>
</template>
