<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const completedCourses = ref([])

const totalCourses = 18

const tracks = [
  {
    name: 'Automatisation & Workflows (n8n)',
    color: 'peach',
    courses: [
      '/courses/seance1-n8n-decouverte',
      '/courses/exercice-seance1-n8n',
      '/courses/seance2-n8n-fondamentaux',
      '/courses/seance3-n8n-apis-webhooks',
      '/courses/exercice-seance3-n8n'
    ]
  },
  {
    name: 'Machine Learning Classique',
    color: 'cactus',
    courses: [
      '/courses/math-numpy-pandas',
      '/courses/regression-lineaire-logistique',
      '/courses/arbres-random-forest-xgboost',
      '/courses/svm-knn-clustering',
      '/courses/feature-engineering-validation-metriques'
    ]
  },
  {
    name: 'Deep Learning & IA',
    color: 'cactus',
    courses: [
      '/courses/reseaux-neurones-from-scratch-pytorch-tensorflow',
      '/courses/fonctions-activation-deep-learning',
      '/courses/optimisation-avancee-adam-batchnorm-dropout',
      '/courses/cnn-reseaux-convolutifs-vision',
      '/courses/rnn-lstm-transformers',
      '/courses/transformers-architecture-complete',
      '/courses/hugging-face-modeles-pretraines'
    ]
  },
  {
    name: 'MLOps, Déploiement & Production',
    color: 'heather',
    courses: [
      '/courses/versioning-experimentation-mlflow',
      '/courses/deploiement-fastapi-docker',
      '/courses/monitoring-mise-a-jour-scalabilite'
    ]
  }
]

const loadProgress = () => {
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
  loadProgress()
  window.addEventListener('storage', loadProgress)
})

const completedCount = computed(() => completedCourses.value.length)
const percent = computed(() => Math.round((completedCount.value / totalCourses) * 100))

const getTrackProgress = (track) => {
  const completed = track.courses.filter(c => completedCourses.value.includes(c)).length
  const total = track.courses.length
  const pct = Math.round((completed / total) * 100)
  return { completed, total, pct }
}

const clearAllProgress = () => {
  if (confirm('Voulez-vous réinitialiser toute votre progression ?')) {
    completedCourses.value = []
    localStorage.removeItem('completed_courses')
  }
}
</script>

<template>
  <div v-if="isOpen" class="dash-modal-backdrop" @click.self="emit('close')">
    <div class="dash-modal">
      <div class="dash-header">
        <div>
          <span class="dash-tag">Statistiques d’apprentissage</span>
          <h2 class="dash-title">Tableau de Bord Personnel</h2>
        </div>
        <button class="btn-close" @click="emit('close')">&times;</button>
      </div>

      <div class="dash-body">
        <!-- Carte Résumé Global -->
        <div class="global-progress-card">
          <div class="global-progress-info">
            <div class="progress-big-number">{{ percent }}%</div>
            <div>
              <div class="progress-label">Progression Globale</div>
              <div class="progress-sub">{{ completedCount }} sur {{ totalCourses }} cours validés</div>
            </div>
          </div>
          <div class="progress-track-bar">
            <div class="progress-fill-bar" :style="{ width: percent + '%' }"></div>
          </div>
        </div>

        <!-- Détail par parcours -->
        <div class="tracks-list">
          <div v-for="t in tracks" :key="t.name" class="track-item">
            <div class="track-item-header">
              <span class="track-name">{{ t.name }}</span>
              <span class="track-badge" :class="t.color">
                {{ getTrackProgress(t).completed }} / {{ getTrackProgress(t).total }} ({{ getTrackProgress(t).pct }}%)
              </span>
            </div>
            <div class="track-bar">
              <div
                class="track-bar-fill"
                :class="t.color"
                :style="{ width: getTrackProgress(t).pct + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="dash-footer">
        <span class="privacy-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Données enregistrées localement dans votre navigateur (aucun compte requis)
        </span>
        <button v-if="completedCount > 0" class="btn-clear" @click="clearAllProgress">Réinitialiser</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dash-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(20, 20, 19, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.dash-modal {
  width: 100%;
  max-width: 600px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.dash-header {
  padding: 24px;
  border-bottom: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.dash-tag {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--claude-peach-bg);
  color: var(--claude-peach-text);
  border: 1px solid var(--claude-peach-border);
}

.dash-title {
  font-family: var(--vp-font-family-heading) !important;
  font-size: 1.6rem !important;
  font-weight: 600 !important;
  color: var(--vp-c-text-1) !important;
  margin: 6px 0 0 !important;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: var(--vp-c-text-2);
  cursor: pointer;
  padding: 4px 8px;
}

.dash-body {
  padding: 24px;
}

.global-progress-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 24px;
}

.global-progress-info {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 14px;
}

.progress-big-number {
  font-family: var(--vp-font-family-heading);
  font-size: 2.75rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  line-height: 1;
}

.progress-label {
  font-weight: 700;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.progress-sub {
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
}

.progress-track-bar {
  height: 8px;
  background: var(--vp-c-divider);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill-bar {
  height: 100%;
  background: var(--vp-c-brand-1);
  border-radius: 9999px;
  transition: width 0.4s ease;
}

.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.track-item {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 14px 16px;
}

.track-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.track-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.track-badge {
  font-size: 0.78rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}

.track-badge.peach {
  background: var(--claude-peach-bg);
  color: var(--claude-peach-text);
}

.track-badge.cactus {
  background: var(--claude-cactus-bg);
  color: var(--claude-cactus-text);
}

.track-badge.heather {
  background: var(--claude-heather-bg);
  color: var(--claude-heather-text);
}

.track-bar {
  height: 6px;
  background: var(--vp-c-divider);
  border-radius: 9999px;
  overflow: hidden;
}

.track-bar-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.4s ease;
}

.track-bar-fill.peach {
  background: #D97757;
}

.track-bar-fill.cactus {
  background: #396353;
}

.track-bar-fill.heather {
  background: #53526B;
}

.dash-footer {
  padding: 16px 24px;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.privacy-note {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-clear {
  background: transparent;
  border: none;
  font-size: 0.8rem;
  color: #CF1322;
  cursor: pointer;
  text-decoration: underline;
}
</style>
