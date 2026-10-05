import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function getCoursesSidebar() {
  const coursesDir = path.join(__dirname, '../courses')
  if (!fs.existsSync(coursesDir)) return []

  const files = fs.readdirSync(coursesDir).filter(f => f.endsWith('.md') && f !== 'index.md')

  const items = files.map(file => {
    const content = fs.readFileSync(path.join(coursesDir, file), 'utf-8')
    const { data } = matter(content)
    return {
      text: data.title || file.replace('.md', ''),
      link: `/courses/${file.replace('.md', '')}`,
      order: data.order || 99,
      category: data.category || 'Général'
    }
  }).sort((a, b) => a.order - b.order)

  const categories = {}
  items.forEach(item => {
    if (!categories[item.category]) categories[item.category] = []
    categories[item.category].push(item)
  })

  // Ordre logique d'affichage des sections
  const preferredOrder = [
    'n8n',
    'Intelligence Artificielle & Machine Learning'
  ]

  const sortedCats = Object.keys(categories).sort((a, b) => {
    const idxA = preferredOrder.indexOf(a)
    const idxB = preferredOrder.indexOf(b)
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB)
  })

  return sortedCats.map(cat => ({
    text: cat === 'n8n' ? 'Automatisation & Workflows (n8n)' : 'Intelligence Artificielle & Machine Learning',
    collapsed: false,
    items: categories[cat]
  }))
}

export default defineConfig({
  title: "MachLearn",
  description: "Plateforme d'apprentissage en ligne sur l'IA et le code, gratuite et open-source.",
  lastUpdated: true,
  lang: 'fr-FR',

  // Sitemap automatique pour Google
  sitemap: {
    hostname: 'https://machlearn.vercel.app'
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['link', { rel: 'shortcut icon', type: 'image/png', href: '/logo.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/logo.png' }],
    // Open Graph / SEO
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'MachLearn' }],
    ['meta', { property: 'og:url', content: 'https://machlearn.vercel.app' }],
    ['meta', { property: 'og:title', content: 'MachLearn | Cours gratuits sur l\'IA et le Machine Learning' }],
    ['meta', { property: 'og:description', content: 'Apprenez l\'intelligence artificielle, le deep learning, n8n et MLOps avec des cours gratuits, rigoureux et pratiques. PyTorch, Transformers, Docker - from scratch.' }],
    ['meta', { property: 'og:image', content: 'https://machlearn.vercel.app/logo.png' }],
    ['meta', { property: 'og:image:width', content: '1254' }],
    ['meta', { property: 'og:image:height', content: '1254' }],
    ['meta', { property: 'og:image:alt', content: 'MachLearn - Cours gratuits sur l\'IA et le Machine Learning' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: 'MachLearn, Cours gratuits sur l\'IA' }],
    ['meta', { name: 'twitter:description', content: 'IA, Machine Learning, Deep Learning, n8n - cours gratuits et open-source, machideau' }],
    ['meta', { name: 'twitter:image', content: 'https://machlearn.vercel.app/logo.png' }],
    // Mots-clés SEO
    ['meta', { name: 'keywords', content: 'machideau, machlearn, platforme machideau, samie, lefaure, intelligence artificielle, machine learning, deep learning, cours gratuits, n8n, automatisation, PyTorch, transformers, MLOps, Docker, FastAPI, formation IA, open source' }],
    ['meta', { name: 'author', content: 'Machideau' }],
    // Robots & indexation
    ['meta', { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' }],
    ['meta', { name: 'googlebot', content: 'index, follow' }],
    // Langue & région
    ['meta', { 'http-equiv': 'content-language', content: 'fr' }],
    ['meta', { property: 'og:locale', content: 'fr_FR' }],
    ['meta', { property: 'og:locale:alternate', content: 'en_US' }],
    // Couleur du thème (onglet mobile)
    ['meta', { name: 'theme-color', content: '#F5F3ED' }],
    ['meta', { name: 'msapplication-TileColor', content: '#F5F3ED' }],
    ['meta', { name: 'msapplication-TileImage', content: '/logo.png' }],
    // Canonical
    ['link', { rel: 'canonical', href: 'https://machlearn.vercel.app' }],
    // Description longue pour moteurs
    ['meta', { name: 'description', content: 'MachLearn : cours gratuits et open-source sur l\'intelligence artificielle, le machine learning, le deep learning, PyTorch, Transformers, n8n, MLOps, Docker et FastAPI. Apprenez from scratch avec des modules rigoureux et pratiques.' }],
    ['meta', { name: 'abstract', content: 'Plateforme d\'apprentissage gratuite sur l\'IA, le ML et l\'automatisation logicielle.' }],
    ['meta', { name: 'category', content: 'Education, Intelligence Artificielle, Technologie' }],
    ['meta', { name: 'classification', content: 'Education' }],
    ['meta', { name: 'subject', content: 'Intelligence Artificielle, Machine Learning, Deep Learning, Automatisation' }],
    ['meta', { name: 'coverage', content: 'Worldwide' }],
    ['meta', { name: 'distribution', content: 'Global' }],
    ['meta', { name: 'rating', content: 'General' }],
    ['meta', { name: 'revisit-after', content: '7 days' }],
    ['meta', { name: 'language', content: 'French' }],
    // Structured Data JSON-LD (WebSite + EducationalOrganization)
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "MachLearn",
      "url": "https://machlearn.vercel.app",
      "description": "Plateforme d'apprentissage gratuite sur l'IA, le machine learning et l'automatisation.",
      "inLanguage": "fr-FR",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://machlearn.vercel.app/courses/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    })],
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "MachLearn",
      "url": "https://machlearn.vercel.app",
      "logo": "https://machlearn.vercel.app/logo.png",
      "description": "Cours gratuits sur l'intelligence artificielle, le machine learning, le deep learning et l'automatisation.",
      "sameAs": ["https://github.com/machideau/cours_web"],
      "knowsAbout": [
        "Intelligence Artificielle", "Machine Learning", "Deep Learning",
        "PyTorch", "TensorFlow", "Transformers", "n8n", "MLOps", "Docker", "FastAPI"
      ]
    })],
    // Google Search Console
    ['meta', { name: 'google-site-verification', content: 'epcVCOZhiKE2jHCkBrc2TEvNe8vmt4EeCS_9SW4k4ig' }],
    [
      'script',
      {},
      `
        (function() {
          const userPref = localStorage.getItem('vitepress-theme-appearance');
          if (!userPref || userPref === 'auto') {
            localStorage.setItem('vitepress-theme-appearance', 'light');
            document.documentElement.classList.remove('dark');
          }
        })();
      `
    ]
  ],
  markdown: {
    math: true
  },
  themeConfig: {
    logo: { src: '/logo.png', alt: 'MachLearn' },
    siteTitle: false,
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Rechercher un cours...',
                buttonAriaLabel: 'Rechercher un cours'
              },
              modal: {
                noResultsText: 'Aucun résultat pour',
                resetButtonTitle: 'Effacer la recherche',
                footer: {
                  selectText: 'pour sélectionner',
                  navigateText: 'pour naviguer',
                  closeText: 'pour fermer'
                }
              }
            }
          }
        }
      }
    },
    outline: {
      level: [2, 3],
      label: 'Sur cette page'
    },
    docFooter: {
      prev: 'Module précédent',
      next: 'Module suivant'
    },
    darkModeSwitchLabel: 'Thème',
    sidebarMenuLabel: 'Menu des cours',
    returnToTopLabel: 'Haut de page',
    nav: [
      { text: 'Accueil', link: '/' },
      { text: 'Tous les cours', link: '/courses/' }
    ],
    sidebar: {
      '/courses/': getCoursesSidebar()
    },
    editLink: {
      pattern: 'https://github.com/machideau/cours_web/edit/main/docs/:path',
      text: 'Suggérer une modification sur GitHub'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/machideau/cours_web' }
    ],
    footer: {
      message: 'Propulsé par Machideau. Open Source et 100% gratuit.',
      copyright: 'Copyright © 2026'
    }
  }
})
