---
title: "Séance 8 : Présentation et déploiement"
description: "Finaliser ton projet, gérer les erreurs, déployer et présenter ton travail."
category: "n8n"
difficulty: "Intermédiaire"
duration: "2h"
order: 12
---

# Séance 8 : Présentation et déploiement

**Objectif :** finaliser ton projet, apprendre à gérer les erreurs et les logs, comprendre ce que signifie réellement mettre un workflow en production, connaître les bonnes pratiques de sécurité, et présenter ton projet devant le groupe.

---

## 1. Finalisation des projets

Avant d'aller plus loin, reprends ton projet de la séance 7 et relis la grille d'auto-évaluation qui te a été donnée. Cette séance te donne les derniers outils pour combler ce qui manque encore : gestion d'erreurs, tests plus rigoureux, et préparation à l'activation réelle.

Prends 15 à 20 minutes en début de séance pour lister, par écrit, ce qui ne fonctionne pas encore parfaitement dans ton workflow. C'est cette liste qui va guider ton travail pendant le reste de la séance.

---

## 2. Correction des erreurs

### 2.1 Méthode de débogage à appliquer systématiquement

Quand un node ne fait pas ce que tu attends, suis toujours cet ordre :

1. Ouvre l'exécution concernée dans l'onglet **Executions**
2. Identifie le premier node, dans l'ordre d'exécution, dont la sortie ne correspond pas à ce que tu attendais
3. Clique sur ce node et compare son Input réel à ce que tu pensais qu'il recevait
4. Remonte d'un node si l'Input lui-même est déjà incorrect - le problème vient alors d'avant

Cette méthode évite l'erreur classique de débutant qui consiste à modifier le dernier node de la chaîne alors que le problème vient d'un node bien plus en amont.

### 2.2 Les erreurs les plus fréquentes à ce stade du parcours

| Type d'erreur | Exemple concret | Solution |
|---|---|---|
| Référence à un champ inexistant | <code v-pre>{{ $json.produit }}</code> alors que le champ s'appelle `Produit` avec une majuscule | Vérifier l'orthographe exacte dans l'onglet Output du node précédent |
| Credential expiré ou invalide | Token OAuth Google expiré après une période d'inactivité | Reconnecter le credential depuis le menu Credentials |
| JSON mal formé renvoyé par l'IA | Le modèle ajoute du texte autour de l'objet JSON attendu | Renforcer le prompt, ou ajouter un node de nettoyage avant le parsing |
| Node qui ne reçoit aucun item | Une branche IF ou Switch en amont n'a laissé passer aucun item | Vérifier la condition, tester avec des données qui doivent matcher cette branche |
| Boucle infinie sur un Loop | La sortie "loop" reconnectée vers le mauvais node | Vérifier que la boucle revient bien vers l'entrée du node Loop lui-même |

---

## 3. Gestion des erreurs

### 3.1 Pourquoi prévoir la gestion d'erreurs

Un workflow qui fonctionne uniquement quand tout se passe bien n'est pas prêt pour la production. Une API externe peut être temporairement indisponible, un champ peut arriver vide, une donnée peut être mal formée : ton workflow doit réagir proprement à ces situations plutôt que de simplement planter sans explication.

### 3.2 Le paramètre "Continue On Fail" / "On Error"

Sur chaque node, dans l'onglet des paramètres (souvent sous "Settings" ou une icône dédiée), tu trouves une option pour définir le comportement en cas d'erreur :
- **Stop Workflow** (comportement par défaut) : l'exécution s'arrête complètement
- **Continue (using error output)** : le node bascule la donnée vers une sortie d'erreur dédiée, que tu peux brancher séparément (par exemple vers une notification d'alerte)
- **Continue (using previous input)** : le workflow continue en utilisant les données reçues avant l'étape qui a échoué

### 3.3 Le node Error Trigger

En plus de la gestion au niveau d'un node individuel, n8n permet de créer un workflow séparé déclenché automatiquement par le node **Error Trigger**, qui s'active dès qu'un workflow configuré pour le faire rencontre une erreur non gérée.

**Cas d'usage concret**
Un workflow dédié "Gestion des erreurs" qui reçoit l'information d'un échec ailleurs dans ton système, et qui t'envoie une notification Telegram immédiate pour que tu puisses intervenir rapidement.

**Comment l'activer sur ton workflow principal**
Dans les paramètres du workflow (menu "..." en haut à droite → "Settings"), un champ permet de désigner quel workflow doit être appelé en cas d'erreur ("Error Workflow").

### 3.4 Retry automatique

Pour les nodes qui dépendent d'un service externe parfois instable (API, webhook), active l'option **Retry on Fail**, disponible dans les paramètres du node, en définissant un nombre de tentatives et un délai entre chaque tentative. Cela évite qu'une simple coupure momentanée de quelques secondes fasse échouer tout ton workflow.

---

## 4. Logs

### 4.1 Ce que les logs d'exécution t'apprennent

Chaque exécution conservée dans l'onglet **Executions** constitue un log détaillé : statut, durée, données exactes à chaque étape. C'est ta première source d'information en cas de problème signalé après la mise en production.

### 4.2 Bonnes pratiques de consultation des logs

- Filtre les exécutions par statut (succès/erreur) pour repérer rapidement les cas problématiques
- Pour un workflow actif depuis un moment, consulte régulièrement les exécutions en erreur, même sans alerte explicite, pour détecter des problèmes silencieux
- Conserve une trace de ce que tu as observé et corrigé (un simple fichier de notes personnelles suffit) pour ne pas refaire le même diagnostic plusieurs fois

### 4.3 Politique de rétention des exécutions

Par défaut, n8n conserve un historique limité des exécutions (la durée exacte dépend de la configuration de ton instance ou de ton plan cloud). Pour un workflow en production critique, pense à archiver ou exporter périodiquement les données importantes générées par ton workflow (par exemple dans Google Sheets, comme tu le fais déjà), plutôt que de dépendre uniquement de l'historique des exécutions.

---

## 5. Tests

### 5.1 Pourquoi tester au-delà du cas idéal

Jusqu'ici, tu as surtout testé tes workflows avec des données que tu as toi-même écrites pour qu'elles fonctionnent. Avant une mise en production, tu dois tester avec des données volontairement difficiles ou inattendues.

### 5.2 Checklist de test avant activation

- Message ou donnée vide
- Message très long ou très court
- Caractères spéciaux, accents, émojis dans un champ texte
- Une valeur numérique attendue mais reçue comme texte (ou l'inverse)
- Une demande totalement hors sujet par rapport à ce que ton workflow est censé traiter (test important si une étape IA fait de la classification)
- Deux déclenchements presque simultanés, si ton workflow doit pouvoir gérer plusieurs exécutions en parallèle

### 5.3 Test en environnement réel vs test interne

Avant d'activer un workflow qui communique avec de vraies personnes (clients, prospects), fais un dernier test avec une personne de confiance de ton entourage plutôt que toi-même uniquement - elle formulera naturellement des messages que tu n'aurais pas anticipés.

---

## 6. Activation d'un workflow

### 6.1 Le bouton Active

Un workflow reste inactif par défaut après sa création. Le toggle "Active" en haut à droite de l'éditeur doit être activé pour que les triggers automatiques (Schedule, Webhook de production, Telegram/WhatsApp Trigger) fonctionnent sans que tu aies besoin d'ouvrir l'éditeur.

### 6.2 Différence entre URL de test et URL de production (rappel)

Pour un Webhook, l'URL de test ne fonctionne que pendant que tu cliques sur "Listen for test event" dans l'éditeur ouvert. Seule l'URL de production, active uniquement quand le workflow est activé, fonctionne en continu, même l'éditeur fermé.

### 6.3 Vérification post-activation

Après avoir activé ton workflow, fais un dernier test réel (envoie un vrai message, soumets un vrai formulaire) sans avoir l'éditeur ouvert, pour confirmer que tout fonctionne bien en conditions de production et pas seulement pendant que tu observais l'exécution en direct.

---

## 7. Introduction au déploiement

### 7.1 Ce que "déployer" signifie concrètement avec n8n

Déployer, dans ce contexte, consiste à s'assurer que ton instance n8n (cloud ou self-hosted) tourne de façon fiable, continue, et accessible, pour que tes workflows actifs fonctionnent réellement en permanence.

### 7.2 n8n Cloud vs self-hosted

| Critère | n8n Cloud | Self-hosted |
|---|---|---|
| Mise en place | Immédiate, aucune installation | Nécessite un serveur, une installation, une maintenance |
| Coût | Abonnement selon le volume d'exécutions | Coût du serveur uniquement, pas de limite artificielle |
| Maintenance | Prise en charge par n8n | À ta charge (mises à jour, sauvegardes, sécurité du serveur) |
| Contrôle des données | Hébergées chez n8n | Totalement sous ton contrôle |

Pour un premier projet ou un usage personnel/petite structure, n8n Cloud reste le choix le plus simple. Le self-hosted devient pertinent quand le volume d'exécutions dépasse les coûts d'un abonnement cloud, ou quand la confidentialité des données exige un contrôle total.

### 7.3 Points de vigilance pour un déploiement self-hosted (aperçu)

- Mettre en place HTTPS pour sécuriser l'accès à l'éditeur et aux webhooks
- Sauvegarder régulièrement la base de données contenant tes workflows et credentials
- Garder l'instance à jour pour bénéficier des correctifs de sécurité

---

## 8. Bonnes pratiques

### 8.1 Organisation des workflows

- Donne des noms clairs et cohérents à tes workflows et à tes nodes
- Utilise des sticky notes pour documenter les sections complexes
- Regroupe les workflows liés dans des dossiers/projets si ton instance le permet

### 8.2 Gestion des versions

Avant une modification importante sur un workflow déjà actif, duplique-le ou exporte une copie de sauvegarde, pour pouvoir revenir en arrière rapidement en cas de problème après la modification.

### 8.3 Limiter les appels inutiles

Un trigger de type polling (Google Sheets Trigger, Gmail Trigger) configuré avec un intervalle trop court consomme des ressources et des quotas d'API inutilement. Règle l'intervalle selon le besoin réel de réactivité, pas systématiquement au minimum possible.

---

## 9. Sécurité des credentials

### 9.1 Principes fondamentaux déjà vus, à rappeler ici en synthèse

- Ne jamais coder une clé API en dur dans un champ texte ou une note
- Toujours utiliser les Credentials dédiés de n8n, qui chiffrent les informations sensibles
- Donner aux credentials les scopes/permissions minimaux nécessaires, jamais plus que ce dont le workflow a réellement besoin

### 9.2 Sécuriser spécifiquement tes webhooks

- Évite les chemins (paths) devinables (`/webhook` est trop générique ; préfère quelque chose comme `/wh-7f3a9d`)
- Vérifie une signature ou un secret partagé quand le service source le permet (vu pour WhatsApp en séance 4)
- Ajoute systématiquement une étape de validation des données reçues avant tout traitement sensible, pour te protéger de requêtes malformées ou malveillantes

### 9.3 Qui a accès à quoi

Si tu travailles en équipe sur la même instance n8n, vérifie régulièrement qui a accès à quels credentials et workflows. Un credential partagé sans nécessité réelle est un risque évitable.

---

## 10. Limites de l'automatisation

Il est important de terminer ce parcours avec un regard honnête sur ce que l'automatisation ne remplace pas :

- **Le jugement humain dans les situations ambiguës** : une réclamation complexe, une situation émotionnellement chargée, une décision aux conséquences importantes méritent une intervention humaine, pas une réponse automatique, même bien construite
- **La fiabilité à 100%** : une API externe peut tomber, un modèle d'IA peut se tromper, un credential peut expirer - un système automatisé demande une surveillance continue, pas un abandon total
- **La confiance aveugle dans l'IA** : chaque sortie d'un modèle de langage doit être considérée comme une proposition à vérifier dans les contextes sensibles (financier, médical, légal, ou tout ce qui engage réellement quelqu'un), jamais comme une vérité automatique
- **Le remplacement total d'une relation humaine** : dans un contexte commercial ou de support, l'automatisation gère bien le volume et la répétition, mais la relation de confiance durable reste construite par des humains

Garder cette lucidité fait justement la différence entre quelqu'un qui sait utiliser n8n, et quelqu'un qui sait concevoir une automatisation réellement responsable et utile.

---

## 11. Présentation des projets

### 11.1 Ce qu'une bonne présentation doit couvrir

Pour présenter ton projet devant le groupe, structure ton intervention (5 à 10 minutes, selon le nombre de participants) autour de ces points :

1. **Le problème de départ** : quelle tâche répétitive ou quel besoin réel ton projet résout-il ?
2. **Le schéma général** : montre le canvas complet de ton workflow, en expliquant brièvement chaque grande section
3. **Une démonstration en direct** : déclenche réellement ton workflow devant le groupe, avec un cas qui fonctionne bien
4. **Un cas limite géré** : montre aussi comment ton workflow réagit face à une donnée difficile ou un cas d'échec, pour démontrer que tu as pensé à la robustesse, pas seulement au cas idéal
5. **Ce que tu ferais ensuite** : une ou deux améliorations que tu ajouterais avec plus de temps

### 11.2 Ce qui rend une présentation convaincante

- Montrer le workflow en fonctionnement réel plutôt que de simplement décrire ce qu'il fait
- Être honnête sur les limites actuelles de ton projet plutôt que de les dissimuler
- Pouvoir répondre à une question du type "que se passe-t-il si..." sans être pris au dépourvu, parce que tu as réellement testé ces cas

---

## Ce que tu retiens de l'ensemble du parcours

En huit séances, tu es parti de la question "qu'est-ce que l'automatisation ?" jusqu'à la construction d'un projet complet combinant triggers, logique conditionnelle, connexions aux outils du quotidien, et intelligence artificielle, avec une attention portée à la gestion des erreurs et à la sécurité. La compétence la plus durable que tu gardes de cette formation n'est pas de connaître tous les nodes de n8n par cœur, mais la méthode : décomposer un besoin réel en petites étapes testables, vérifier les données à chaque transition, et toujours garder un regard critique sur ce qu'une automatisation - avec ou sans IA - peut réellement garantir.
