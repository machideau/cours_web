---
title: "Exercice pratique - Séance 5 : Ton premier assistant IA dans n8n"
description: "Connecter un modèle d'IA à n8n et l'utiliser pour classifier un message, extraire des informations, et générer une réponse."
category: "n8n"
difficulty: "Intermédiaire"
duration: "45 min à 1h"
order: 8
---

# Exercice pratique - Séance 5 : Ton premier assistant IA dans n8n

**Objectif :** connecter un modèle d'IA à n8n et l'utiliser pour classifier un message, extraire des informations, et générer une réponse adaptée.

---

## Étape 0 - Préparer le credential

1. Si tu n'as pas encore de clé API, va sur **aistudio.google.com** (Gemini, gratuit avec quota) ou **openrouter.ai**
2. Dans n8n, crée un credential correspondant (**Google Gemini (PaLM) API** ou **OpenRouter API**) et colle ta clé

---

## Étape 1 - Créer le workflow

1. **Workflows** → **Add workflow**
2. Renomme-le : `Exercice - Assistant IA`

---

## Étape 2 - Simuler un message entrant

1. Ajoute un **Manual Trigger**
2. Ajoute un node **Edit Fields (Set)**, mode JSON, avec ce contenu :
```json
{
  "message": "Bonjour, je voudrais savoir si vous avez encore du riz local en stock, et combien coute le sac de 25kg ?"
}
```
3. Exécute le node

---

## Étape 3 - Classifier l'intention du message

1. Ajoute un node **Basic LLM Chain** (ou le node correspondant à ton fournisseur, ex. **Google Gemini Chat Model** branché sur un node Chain)
2. Credential : celui créé à l'étape 0
3. Prompt :
```
Tu es un assistant qui classe les messages recus par une boutique en ligne.

Classe le message suivant dans une seule de ces categories exactement :
"question_produit", "commande", "reclamation", "autre"

Message : "{{ $json.message }}"

Reponds uniquement avec un JSON de cette forme, sans aucun texte avant ou apres :
{ "categorie": "..." }
```
4. Exécute le node

**Vérification** : la sortie doit contenir un texte ressemblant à `{ "categorie": "question_produit" }`. Si du texte parasite apparaît autour, reformule le prompt en insistant davantage sur "sans aucun texte avant ou après", ou active le mode de sortie structurée si ton node le propose.

---

## Étape 4 - Transformer la sortie texte en JSON exploitable

1. Ajoute un node **Edit Fields (Set)**, mode JSON
2. Utilise une expression pour parser le texte renvoyé par le modèle :
```json
{
  "categorie": "={{ JSON.parse($json.text).categorie }}"
}
```
(le nom exact du champ contenant la réponse du modèle, `text` ici, peut varier selon le node utilisé - vérifie l'onglet Output du node précédent pour le nom exact du champ)

3. Exécute le node

**Vérification** : tu dois obtenir un champ `categorie` propre, sans les accolades ni guillemets superflus, prêt à être utilisé dans un IF ou un Switch.

---

## Étape 5 - Extraire les informations utiles du message

1. Ajoute un second node **Basic LLM Chain**
2. Prompt :
```
Extrait les informations suivantes du message ci-dessous :
- produit demande
- quantite demandee (si mentionnee, sinon null)

Message : "{{ $('Edit Fields').item.json.message }}"

Reponds uniquement avec un JSON de cette forme exacte :
{ "produit": "...", "quantite": ... }
```
3. Exécute le node

**Vérification** : la sortie doit identifier `riz` (ou `riz local`) comme produit, et `25kg` ou une valeur liée à la quantité si le modèle l'interprète ainsi - observe comment le modèle gère l'ambiguïté entre quantité en sac et poids.

---

## Étape 6 - Générer une réponse adaptée

1. Ajoute un troisième node **Basic LLM Chain**
2. Prompt :
```
Tu es un assistant commercial chaleureux pour une boutique en ligne togolaise qui vend des produits alimentaires locaux.

Un client a envoye ce message : "{{ $('Edit Fields').item.json.message }}"

Redige une reponse courte (maximum 3 phrases), polie et directe, qui repond a sa question.
Si tu n'as pas l'information exacte sur le stock ou le prix, dis que tu verifies et que tu reviens vers lui rapidement.
Ne mentionne jamais que tu es une intelligence artificielle.
```
3. Exécute le node

**Vérification** : lis la réponse générée à voix haute - est-ce que ça sonne naturel, poli, et surtout pas trop long pour un message WhatsApp ou Telegram ?

---

## Étape 7 - Router selon la catégorie (réutilisation de la séance 2)

1. Ajoute un node **Switch** juste après l'étape 4 (celle qui donne la `categorie` propre)
2. Configure 3 cas sur <code v-pre>{{ $json.categorie }}</code> : `question_produit`, `commande`, `reclamation`, avec une sortie fallback pour `autre`
3. Branche la sortie `question_produit` vers les étapes 5 et 6 construites plus haut
4. Pour les autres branches, ajoute simplement un node **NoOp** pour l'instant (elles seront développées en séance 6)

---

## Étape 8 - Tester avec plusieurs messages différents

Reviens à l'étape 2 et remplace le contenu du message par chacun de ces exemples, en relançant le workflow complet à chaque fois :

1. `"Je veux annuler ma commande du 3 octobre, elle n'est jamais arrivee"` → doit être classé en `reclamation`
2. `"Bonjour, je passe commande de 2 sacs de riz et 1 bidon d'huile"` → doit être classé en `commande`
3. `"Quels sont vos horaires d'ouverture ?"` → doit être classé en `autre`

Observe pour chaque cas si la classification est correcte, et note les cas où le modèle hésite ou se trompe.

---

## Pièges fréquents à surveiller

| Symptôme | Cause probable |
|---|---|
| `JSON.parse` renvoie une erreur | Le modèle a ajouté du texte autour du JSON - reformule le prompt ou ajoute une étape de nettoyage (extraire uniquement le texte entre la première `{` et la dernière `}`) |
| Catégorie toujours classée en "autre" | Orthographe des catégories différente entre le prompt et le Switch (attention aux accents et majuscules) |
| La réponse générée est trop longue | Contrainte de longueur pas assez insistante dans le prompt - renforce avec "strictement 2 phrases maximum" |
| Le modèle invente un prix ou un stock | Absence de consigne explicite dans le prompt pour les cas où l'information n'est pas connue - toujours prévoir cette instruction |

---

## Ce que tu dois retenir de cet exercice

- Un même message peut traverser plusieurs appels IA successifs, chacun avec un rôle précis (classifier, extraire, générer)
- La sortie d'un modèle est toujours du texte brut par défaut : tu dois explicitement forcer un format JSON si tu veux le réutiliser dans ton workflow
- Un prompt précis avec des contraintes claires (longueur, format, gestion de l'incertitude) réduit fortement les erreurs et les hallucinations
- Le Switch que tu connais déjà depuis la séance 2 se combine parfaitement avec une classification faite par l'IA, sans rien changer à sa logique


---
## Quiz de validation

Testez vos connaissances sur cette séance !

<script setup>
import { seance5Quiz } from '../.vitepress/theme/data/n8n-quizzes.js'
</script>

<Quiz title="Quiz de validation - Séance 5 : Introduire l'IA dans n8n" :questions="seance5Quiz" />
