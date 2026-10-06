<template>
  <div class="home-section-container">
    <div class="home-section-header">
      <h2 class="home-section-title">Parcours d'apprentissage phares</h2>
      <a href="/courses/" class="home-section-link">Voir tous les parcours &rarr;</a>
    </div>

    <div class="academy-grid">
      <a href="/courses/seance1-n8n-decouverte" class="academy-card">
        <div class="academy-card-thumb peach">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <div class="academy-card-body">
          <span class="academy-card-tag peach">Automatisation & Workflows</span>
          <div class="academy-card-title">Maîtriser n8n de A à Z</div>
          <div class="academy-card-desc">Apprenez à orchestrer des flux automatisés, connecter des APIs et concevoir des webhooks sécurisés.</div>
          <div class="academy-card-meta">
            <span>Durée : 3 séances · Pratique</span>
            <span>Gratuit</span>
          </div>
        </div>
      </a>

      <a href="/courses/reseaux-neurones-from-scratch-pytorch-tensorflow" class="academy-card">
        <div class="academy-card-thumb cactus">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </div>
        <div class="academy-card-body">
          <span class="academy-card-tag cactus">Deep Learning & IA</span>
          <div class="academy-card-title">Réseaux de neurones & Transformers</div>
          <div class="academy-card-desc">Implémentez la rétropropagation, les fonctions d'activation modernes, les CNN et l'architecture Attention.</div>
          <div class="academy-card-meta">
            <span>Durée : 8 modules · PyTorch</span>
            <span>From Scratch</span>
          </div>
        </div>
      </a>

      <a href="/courses/deploiement-fastapi-docker" class="academy-card">
        <div class="academy-card-thumb heather">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
          </svg>
        </div>
        <div class="academy-card-body">
          <span class="academy-card-tag heather">MLOps & Production</span>
          <div class="academy-card-title">Déploiement & Monitoring IA</div>
          <div class="academy-card-desc">Servez vos modèles avec FastAPI et Docker, suivez les versions avec MLflow et détectez la dérive de données.</div>
          <div class="academy-card-meta">
            <span>Durée : 4 modules · MLOps</span>
            <span>Production-Ready</span>
          </div>
        </div>
      </a>
    </div>
  </div>

  <div class="about-manifesto">
    <div class="about-manifesto-quote">
      « Pas de formation payante, pas de certificat commercial à vendre - juste des ressources utiles, accessibles à tous et rédigées avec soin pour ceux qui souhaitent réellement apprendre. »
    </div>
    <div class="about-manifesto-author">
      <div class="about-avatar">
        <img src="/logo.png" alt="MachLearn" />
      </div>
      <div>
        <div class="about-author-name">MachLearn</div>
        <div class="about-author-desc">Plateforme d'apprentissage ouverte et collaborative · Code libre sur GitHub</div>
      </div>
    </div>
  </div>
</template>
