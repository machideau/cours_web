<script setup>
import { ref, computed, onMounted } from 'vue'

const activeCategory = ref('all')
const searchQuery = ref('')
const completedCourses = ref([])

const courses = [
  // n8n
  {
    title: 'Découverte & Prise en main de n8n',
    desc: 'Comprendre les nœuds, les triggers, et construire son premier workflow automatisé de bout en bout.',
    link: '/courses/seance1-n8n-decouverte',
    category: 'n8n',
    tag: 'Séance 1 · Débutant',
    theme: 'peach',
    duration: '1h30',
    type: 'Pratique',
    icon: 'n8n'
  },
  {
    title: 'Exercice : Mon premier workflow n8n',
    desc: 'Cas d’usage complet pour manipuler les requêtes HTTP et structurer une réponse automatisée.',
    link: '/courses/exercice-seance1-n8n',
    category: 'n8n',
    tag: 'Exercice · n8n',
    theme: 'peach',
    duration: '45m',
    type: 'Exercice',
    icon: 'code'
  },
  {
    title: 'Fondamentaux & Logique de flux',
    desc: 'Manipulation de données JSON, boucles, conditions (IF/Switch) et transformation avancée.',
    link: '/courses/seance2-n8n-fondamentaux',
    category: 'n8n',
    tag: 'Séance 2 · Intermédiaire',
    theme: 'peach',
    duration: '2h00',
    type: 'Pratique',
    icon: 'flow'
  },
  {
    title: 'APIs REST, Webhooks & Intégrations',
    desc: 'Connecter des services tiers, concevoir des webhooks sécurisés et gérer les erreurs en temps réel.',
    link: '/courses/seance3-n8n-apis-webhooks',
    category: 'n8n',
    tag: 'Séance 3 · Avancé',
    theme: 'peach',
    duration: '2h30',
    type: 'Pratique',
    icon: 'api'
  },
  {
    title: 'Exercice : APIs et Webhooks',
    desc: 'Mise en pratique approfondie sur la réception et l’envoi de payloads webhook réels.',
    link: '/courses/exercice-seance3-n8n',
    category: 'n8n',
    tag: 'Exercice · n8n',
    theme: 'peach',
    duration: '1h00',
    type: 'Exercice',
    icon: 'code'
  },

  // Deep Learning & IA
  {
    title: 'Fondations Mathématiques, NumPy et Pandas',
    desc: 'Algèbre linéaire, calcul matriciel, vecteurs, statistiques fondamentales et manipulation tabulaire.',
    link: '/courses/math-numpy-pandas',
    category: 'dl',
    tag: 'Module 1 · Fondations',
    theme: 'cactus',
    duration: '2h30',
    type: 'Maths & Code',
    icon: 'math'
  },
  {
    title: 'Régression Linéaire et Logistique',
    desc: 'Descente de gradient, fonction de coût, classification binaire et multi-classes.',
    link: '/courses/regression-lineaire-logistique',
    category: 'ml',
    tag: 'Module 2 · Machine Learning',
    theme: 'cactus',
    duration: '2h15',
    type: 'Algorithmes',
    icon: 'chart'
  },
  {
    title: 'Arbres de Décision, Random Forest & XGBoost',
    desc: 'Critère de Gini, entropie, bagging, boosting et optimisation d’hyperparamètres.',
    link: '/courses/arbres-random-forest-xgboost',
    category: 'ml',
    tag: 'Module 3 · Ensembles',
    theme: 'cactus',
    duration: '2h30',
    type: 'Arbres & Forêts',
    icon: 'tree'
  },
  {
    title: 'SVM, k-NN et Clustering (k-means, DBSCAN)',
    desc: 'Marges maximales, noyaux, apprentissage non supervisé et segmentation de données.',
    link: '/courses/svm-knn-clustering',
    category: 'ml',
    tag: 'Module 4 · Non-Supervisé',
    theme: 'cactus',
    duration: '2h00',
    type: 'Clustering',
    icon: 'cluster'
  },
  {
    title: 'Feature Engineering & Validation Croisée',
    desc: 'Standardisation, encodage, imputation, matrices de confusion, ROC-AUC et F1-score.',
    link: '/courses/feature-engineering-validation-metriques',
    category: 'ml',
    tag: 'Module 5 · Données',
    theme: 'cactus',
    duration: '2h15',
    type: 'Méthodologie',
    icon: 'check'
  },
  {
    title: 'Réseaux de Neurones : From Scratch',
    desc: 'Forward pass, rétropropagation manuelle du gradient, implémentation PyTorch et TensorFlow.',
    link: '/courses/reseaux-neurones-from-scratch-pytorch-tensorflow',
    category: 'dl',
    tag: 'Module 6 · Deep Learning',
    theme: 'cactus',
    duration: '3h00',
    type: 'NumPy & PyTorch',
    icon: 'network'
  },
  {
    title: 'Fonctions d’Activation en Deep Learning',
    desc: 'Sigmoïde, ReLU, Leaky ReLU, ELU, GELU, Swish et Softmax. Résoudre le vanishing gradient.',
    link: '/courses/fonctions-activation-deep-learning',
    category: 'dl',
    tag: 'Module 7 · Théorie DL',
    theme: 'cactus',
    duration: '1h45',
    type: 'Théorie & Code',
    icon: 'wave'
  },
  {
    title: 'Optimisation Avancée : Adam, BatchNorm, Dropout',
    desc: 'Momentum, RMSprop, AdamW, régularisation et techniques de stabilisation de l’entraînement.',
    link: '/courses/optimisation-avancee-adam-batchnorm-dropout',
    category: 'dl',
    tag: 'Module 8 · Optimisation',
    theme: 'cactus',
    duration: '2h30',
    type: 'PyTorch',
    icon: 'tune'
  },
  {
    title: 'CNN : Réseaux Convolutifs pour la Vision',
    desc: 'Filtres, convolutions, pooling, architectures ResNet et transfert d’apprentissage.',
    link: '/courses/cnn-reseaux-convolutifs-vision',
    category: 'dl',
    tag: 'Module 9 · Vision',
    theme: 'cactus',
    duration: '3h00',
    type: 'Vision par ordinateur',
    icon: 'eye'
  },
  {
    title: 'RNN, LSTM et Transformers',
    desc: 'Modélisation séquentielle, mémoire à long terme, mécanisme d’attention et architecture Transformer.',
    link: '/courses/rnn-lstm-transformers',
    category: 'dl',
    tag: 'Module 10 · NLP & Séries',
    theme: 'cactus',
    duration: '3h15',
    type: 'NLP',
    icon: 'seq'
  },
  {
    title: 'Transformers : Architecture Complète en Profondeur',
    desc: 'Multi-Head Attention, encodage positionnel, couche feed-forward et décodage autorégressif.',
    link: '/courses/transformers-architecture-complete',
    category: 'dl',
    tag: 'Module 11 · Transformers',
    theme: 'cactus',
    duration: '4h00',
    type: 'Architecture Avancée',
    icon: 'ai'
  },
  {
    title: 'Hugging Face : Modèles Pré-entraînés & Fine-tuning',
    desc: 'Pipelines Hugging Face, tokenizers, LoRA/PEFT et adaptation fine de LLM.',
    link: '/courses/hugging-face-modeles-pretraines',
    category: 'dl',
    tag: 'Module 12 · LLM & NLP',
    theme: 'cactus',
    duration: '3h00',
    type: 'Hugging Face',
    icon: 'hf'
  },

  // MLOps & Production
  {
    title: 'Versioning & Tracking avec MLflow',
    desc: 'Tracer les hyperparamètres, versionner les artefacts de modèles et gérer le registre de déploiement.',
    link: '/courses/versioning-experimentation-mlflow',
    category: 'mlops',
    tag: 'Module 13 · MLOps',
    theme: 'heather',
    duration: '2h00',
    type: 'MLflow',
    icon: 'track'
  },
  {
    title: 'Déploiement de Modèles : FastAPI et Docker',
    desc: 'Créer une API REST performante, conteneuriser avec Docker et servir des inférences en production.',
    link: '/courses/deploiement-fastapi-docker',
    category: 'mlops',
    tag: 'Module 14 · Déploiement',
    theme: 'heather',
    duration: '2h30',
    type: 'Docker & FastAPI',
    icon: 'docker'
  },
  {
    title: 'Monitoring, Drift et Scalabilité',
    desc: 'Détecter la dérive des données (concept drift), métriques Prometheus et réentraînement continu.',
    link: '/courses/monitoring-mise-a-jour-scalabilite',
    category: 'mlops',
    tag: 'Module 15 · Production',
    theme: 'heather',
    duration: '2h15',
    type: 'Monitoring',
    icon: 'monitor'
  }
]

const categories = [
  { id: 'all', label: 'Tous les cours', count: courses.length },
  { id: 'n8n', label: 'Automatisation (n8n)', count: courses.filter(c => c.category === 'n8n').length },
  { id: 'dl', label: 'Deep Learning & IA', count: courses.filter(c => c.category === 'dl').length },
  { id: 'ml', label: 'Machine Learning Classique', count: courses.filter(c => c.category === 'ml').length },
  { id: 'mlops', label: 'MLOps & Déploiement', count: courses.filter(c => c.category === 'mlops').length }
]

const loadSavedProgress = () => {
  const saved = localStorage.getItem('completed_courses')
  if (saved) {
    try {
      completedCourses.value = JSON.parse(saved)
    } catch (e) {
      completedCourses.value = []
    }
  }
}

onMounted(() => {
  loadSavedProgress()
})

const isCompleted = (path) => {
  return completedCourses.value.includes(path)
}

const filteredCourses = computed(() => {
  return courses.filter(c => {
    const matchesCat = activeCategory.value === 'all' || c.category === activeCategory.value
    const matchesSearch = searchQuery.value.trim() === '' ||
      c.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.tag.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCat && matchesSearch
  })
})
</script>

<template>
  <div class="courses-explorer">
    <!-- Barre de recherche et filtres de catégories -->
    <div class="explorer-controls">
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par concept, mot-clé ou outil (ex: Docker, PyTorch, n8n)..."
          class="search-input"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">&times;</button>
      </div>

      <div class="filter-pills">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="filter-pill"
          :class="{ 'active': activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          <span>{{ cat.label }}</span>
          <span class="pill-count">{{ cat.count }}</span>
        </button>
      </div>
    </div>

    <!-- Compteur de résultats -->
    <div class="results-meta">
      <span>{{ filteredCourses.length }} cours disponible{{ filteredCourses.length > 1 ? 's' : '' }}</span>
      <span v-if="completedCourses.length > 0" class="completed-counter">
        {{ courses.filter(c => isCompleted(c.link)).length }} / {{ courses.length }} terminé{{ courses.filter(c => isCompleted(c.link)).length > 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Grille des cours -->
    <div class="academy-grid">
      <a
        v-for="c in filteredCourses"
        :key="c.link"
        :href="c.link"
        class="academy-card"
        :class="{ 'is-completed': isCompleted(c.link) }"
      >
        <div class="academy-card-thumb" :class="c.theme">
          <div v-if="isCompleted(c.link)" class="completed-seal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Validé</span>
          </div>

          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <template v-if="c.theme === 'peach'">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </template>
            <template v-else-if="c.theme === 'cactus'">
              <circle cx="12" cy="12" r="9"></circle>
              <line x1="12" y1="3" x2="12" y2="21"></line>
            </template>
            <template v-else>
              <rect x="2" y="2" width="20" height="20" rx="4"></rect>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </template>
          </svg>
        </div>

        <div class="academy-card-body">
          <span class="academy-card-tag" :class="c.theme">{{ c.tag }}</span>
          <div class="academy-card-title">{{ c.title }}</div>
          <div class="academy-card-desc">{{ c.desc }}</div>
          <div class="academy-card-meta">
            <span>Durée : {{ c.duration }}</span>
            <span>{{ c.type }}</span>
          </div>
        </div>
      </a>
    </div>

    <!-- Message aucun résultat -->
    <div v-if="filteredCourses.length === 0" class="no-results">
      <p>Aucun cours ne correspond à votre recherche "<strong>{{ searchQuery }}</strong>".</p>
      <button @click="searchQuery = ''; activeCategory = 'all'" class="btn-reset">Réinitialiser les filtres</button>
    </div>
  </div>
</template>

<style>
.courses-explorer {
  margin-top: 1.5rem;
}

.explorer-controls {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 44px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  font-family: var(--vp-font-family-base);
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.clear-search {
  position: absolute;
  right: 14px;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: var(--vp-c-text-3);
  cursor: pointer;
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 9999px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.filter-pill:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-3);
}

.filter-pill.active {
  background: #141413;
  color: #FFFFFF;
  border-color: #141413;
  font-weight: 600;
}

.dark .filter-pill.active {
  background: #F5F3ED;
  color: #141413;
  border-color: #F5F3ED;
}

.pill-count {
  font-size: 0.75rem;
  padding: 1px 6px;
  border-radius: 9999px;
  background: rgba(125, 125, 125, 0.15);
}

.filter-pill.active .pill-count {
  background: rgba(255, 255, 255, 0.25);
  color: #FFFFFF;
}

.dark .filter-pill.active .pill-count {
  background: rgba(0, 0, 0, 0.15);
  color: #141413;
}

.results-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin-bottom: 1rem;
  padding: 0 4px;
}

.completed-counter {
  color: var(--claude-cactus-text);
  font-weight: 600;
}

.completed-seal {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: var(--claude-cactus-bg);
  color: var(--claude-cactus-text);
  border: 1px solid var(--claude-cactus-border);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.no-results {
  text-align: center;
  padding: 48px 16px;
  background: var(--vp-c-bg-elv);
  border: 1px dashed var(--vp-c-divider);
  border-radius: 16px;
}

.btn-reset {
  margin-top: 12px;
  padding: 8px 16px;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #FFFFFF;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

/* ===== ACADEMY GRID & CARDS ===== */

.academy-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 2rem 0;
}

.academy-card {
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  overflow: hidden;
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease;
}

.academy-card:hover {
  transform: translateY(-4px);
  border-color: rgba(217, 119, 87, 0.4);
  box-shadow: 0 16px 32px -8px rgba(20, 20, 19, 0.08);
}

.academy-card-thumb {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--vp-c-divider);
}

.academy-card-thumb.peach {
  background: linear-gradient(135deg, #FBF5F2 0%, #F5E2D8 100%);
  color: #D97757;
}

.dark .academy-card-thumb.peach {
  background: linear-gradient(135deg, #2A1E1A 0%, #3D2820 100%);
  color: #E08568;
}

.academy-card-thumb.cactus {
  background: linear-gradient(135deg, #F4F8F6 0%, #DEE9E5 100%);
  color: #396353;
}

.dark .academy-card-thumb.cactus {
  background: linear-gradient(135deg, #182A24 0%, #213A31 100%);
  color: #8BB8A8;
}

.academy-card-thumb.heather {
  background: linear-gradient(135deg, #F6F6F9 0%, #E6E5EE 100%);
  color: #53526B;
}

.dark .academy-card-thumb.heather {
  background: linear-gradient(135deg, #232230 0%, #313042 100%);
  color: #B4B2D0;
}

.academy-card-body {
  padding: 22px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.academy-card-tag {
  align-self: flex-start;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 6px;
  margin-bottom: 12px;
}

.academy-card-tag.peach {
  background: var(--claude-peach-bg);
  color: var(--claude-peach-text);
  border: 1px solid var(--claude-peach-border);
}

.academy-card-tag.cactus {
  background: var(--claude-cactus-bg);
  color: var(--claude-cactus-text);
  border: 1px solid var(--claude-cactus-border);
}

.academy-card-tag.heather {
  background: var(--claude-heather-bg);
  color: var(--claude-heather-text);
  border: 1px solid var(--claude-heather-border);
}

.academy-card-title {
  font-family: var(--vp-font-family-heading);
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
}

.academy-card-desc {
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  flex: 1;
  margin-bottom: 18px;
}

.academy-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 14px;
}

/* ===== RESPONSIVE ===== */

@media (max-width: 768px) {
  .academy-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 640px) {
  .academy-grid {
    grid-template-columns: 1fr !important;
    gap: 16px;
  }

  .academy-card-thumb {
    height: 110px;
  }

  .academy-card-body {
    padding: 16px;
  }

  .academy-card-title {
    font-size: 1.05rem;
  }

  .academy-card-desc {
    font-size: 0.88rem;
  }

  .explorer-header {
    margin-bottom: 24px;
  }
  .search-box {
    margin-bottom: 16px;
  }
  .search-input {
    padding: 10px 14px 10px 40px;
    font-size: 0.9rem;
  }
  .filter-pills {
    gap: 6px;
  }
  .filter-pill {
    padding: 6px 10px;
    font-size: 0.78rem;
    gap: 6px;
  }
  .results-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    font-size: 0.8rem;
  }
}
</style>
