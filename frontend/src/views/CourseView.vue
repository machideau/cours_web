<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import 'katex/dist/katex.min.css'
import '../styles/course.css'

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

const route = useRoute()

const course = ref(null)
const loading = ref(true)
const error = ref(null)

// Active TOC section (scroll spy)
const activeTocId = ref('')

// Custom Renderer for Marked with Highlight.js
const renderer = new marked.Renderer()
renderer.code = function({ text, lang }) {
  const validLang = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
  const highlighted = validLang === 'plaintext'
    ? hljs.highlightAuto(text).value
    : hljs.highlight(text, { language: validLang }).value
  return `<pre><code class="hljs language-${validLang}">${highlighted}</code></pre>`
}
marked.use({ renderer })

// KaTeX : rendu des formules LaTeX $inline$ et $$bloc$$
marked.use(markedKatex({
  throwOnError: false,
  output: 'html'
}))

// Fetch single course content
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
    // Update page meta for SEO
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

// Compute Table of Contents from markdown h2 elements
const tableOfContents = computed(() => {
  if (!course.value || !course.value.content) return []
  const lines = course.value.content.split('\n')
  const toc = []
  lines.forEach(line => {
    const match = line.match(/^##\s+(.+)$/)
    if (match) {
      const title = match[1].replace(/[*_`]/g, '').trim()
      const id = title
        .toLowerCase()
        .replace(/[^\w\s\u00C0-\u00FF-]/g, '')
        .replace(/[\s-]+/g, '-')
      toc.push({ title, id })
    }
  })
  return toc
})

// Parse Markdown to HTML, inject IDs and format Callouts
const parsedContent = computed(() => {
  if (!course.value || !course.value.content) return ''

  let html = marked.parse(course.value.content)

  // Insert IDs into <h2> tags
  html = html.replace(/<h2>(.*?)<\/h2>/g, (match, title) => {
    const cleanTitle = title.replace(/<[^>]*>/g, '').replace(/[*_`]/g, '').trim()
    const id = cleanTitle
      .toLowerCase()
      .replace(/[^\w\s\u00C0-\u00FF-]/g, '')
      .replace(/[\s-]+/g, '-')
    return `<h2 id="${id}">${title}</h2>`
  })

  // Format Callouts [!NOTE], [!TIP], [!WARNING], [!IMPORTANT]
  html = html.replace(/<blockquote>\s*<p>\[!(NOTE|TIP|WARNING|IMPORTANT)\]\s*/gi, (match, type) => {
    const typeLower = type.toLowerCase()
    const titles = {
      note: 'Note',
      tip: 'Astuce',
      warning: 'Attention',
      important: 'Important'
    }
    return `<div class="callout callout-${typeLower}"><div class="callout-header"><span class="callout-title">${titles[typeLower]}</span></div><div class="callout-body"><p>`
  }).replace(/<\/p>\s*<\/blockquote>/gi, '</p></div></div>')

  return html
})

// Refetch if route param slug changes
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    fetchCourseContent(newSlug)
  }
})

// Dynamic DOM injection of copy buttons to code blocks
const addCopyButtons = () => {
  nextTick(() => {
    const container = document.querySelector('.course-body')
    if (!container) return

    const preBlocks = container.querySelectorAll('pre')
    preBlocks.forEach((pre) => {
      if (pre.querySelector('.copy-code-btn')) return

      const button = document.createElement('button')
      button.className = 'copy-code-btn'
      button.type = 'button'
      button.innerText = 'Copier'
      button.title = 'Copier le code dans le presse-papiers'

      button.addEventListener('click', async () => {
        const codeElement = pre.querySelector('code')
        const text = codeElement ? codeElement.innerText : pre.innerText

        try {
          await navigator.clipboard.writeText(text.trim())
          button.innerText = 'Copié !'
          button.classList.add('copied')

          setTimeout(() => {
            button.innerText = 'Copier'
            button.classList.remove('copied')
          }, 2000)
        } catch (err) {
          console.error('Failed to copy text: ', err)
        }
      })

      pre.appendChild(button)
    })
  })
}

// Watch both content parsing and loading states to inject buttons on DOM load
watch([parsedContent, loading], () => {
  if (!loading.value) {
    addCopyButtons()
    setupScrollSpy()
  }
}, { immediate: true })

// Scroll spy pour la TOC active
const setupScrollSpy = () => {
  nextTick(() => {
    const headings = document.querySelectorAll('.course-body h2[id]')
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            activeTocId.value = entry.target.id
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    headings.forEach(h => observer.observe(h))
  })
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Classe CSS pour la difficulté
const getDifficultyClass = (difficulty) => {
  if (!difficulty) return ''
  return `difficulty-${difficulty.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`
}

onMounted(() => {
  fetchCourseContent(route.params.slug)
})
</script>

<template>
  <div class="course-page animate-fade-in">

    <!-- Loading state -->
    <div v-if="loading" class="container">
      <div class="loading-state">
        <div class="spinner" role="status" aria-label="Chargement"></div>
        <p>Chargement du cours...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="container">
      <div class="error-state">
        <span style="font-size:2.5rem">⚠️</span>
        <h3>Erreur</h3>
        <p>{{ error }}</p>
        <router-link to="/" class="btn btn-primary">← Retour à l'accueil</router-link>
      </div>
    </div>

    <!-- Course content -->
    <template v-else>

      <!-- Contenu du cours -->
      <div class="course-layout">
        <div class="container">
          <div class="course-main">

            <!-- Downloadable Resources Box -->
            <div v-if="course.resources && course.resources.length > 0" class="resources-card">
              <span class="resources-title">📎 Ressources &amp; Exercices</span>
              <div class="resources-list">
                <a
                  v-for="(res, index) in course.resources"
                  :key="index"
                  :href="res.url"
                  target="_blank"
                  rel="noopener"
                  class="resource-item"
                >
                  ↓ {{ res.title || 'Ressource jointe' }}
                </a>
              </div>
            </div>

            <!-- Rendered Markdown -->
            <article class="course-body markdown-body" v-html="parsedContent"></article>

            <!-- Bottom Action Bar -->
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

