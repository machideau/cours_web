<script setup>
import { useSeo } from '../composables/useSeo.js'

useSeo({
  title: 'Page Introuvable - 404',
  description: 'La page que vous recherchez n\'existe pas.'
})
</script>

<template>
  <div class="not-found-page animate-fade-in" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8rem 1rem; text-align: center; min-height: 70vh;">
    <h1 style="font-size: clamp(5rem, 15vw, 8rem); font-weight: 900; color: var(--color-primary); margin-bottom: 0.5rem; line-height: 1; letter-spacing: -0.02em;">
      404
    </h1>
    <h2 style="font-size: clamp(1.5rem, 5vw, 2.5rem); font-family: var(--font-heading); font-weight: 700; margin-bottom: 1rem; color: var(--text-primary);">
      Page introuvable
    </h2>
    <p style="color: var(--text-secondary); font-size: 1.1rem; max-width: 450px; margin: 0 auto 2rem; line-height: 1.6;">
      Oups ! La page que vous recherchez semble avoir disparu, a été déplacée, ou elle n'a jamais existé.
    </p>
    <router-link to="/" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-size: 1rem; border-radius: var(--radius-btn);">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      Retourner à l'accueil
    </router-link>
  </div>
</template>
