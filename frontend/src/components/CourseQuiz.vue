<script setup>
import '../styles/quiz.css'

const props = defineProps({
  questions: { type: Array, required: true }
})

import { ref, computed, reactive } from 'vue'

const answers   = reactive({})
const submitted = ref(false)

const score = computed(() => {
  if (!submitted.value) return 0
  return props.questions.reduce((acc, q, i) => {
    return acc + (answers[i] === q.answer ? 1 : 0)
  }, 0)
})

const resultLevel = computed(() => {
  const ratio = score.value / props.questions.length
  if (ratio >= 0.8) return 'good'
  if (ratio >= 0.5) return 'average'
  return 'bad'
})

const resultMessage = computed(() => {
  const ratio = score.value / props.questions.length
  if (ratio >= 0.8) return 'Excellent ! Tu maîtrises bien ce cours.'
  if (ratio >= 0.5) return 'Pas mal, relisons quelques points.'
  return 'Relis le cours pour mieux comprendre.'
})

function select(qi, option) {
  if (!submitted.value) answers[qi] = option
}

function optionClass(qi, option) {
  if (!submitted.value) return answers[qi] === option ? 'selected' : ''
  const correct = props.questions[qi].answer
  if (option === correct)  return 'quiz-option correct'
  if (answers[qi] === option && option !== correct) return 'quiz-option wrong'
  return ''
}

function retry() {
  submitted.value = false
  Object.keys(answers).forEach(k => delete answers[k])
}
</script>

<template>
  <section class="quiz-section" v-if="questions.length">
    <h2 class="quiz-title">Quiz — Testez vos connaissances</h2>

    <div class="quiz-question" v-for="(q, qi) in questions" :key="qi">
      <p class="quiz-question-text">{{ qi + 1 }}. {{ q.question }}</p>
      <div class="quiz-options">
        <div
          v-for="option in q.options" :key="option"
          class="quiz-option"
          :class="[optionClass(qi, option), submitted ? 'disabled' : '']"
          @click="select(qi, option)"
        >
          <span class="quiz-badge" :class="submitted ? (option === q.answer ? 'badge-correct' : answers[qi] === option ? 'badge-wrong' : 'badge-neutral') : (answers[qi] === option ? 'badge-selected' : 'badge-neutral')"></span>
          {{ option }}
        </div>
      </div>
    </div>

    <div v-if="!submitted">
      <button class="btn btn-primary" @click="submitted = true" :disabled="Object.keys(answers).length < questions.length">
        Valider mes réponses
      </button>
    </div>

    <div v-else :class="['quiz-result', resultLevel]">
      <span>{{ resultMessage }}</span>
      <span>Score : {{ score }} / {{ questions.length }}</span>
      <button class="btn btn-outline" @click="retry">Réessayer</button>
    </div>
  </section>
</template>
