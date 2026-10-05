<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

const props = defineProps({
  title: {
    type: String,
    default: 'Quiz de validation des connaissances'
  },
  questions: {
    type: Array,
    required: true
    // Structure: [{ question: String, options: [String], answer: Number, explanation: String }]
  },
  count: {
    type: Number,
    default: 20 // Nombre de questions affichées aléatoirement parmi le pool
  }
})

const isCourseCompleted = ref(false)
const isModalOpen = ref(false)
const userAnswers = ref({})
const isSubmitted = ref(false)
const activeQuestions = ref([]) // sous-ensemble aléatoire affiché

// Mélange et sélectionne N questions parmi le pool
const shuffleQuestions = () => {
  const pool = [...props.questions]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  activeQuestions.value = pool.slice(0, Math.min(props.count, pool.length))
}

// --- Completion check ---
const checkCompletion = () => {
  const saved = localStorage.getItem('completed_courses')
  if (saved) {
    try {
      isCourseCompleted.value = JSON.parse(saved).includes(route.path)
    } catch {
      isCourseCompleted.value = false
    }
  } else {
    isCourseCompleted.value = false
  }
}

onMounted(() => {
  checkCompletion()
  // Signale à Layout.vue que cette page contient un quiz
  window.dispatchEvent(new CustomEvent('quiz-available'))
  window.addEventListener('course-completion-changed', checkCompletion)
  window.addEventListener('open-quiz-modal', openModal)
})
onUnmounted(() => {
  window.removeEventListener('course-completion-changed', checkCompletion)
  window.removeEventListener('open-quiz-modal', openModal)
  document.body.style.overflow = ''
})

// --- Modal ---
const openModal = () => {
  shuffleQuestions()
  resetQuiz()
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isModalOpen.value = false
  document.body.style.overflow = ''
}

// --- Quiz logic ---
const selectOption = (qIdx, optIdx) => {
  if (isSubmitted.value) return
  userAnswers.value[qIdx] = optIdx
}

const score = computed(() => {
  let s = 0
  activeQuestions.value.forEach((q, idx) => {
    if (userAnswers.value[idx] === q.answer) s++
  })
  return s
})

const allAnswered = computed(() =>
  activeQuestions.value.every((_, idx) => userAnswers.value[idx] !== undefined)
)

const resetQuiz = () => {
  shuffleQuestions()
  userAnswers.value = {}
  isSubmitted.value = false
}

const submitQuiz = () => {
  isSubmitted.value = true
}
</script>

<template>
  <!-- État verrouillé : visible dans le contenu si le cours n'est pas encore validé -->
  <div v-if="!isCourseCompleted" class="quiz-locked">
    <div class="quiz-locked-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    </div>
    <div class="quiz-locked-content">
      <p class="quiz-locked-title">Quiz disponible après validation</p>
      <p class="quiz-locked-hint">Marquez ce cours comme validé pour débloquer le quiz (bouton en haut).</p>
    </div>
  </div>
  <!-- Quand validé : rien dans le contenu, le bouton est dans la toolbar -->
  <!-- Modal -->
  <Teleport to="body">
    <Transition name="quiz-modal">
      <div v-if="isModalOpen" class="quiz-modal-overlay" @click.self="closeModal">
        <div class="quiz-modal">
          <!-- Header -->
          <div class="quiz-modal-header">
            <div>
              <div class="quiz-badge">Auto-évaluation</div>
              <h2 class="quiz-modal-title">{{ title }}</h2>
            </div>
            <button class="quiz-close-btn" @click="closeModal" title="Fermer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Questions -->
          <div class="quiz-modal-body">
            <div v-for="(q, qIdx) in activeQuestions" :key="qIdx" class="quiz-item">
              <div class="question-title">
                <span class="q-number">{{ qIdx + 1 }}.</span>
                <span>{{ q.question }}</span>
              </div>

              <div class="quiz-options">
                <button
                  v-for="(opt, optIdx) in q.options"
                  :key="optIdx"
                  class="quiz-option"
                  :class="{
                    'selected': userAnswers[qIdx] === optIdx,
                    'correct': isSubmitted && optIdx === q.answer,
                    'incorrect': isSubmitted && userAnswers[qIdx] === optIdx && optIdx !== q.answer
                  }"
                  @click="selectOption(qIdx, optIdx)"
                  :disabled="isSubmitted"
                >
                  <span class="opt-bullet">
                    <span v-if="isSubmitted && optIdx === q.answer">&#10003;</span>
                    <span v-else-if="isSubmitted && userAnswers[qIdx] === optIdx && optIdx !== q.answer">&#10007;</span>
                    <span v-else>{{ String.fromCharCode(65 + optIdx) }}</span>
                  </span>
                  <span class="opt-text">{{ opt }}</span>
                </button>
              </div>

              <div v-if="isSubmitted && q.explanation" class="quiz-explanation">
                <strong>Explication :</strong> {{ q.explanation }}
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="quiz-modal-footer">
            <div v-if="!isSubmitted" class="quiz-actions">
              <button class="btn-quiz primary" :disabled="!allAnswered" @click="submitQuiz">
                Vérifier mes réponses
              </button>
              <span v-if="!allAnswered" class="unanswered-hint">Répondez à toutes les questions pour valider</span>
            </div>

            <div v-else class="quiz-results">
              <div class="score-display">
                Score : <strong>{{ score }} / {{ activeQuestions.length }}</strong>
                <span v-if="score === activeQuestions.length" class="score-tag perfect">Parfait !</span>
                <span v-else-if="score >= activeQuestions.length / 2" class="score-tag good">Bon résultat</span>
                <span v-else class="score-tag retry">À revoir</span>
              </div>
              <div class="result-actions">
                <button class="btn-quiz outline" @click="resetQuiz">Recommencer</button>
                <button class="btn-quiz primary" @click="closeModal">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* === Locked state === */
.quiz-locked {
  margin: 2rem 0;
  padding: 18px 22px;
  border-radius: 12px;
  border: 1px dashed var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  gap: 14px;
}

.quiz-locked-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-3);
}

.quiz-locked-title {
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--vp-c-text-2);
  margin: 0 0 3px !important;
}

.quiz-locked-hint {
  font-size: 0.83rem;
  color: var(--vp-c-text-3);
  margin: 0 !important;
}

/* === Trigger block === */
.quiz-trigger-block {
  margin: 2rem 0;
  padding: 20px 24px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.quiz-trigger-badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--claude-peach-bg);
  color: var(--claude-peach-text);
  border: 1px solid var(--claude-peach-border);
  margin-bottom: 6px;
}

.quiz-trigger-title {
  font-weight: 600;
  font-size: 1rem;
  color: var(--vp-c-text-1);
  margin: 0 0 3px !important;
}

.quiz-trigger-hint {
  font-size: 0.83rem;
  color: var(--vp-c-text-3);
  margin: 0 !important;
}

.btn-open-quiz {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  background: var(--vp-c-brand-1);
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
  white-space: nowrap;
}

.btn-open-quiz:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.btn-open-quiz:active {
  transform: translateY(0);
}

/* === Modal overlay === */
.quiz-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(15, 15, 15, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.quiz-modal {
  background: var(--vp-c-bg);
  border-radius: 20px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18);
  width: 100%;
  max-width: 640px;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}

/* === Modal header === */
.quiz-modal-header {
  padding: 24px 28px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
}

.quiz-badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--claude-peach-bg);
  color: var(--claude-peach-text);
  border: 1px solid var(--claude-peach-border);
  margin-bottom: 6px;
}

.quiz-modal-title {
  font-family: var(--vp-font-family-heading) !important;
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  color: var(--vp-c-text-1) !important;
  margin: 0 !important;
  border-bottom: none !important;
  line-height: 1.3 !important;
}

.quiz-close-btn {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.quiz-close-btn:hover {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
}

/* === Modal body === */
.quiz-modal-body {
  padding: 24px 28px;
  overflow-y: auto;
  flex: 1;
}

.quiz-item {
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.quiz-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.question-title {
  font-weight: 600;
  font-size: 1rem;
  color: var(--vp-c-text-1);
  margin-bottom: 14px;
  display: flex;
  gap: 8px;
  line-height: 1.4;
}

.q-number {
  color: var(--vp-c-brand-1);
  flex-shrink: 0;
}

.quiz-options {
  display: grid;
  gap: 8px;
}

.quiz-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 15px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.92rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
}

.quiz-option:hover:not(:disabled) {
  background: var(--vp-c-bg-elv);
  border-color: var(--vp-c-brand-1);
}

.quiz-option.selected {
  background: var(--claude-peach-bg);
  border-color: var(--claude-peach-border);
  color: var(--claude-peach-text);
  font-weight: 600;
}

.quiz-option.correct {
  background: var(--claude-cactus-bg) !important;
  border-color: var(--claude-cactus-border) !important;
  color: var(--claude-cactus-text) !important;
  font-weight: 600;
}

.quiz-option.incorrect {
  background: #FFF1F0 !important;
  border-color: #FFA39E !important;
  color: #CF1322 !important;
}

.dark .quiz-option.incorrect {
  background: #2A1215 !important;
  border-color: #5C2223 !important;
  color: #FFA39E !important;
}

.opt-bullet {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.quiz-explanation {
  margin-top: 12px;
  padding: 11px 15px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  font-size: 0.86rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
  border-left: 3px solid var(--vp-c-brand-1);
}

/* === Modal footer === */
.quiz-modal-footer {
  padding: 18px 28px;
  border-top: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
  background: var(--vp-c-bg-soft);
}

.quiz-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.quiz-results {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.score-display {
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.score-tag {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
}

.score-tag.perfect {
  background: var(--claude-cactus-bg);
  color: var(--claude-cactus-text);
  border: 1px solid var(--claude-cactus-border);
}

.score-tag.good {
  background: var(--claude-peach-bg);
  color: var(--claude-peach-text);
  border: 1px solid var(--claude-peach-border);
}

.score-tag.retry {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.btn-quiz {
  padding: 9px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-quiz.primary {
  background: var(--vp-c-brand-1);
  color: #ffffff;
  border: 1px solid var(--vp-c-brand-1);
}

.btn-quiz.primary:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}

.btn-quiz.primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-quiz.outline {
  background: transparent;
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-border);
}

.btn-quiz.outline:hover {
  background: var(--vp-c-bg-elv);
  border-color: var(--vp-c-brand-1);
}

.unanswered-hint {
  font-size: 0.83rem;
  color: var(--vp-c-text-3);
}

/* === Transition === */
.quiz-modal-enter-active,
.quiz-modal-leave-active {
  transition: opacity 0.2s ease;
}

.quiz-modal-enter-active .quiz-modal,
.quiz-modal-leave-active .quiz-modal {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}

.quiz-modal-enter-from,
.quiz-modal-leave-to {
  opacity: 0;
}

.quiz-modal-enter-from .quiz-modal,
.quiz-modal-leave-to .quiz-modal {
  transform: translateY(16px) scale(0.97);
  opacity: 0;
}

@media (max-width: 640px) {
  .quiz-modal-overlay {
    padding: 10px;
  }
  .quiz-modal {
    max-height: 94vh;
    border-radius: 16px;
  }
  .quiz-modal-header {
    padding: 16px 18px 14px;
  }
  .quiz-modal-title {
    font-size: 1.1rem !important;
  }
  .quiz-modal-body {
    padding: 16px 18px;
  }
  .question-title {
    font-size: 0.94rem;
  }
  .quiz-option {
    padding: 9px 12px;
    font-size: 0.88rem;
    gap: 10px;
  }
  .opt-bullet {
    width: 24px;
    height: 24px;
    font-size: 0.75rem;
  }
  .quiz-modal-footer {
    padding: 14px 18px;
  }
  .quiz-actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 8px;
  }
  .quiz-actions .btn-quiz {
    width: 100%;
    text-align: center;
  }
  .quiz-results {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .result-actions {
    width: 100%;
  }
  .result-actions .btn-quiz {
    flex: 1;
    text-align: center;
  }
}
</style>
