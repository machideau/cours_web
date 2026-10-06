---
title: "Exercice pratique - Séance 6 : Enrichis ton assistant commercial"
description: "Reprendre l'assistant commercial construit en séance 6 et lui ajouter deux fonctionnalités supplémentaires."
category: "n8n"
difficulty: "Avancé"
duration: "1h30"
order: 10
---

# Exercice pratique - Séance 6 : Enrichis ton assistant commercial

**Objectif :** reprendre l'assistant commercial construit en séance 6 et lui ajouter deux fonctionnalités supplémentaires, pour aller plus loin que la démonstration guidée.

Avant de commencer, assure-toi que ton workflow `Projet - Assistant Commercial` fonctionne correctement sur la branche `question_produit`, avec la vérification du stock et la génération de réponse.

---

## Partie A - Gérer la branche "commande"

Jusqu'ici, la branche `commande` du Switch ne fait rien de concret. Tu vas la compléter.

### A1 - Extraire les détails de la commande

1. Sur la branche `commande` du Switch, ajoute un node **Basic LLM Chain**
2. Prompt :
```
Voici la liste exacte des produits disponibles : "riz local 25kg", "huile palme 5L", "savon artisanal".

Le client a ecrit ce message de commande : "{{ $('Telegram Trigger').item.json.message.text }}"

Extrait les informations suivantes :
- produit (doit correspondre exactement a un nom de la liste, ou "inconnu" si aucun ne correspond)
- quantite (nombre entier, si mentionnee, sinon 1 par defaut)

Reponds uniquement avec un JSON de cette forme :
{ "produit": "...", "quantite": ... }
```
3. Ajoute un node **Edit Fields (Set)** pour nettoyer la sortie JSON, comme fait précédemment

### A2 - Vérifier si le stock est suffisant

1. Ajoute un node **Google Sheets**, operation `Get Row(s)`, sur la feuille `Catalogue Boutique`, filtré sur le produit extrait
2. Ajoute un node **IF** :
   - Condition : <code v-pre>{{ $json.stock_disponible }}</code> **supérieur ou égal à** <code v-pre>{{ $('Edit Fields').item.json.quantite }}</code>
3. Branche **True** : la commande peut être validée
4. Branche **False** : le stock est insuffisant

### A3 - Enregistrer la commande si elle est validée

1. Sur la branche **True**, ajoute un node **Google Sheets**, operation `Append Row`
2. Crée une feuille `Commandes Recues` avec les colonnes : `date`, `client_id`, `produit`, `quantite`, `statut`
3. Mappe `statut` = `"en attente de livraison"`

### A4 - Générer la réponse adaptée

1. Sur la branche **True**, ajoute un node **Basic LLM Chain** qui confirme la commande au client, en mentionnant le produit, la quantité et un message de remerciement
2. Sur la branche **False**, ajoute un node **Basic LLM Chain** qui informe poliment le client que la quantité demandée n'est pas disponible, et précise le stock réellement disponible

3. Reconnecte les deux branches vers l'envoi Telegram/WhatsApp déjà construit en séance 6 (node Send Message)

---

## Partie B - Ajouter une étape de validation humaine pour les réclamations

La branche `reclamation` est sensible : une réponse automatique mal calibrée peut aggraver une situation plutôt que l'apaiser. Tu vas donc ajouter une étape de validation humaine avant l'envoi.

### B1 - Générer une proposition de réponse

1. Sur la branche `reclamation` du Switch, ajoute un node **Basic LLM Chain**
2. Prompt :
```
Tu es un assistant qui aide une equipe a repondre a une reclamation client.

Voici le message du client : "{{ $('Telegram Trigger').item.json.message.text }}"

Redige une proposition de reponse empathique et professionnelle, qui reconnait le probleme et propose une prochaine etape concrete (verification, remboursement a confirmer, delai de reponse).
Ne promets rien que tu ne peux pas garantir (pas de date precise de remboursement par exemple).
```

### B2 - Envoyer la proposition à l'équipe pour validation (Gmail)

1. Ajoute un node **Gmail**, operation `Send and Wait for Response`
2. To : l'adresse email de l'équipe ou de toi-même pour le test
3. Subject : `Reclamation a valider`
4. Message : inclut le message original du client et la réponse proposée générée à l'étape B1
5. Configure les options de réponse (ex. "Approve" / "Reject", selon les options disponibles sur ce node)

### B3 - Envoyer la réponse uniquement si elle est validée

1. Ajoute un node **IF** après la réponse reçue, qui vérifie si l'option "Approve" a été choisie
2. Branche **True** : envoie la réponse générée au client via Telegram/WhatsApp
3. Branche **False** : le workflow s'arrête (ou notifie l'équipe qu'une intervention manuelle complète est nécessaire)

---

## Partie C - Tester l'ensemble

Envoie ces trois messages à ton bot, dans cet ordre, et vérifie le comportement de chaque branche :

1. `"Je commande 2 sacs de riz"` → doit passer par la vérification de stock et confirmer la commande
2. `"Je commande 50 sacs de riz"` → doit détecter un stock insuffisant et répondre en conséquence
3. `"Ma commande n'est jamais arrivee, c'est inadmissible"` → doit déclencher l'email de validation avant tout envoi au client

---

## Pièges fréquents à surveiller

| Symptôme | Cause probable |
|---|---|
| La quantité extraite est toujours 1 même quand elle est précisée | Le prompt de l'étape A1 n'insiste pas assez sur l'extraction numérique précise - ajoute un exemple dans le prompt pour cadrer |
| Le node "Send and Wait for Response" ne met pas le workflow en pause | Configuration du node incorrecte, ou webhook de reprise non accessible publiquement si ton instance n8n est locale |
| La commande est enregistrée même quand le stock est insuffisant | Vérifie que le node Append Row est bien connecté uniquement à la branche True du IF, et non aux deux branches |

---

## Ce que tu dois retenir de cet exercice

- Toutes les branches d'un Switch n'ont pas besoin du même niveau d'automatisation : une commande standard peut être traitée entièrement par l'IA, alors qu'une réclamation gagne à passer par une validation humaine avant l'envoi
- Vérifier une condition métier réelle (le stock suffisant) avant de confirmer quoi que ce soit au client évite de créer de fausses attentes
- Un assistant IA bien construit sait reconnaître ses limites et prévoir un chemin de secours (stock insuffisant, produit inconnu, situation sensible) plutôt que de toujours répondre de façon optimiste


---
## Quiz de validation

Testez vos connaissances sur cette séance !

<script setup>
import { seance6Quiz } from '../.vitepress/theme/data/n8n-quizzes.js'
</script>

<Quiz title="Quiz de validation - Séance 6 : Automatisation IA avancée" :questions="seance6Quiz" />
