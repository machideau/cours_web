export const seance1Quiz = [
  {
    question: "Quel composant déclenche obligatoirement le démarrage d'un workflow dans n8n ?",
    options: ["Un node d'action (HTTP Request, Code)", "Un node Trigger (Webhook, Schedule, Manual)", "Un connecteur de base de données", "Une variable d'environnement"],
    answer: 1,
    explanation: "Tout workflow dans n8n doit commencer par un Trigger qui définit quand et comment le flux s'exécute."
  },
  {
    question: "Sous quel format circulent les données entre chaque nœud dans n8n ?",
    options: ["En CSV brut", "En XML", "En tableau d'objets JSON", "En binaire compressé"],
    answer: 2,
    explanation: "n8n fait transiter l'ensemble des données d'étape en étape sous forme d'un tableau d'objets JSON."
  },
  {
    question: "Où doit-on stocker une clé d'API pour éviter de l'exposer en clair dans un workflow ?",
    options: ["Dans un commentaire du node", "Dans la section Credentials de n8n", "Dans le titre du workflow", "Dans le corps de la requête HTTP"],
    answer: 1,
    explanation: "Le gestionnaire de Credentials chiffre et protège vos secrets en base de données."
  },
  {
    question: "Quelle est la différence principale entre n8n et Zapier ?",
    options: ["n8n ne supporte pas les webhooks", "n8n est uniquement en cloud", "n8n est open-source et auto-hébergeable (self-hosted)", "Zapier est plus puissant pour le code"],
    answer: 2,
    explanation: "n8n est open-source et peut être hébergé sur votre propre serveur (Docker, VPS), offrant contrôle total et confidentialité des données."
  },
  {
    question: "Que représente un 'node' dans n8n ?",
    options: ["Un serveur distant", "Une étape de traitement ou d'action dans le workflow", "Un fichier de configuration YAML", "Un utilisateur de la plateforme"],
    answer: 1,
    explanation: "Chaque node représente une étape : il reçoit des données, effectue une action ou transformation, et transmet le résultat au node suivant."
  },
  {
    question: "Comment s'appelle le panneau latéral qui liste tous les nodes disponibles dans n8n ?",
    options: ["Node Browser / Nodes Library", "Node Panel", "Plugin Store", "Node Manager"],
    answer: 0,
    explanation: "Le Node Browser (ou bibliothèque de nodes) permet de rechercher et d'ajouter n'importe quel connecteur ou utilitaire à votre workflow."
  },
  {
    question: "Qu'est-ce qu'une 'execution' dans n8n ?",
    options: ["La phase de développement d'un workflow", "Une instance d'exécution du workflow avec ses données et son statut", "L'exportation d'un workflow en JSON", "La suppression d'un credential"],
    answer: 1,
    explanation: "Une execution est un run du workflow : elle capture les données d'entrée/sortie de chaque node, la durée, le statut et d'éventuelles erreurs."
  },
  {
    question: "Quel trigger faut-il utiliser pour exécuter un workflow manuellement pour tester depuis l'éditeur n8n ?",
    options: ["Schedule Trigger", "Webhook Trigger", "Manual Trigger / 'Test workflow'", "Cron Trigger"],
    answer: 2,
    explanation: "Le Manual Trigger (ou 'When clicking Test workflow') permet de lancer manuellement une exécution de test depuis le canvas."
  },
  {
    question: "Dans l'interface n8n, comment relie-t-on deux nodes entre eux ?",
    options: ["Par un fichier de configuration", "En glissant-déposant un lien depuis la sortie d'un node vers l'entrée du suivant", "En écrivant du code JavaScript", "En leur donnant le même nom"],
    answer: 1,
    explanation: "On relie les nodes en tirant une connexion depuis le connecteur de sortie (à droite) d'un node vers l'entrée (à gauche) du suivant."
  },
  {
    question: "Quelle syntaxe n8n permet d'accéder au champ 'nom' de l'item courant ?",
    options: ["{{ $json.nom }}", "{{ $data.nom }}", "{{ $item.nom }}", "{{ $node.nom }}"],
    answer: 0,
    explanation: "$json représente l'objet JSON de l'item en cours de traitement. {{ $json.nom }} retourne la valeur associée à la clé 'nom'."
  },
  {
    question: "Qu'est-ce qu'un workflow 'actif' dans n8n ?",
    options: ["Un workflow en cours d'édition par un utilisateur", "Un workflow qui s'exécute automatiquement en production selon son trigger", "Un workflow partagé avec d'autres utilisateurs", "Un workflow sans aucun warning"],
    answer: 1,
    explanation: "Activer un workflow (toggle 'Active') signifie qu'il écoute en continu ses déclencheurs (Webhook, Schedule, etc.) et traite les flux en production."
  },
  {
    question: "Quel node n8n utilise-t-on pour appeler n'importe quelle API HTTP/REST externe ?",
    options: ["API Connector", "Fetch Data", "HTTP Request", "REST Client"],
    answer: 2,
    explanation: "Le node 'HTTP Request' est le composant universel de n8n pour envoyer des requêtes HTTP (GET, POST, PUT, DELETE) vers n'importe quelle API."
  },
  {
    question: "Combien de triggers principaux initient généralement le flux d'un workflow n8n ?",
    options: ["Exactement un trigger initial", "Deux triggers minimum", "Autant qu'on veut sans restriction", "Aucun, les triggers sont optionnels"],
    answer: 0,
    explanation: "Un workflow standard commence par un trigger de départ qui initie l'exécution du flux."
  },
  {
    question: "Où peut-on consulter l'historique détaillé des runs passés avec leurs données ?",
    options: ["Dans l'onglet 'Executions'", "Dans le terminal du serveur uniquement", "Dans les paramètres du compte", "Dans le fichier config.json"],
    answer: 0,
    explanation: "L'onglet 'Executions' liste tous les runs passés (succès et échecs) avec l'état exact des données à chaque étape."
  },
  {
    question: "Quel est l'avantage principal d'utiliser le système de Credentials plutôt que d'écrire les clés API en dur ?",
    options: ["Améliorer la vitesse de calcul", "Réutiliser le credential sur plusieurs nodes et sécuriser le partage/export sans exposer les clés", "Changer automatiquement le format des données", "Permettre le mode hors ligne"],
    answer: 1,
    explanation: "Les Credentials isolent les secrets : lors de l'export d'un workflow en JSON pour partage, les clés secrètes ne sont pas incluses."
  },
  {
    question: "Comment s'appelle l'espace graphique infini sur lequel on dispose les nodes ?",
    options: ["Le Dashboard", "Le Canvas (la toile)", "Le Studio", "La Grid"],
    answer: 1,
    explanation: "Le Canvas est la zone de dessin et de modélisation visuelle des workflows n8n."
  },
  {
    question: "Que se passe-t-il par défaut si un node rencontre une erreur d'exécution ?",
    options: ["Le workflow s'arrête immédiatement et l'exécution passe en statut d'erreur", "Le node est ignoré silencieusement", "Le workflow redémarre depuis le début", "Le serveur n8n redémarre"],
    answer: 0,
    explanation: "Par défaut, une erreur stoppe immédiatement l'exécution. On peut toutefois activer l'option 'Continue On Fail' pour poursuivre."
  },
  {
    question: "Quelle est la syntaxe correcte pour une expression n8n combinant du texte et une variable ?",
    options: ["'Bonjour ' + $json.prenom", "{{ 'Bonjour ' + $json.prenom }}", "concat('Bonjour', $json.prenom)", "[$json.prenom, 'Bonjour']"],
    answer: 1,
    explanation: "Les expressions n8n sont délimitées par des doubles accolades {{ ... }} dans lesquelles on peut écrire des expressions JavaScript."
  },
  {
    question: "Dans le modèle de données de n8n, qu'est-ce qu'un 'item' ?",
    options: ["Un fichier binaire uniquement", "Un objet JSON individuel au sein du flux de données", "Un node inactif", "Une ligne de log"],
    answer: 1,
    explanation: "Dans n8n, les données circulent sous forme de liste d'items ([ { json: { ... } }, ... ]). Chaque item est un objet de données."
  },
  {
    question: "Quel node n8n permet d'attendre un délai précis (ex: 10 secondes) ou un événement externe ?",
    options: ["Delay", "Pause", "Wait", "Sleep"],
    answer: 2,
    explanation: "Le node 'Wait' permet de suspendre temporairement l'exécution pendant une durée spécifiée ou jusqu'à la réception d'un webhook de reprise."
  },
  {
    question: "Comment teste-t-on un node individuel sans exécuter l'ensemble des nodes suivants ?",
    options: ["Ce n'est pas possible dans n8n", "En cliquant sur 'Test step' (Tester l'étape) à l'intérieur du node", "En déconnectant tous les autres nodes", "En mettant n8n en mode debug"],
    answer: 1,
    explanation: "Le bouton 'Test step' dans le panneau du node permet d'exécuter uniquement ce node avec les données en entrée disponibles."
  },
  {
    question: "Peut-on exporter un workflow n8n sous forme de fichier pour le sauvegarder ou le partager ?",
    options: ["Non, c'est impossible", "Oui, au format JSON", "Oui, uniquement en PDF", "Oui, uniquement via une base SQL"],
    answer: 1,
    explanation: "n8n permet d'exporter et d'importer des workflows au format JSON standard, ce qui facilite le versioning Git et le partage."
  },
  {
    question: "Quelle méthode permet d'accéder aux données produites par un node précédent nommé 'MonNode' ?",
    options: ["{{ $('MonNode').item.json.monChamp }}", "{{ $previous.monChamp }}", "{{ $history['MonNode'] }}", "{{ $MonNode.monChamp }}"],
    answer: 0,
    explanation: "La syntaxe {{ $('Nom Du Node').item.json.cle }} permet de cibler les données issues de n'importe quel node précédent dans la branche."
  },
  {
    question: "Qu'apporte l'auto-hébergement (self-hosting) de n8n par rapport à une solution SaaS propriétaire ?",
    options: ["Aucune maintenance requise", "Contrôle total sur l'infrastructure, conformité RGPD/confidentialité et absence de limites strictes de volume imposées par un tiers", "Une interface différente", "L'impossibilité d'utiliser des APIs"],
    answer: 1,
    explanation: "Le self-hosting offre la souveraineté complète sur les données et élimine les coûts par exécution des plateformes SaaS propriétaires."
  },
  {
    question: "Quel composant n8n permet d'exécuter du code JavaScript ou Python personnalisé ?",
    options: ["Script Node", "Code Node", "Eval Node", "FunctionRunner"],
    answer: 1,
    explanation: "Le node 'Code' permet d'écrire du JavaScript ou du Python natif pour manipuler les données avec une flexibilité totale."
  }
]

export const seance2Quiz = [
  {
    question: "Quel trigger permet d'exécuter un workflow à intervalles réguliers (ex: tous les jours à 8h) ?",
    options: ["Webhook Trigger", "Schedule Trigger", "Manual Trigger", "Email Trigger"],
    answer: 1,
    explanation: "Le Schedule Trigger permet de planifier des exécutions régulières via des intervalles simples ou des expressions Cron."
  },
  {
    question: "Dans le node IF, comment sont orientés les items selon que la condition est vraie ou fausse ?",
    options: ["L'exécution s'arrête", "Les items passent par la sortie 'true' ou 'false'", "Les items sont tous dupliqués", "Une exception est levée"],
    answer: 1,
    explanation: "Le node IF sépare les items vers deux sorties distinctes : la sortie 'true' (condition remplie) et 'false' (condition non remplie)."
  },
  {
    question: "Comment accède-t-on à la valeur d'un champ 'email' dans l'item courant via une expression n8n ?",
    options: ["{{ $json.email }}", "{{ $data.email }}", "{{ $env.email }}", "{{ $item.email }}"],
    answer: 0,
    explanation: "{{ $json.email }} permet d'extraire la propriété 'email' de l'objet JSON de l'item en cours."
  },
  {
    question: "À quoi sert le node 'Switch' dans n8n comparé au node IF ?",
    options: ["À basculer entre environnement de test et de production", "À router des items vers plus de 2 sorties selon plusieurs règles de comparaison", "À désactiver un workflow", "À inverser l'ordre des items"],
    answer: 1,
    explanation: "Le node Switch permet de définir de multiples règles et branches de sortie (plus de 2), idéal pour router par catégorie, statut ou type d'événement."
  },
  {
    question: "Que fait le node 'Merge' dans un workflow n8n ?",
    options: ["Il combine les données provenant de deux branches ou sources différentes", "Il supprime les doublons uniquement", "Il crypte les données", "Il transforme le JSON en XML"],
    answer: 0,
    explanation: "Le node Merge rassemble les données de deux flux d'entrée selon différents modes (Append, Combine, Choose Branch, etc.)."
  },
  {
    question: "Comment accède-t-on à un champ imbriqué 'ville' dans `{ client: { adresse: { ville: 'Lomé' } } }` ?",
    options: ["{{ $json.client_adresse_ville }}", "{{ $json.client.adresse.ville }}", "{{ $json[client][adresse][ville] }}", "{{ $json->client->adresse->ville }}"],
    answer: 1,
    explanation: "On utilise la notation pointée standard JavaScript : {{ $json.client.adresse.ville }}."
  },
  {
    question: "Quel node permet de découper une liste d'items pour les traiter par petits paquets (lots) ?",
    options: ["Split In Batches (Loop Over Items)", "Batch Filter", "Slice Node", "Chunk List"],
    answer: 0,
    explanation: "Le node 'Loop Over Items / Split In Batches' découpe une liste d'items en lots de taille définie pour respecter les quotas d'API."
  },
  {
    question: "Quelle méthode JavaScript peut-on utiliser dans une expression n8n pour mettre du texte en minuscules ?",
    options: ["{{ $json.nom.lower() }}", "{{ $json.nom.toLowerCase() }}", "{{ to_lower($json.nom) }}", "{{ $json.nom.toSmall() }}"],
    answer: 1,
    explanation: "n8n exécute du JavaScript moderne : les méthodes standards des chaînes comme .toLowerCase(), .toUpperCase(), .trim() sont disponibles."
  },
  {
    question: "Quel est le rôle du node 'Edit Fields (Set)' dans n8n ?",
    options: ["Modifier le mot de passe utilisateur", "Créer, modifier ou supprimer des champs dans les items JSON du flux", "Éditer le titre du workflow", "Changer les identifiants d'accès"],
    answer: 1,
    explanation: "Le node 'Edit Fields (Set)' permet de structurer les données : ajouter de nouveaux champs, renommer ou supprimer des propriétés existantes."
  },
  {
    question: "Dans une condition de node IF, quel opérateur teste si une valeur n'est ni null, ni vide, ni undefined ?",
    options: ["Is Empty", "Is Not Empty / Exists", "Equals 0", "Is Type String"],
    answer: 1,
    explanation: "L'opérateur 'Is Not Empty' ou 'Exists' valide la présence d'une valeur effective dans la propriété testée."
  },
  {
    question: "Que fait l'expression `{{ $json.tags.join(', ') }}` si $json.tags vaut `['n8n', 'API', 'Automate']` ?",
    options: ["Elle produit la chaîne 'n8n, API, Automate'", "Elle génère une erreur", "Elle retourne un tableau", "Elle fusionne les nodes"],
    answer: 0,
    explanation: "La méthode .join(', ') rassemble les éléments du tableau en une seule chaîne avec la virgule et l'espace comme séparateur."
  },
  {
    question: "Dans le node 'Code', quelle variable représente l'ensemble des items arrivant en entrée ?",
    options: ["$items / $input.all()", "$data.all()", "$stream", "$payload"],
    answer: 0,
    explanation: "Dans le node Code de n8n, $input.all() retourne la liste complète des items d'entrée avec leur structure `{ json: { ... } }`."
  },
  {
    question: "Comment n8n traite-t-il par défaut un node d'action lorsqu'il reçoit une liste de 5 items ?",
    options: ["Il n'exécute l'action que sur le premier item", "Il exécute automatiquement l'action 5 fois (une fois par item)", "Il attend une confirmation manuelle", "Il bloque en boucle infinie"],
    answer: 1,
    explanation: "Le moteur n8n est conçu pour itérer automatiquement sur chaque item de la liste reçue par un node d'action."
  },
  {
    question: "À quoi sert le node 'Filter' dans n8n ?",
    options: ["À supprimer les doublons de manière aléatoire", "À ne conserver que les items répondant à des critères spécifiques", "À compresser les images", "À bloquer les requêtes malveillantes"],
    answer: 1,
    explanation: "Le node Filter évalue chaque item et ne laisse passer dans le flux que ceux qui respectent les conditions définies."
  },
  {
    question: "Comment formater une date dans une expression n8n (ex: transformer un timestamp en date lisible) ?",
    options: ["{{ DateTime.fromISO($json.date).toFormat('dd/MM/yyyy') }} ou via Luxon", "{{ format_date($json.date) }}", "{{ $json.date.dateString() }}", "{{ toDate($json.date) }}"],
    answer: 0,
    explanation: "n8n intègre nativement la bibliothèque de gestion de dates Luxon (DateTime) dans toutes ses expressions."
  },
  {
    question: "Quel mode du node 'Merge' permet de fusionner deux listes en associant les items ayant un identifiant commun ?",
    options: ["Append", "Combine by Position", "Combine by Fields (Key Match)", "Choose Branch"],
    answer: 2,
    explanation: "Le mode 'Combine by Fields' effectue l'équivalent d'un JOIN SQL en associant les items ayant la même valeur pour une clé donnée."
  },
  {
    question: "Que retourne l'expression `{{ $json.prix * 1.2 }}` si $json.prix vaut 100 ?",
    options: ["'1001.2'", "120", "undefined", "NaN"],
    answer: 1,
    explanation: "Les expressions n8n effectuent des calculs arithmétiques JavaScript : 100 * 1.2 donne 120."
  },
  {
    question: "Comment gérer le cas où un champ peut être manquant sans provoquer d'erreur dans une expression ?",
    options: ["En utilisant l'opérateur de chaînage optionnel `{{ $json?.client?.email || 'N/A' }}`", "En écrivant obligatoirement un script Python", "En créant 5 nodes IF consécutifs", "C'est impossible dans n8n"],
    answer: 0,
    explanation: "Le chaînage optionnel (?.) et les valeurs de repli (|| ou ??) évitent les erreurs 'Cannot read property of undefined'."
  },
  {
    question: "Dans le node 'Sort', que peut-on faire ?",
    options: ["Trier les items par ordre croissant ou décroissant selon un ou plusieurs champs", "Filtrer les items négatifs", "Mélanger les nœuds du canvas", "Trier les credentials"],
    answer: 0,
    explanation: "Le node Sort permet d'ordonner la liste des items selon des critères alphabétiques, numériques ou de date."
  },
  {
    question: "Quel node permet d'éliminer les items redondants dans une liste selon un champ clé (ex: email) ?",
    options: ["Remove Duplicates", "Unique Node", "Item Dedup", "Filter Clean"],
    answer: 0,
    explanation: "Le node 'Remove Duplicates' filtre la liste pour ne garder qu'une seule occurrence de chaque item selon les champs choisis."
  },
  {
    question: "Que fait l'option 'Keep Only Set' dans le node Edit Fields ?",
    options: ["Elle conserve uniquement les champs configurés dans le node et supprime tous les autres champs de l'item", "Elle garde le node verrouillé", "Elle conserve les données de test", "Elle sauvegarde le workflow"],
    answer: 0,
    explanation: "'Keep Only Set' permet d'épurer l'objet JSON en ne gardant que les propriétés explicitement définies dans le node."
  },
  {
    question: "Comment tester si une chaîne $json.message contient le mot 'urgence' dans une expression ?",
    options: ["{{ $json.message.includes('urgence') }}", "{{ $json.message.has('urgence') }}", "{{ in_array('urgence', $json.message) }}", "{{ $json.message.searchWord('urgence') }}"],
    answer: 0,
    explanation: ".includes() est la méthode standard JavaScript pour tester la présence d'une sous-chaîne dans un texte."
  },
  {
    question: "Quelle est la structure minimale d'un item retourné par un node Code en mode 'Run Once for All Items' ?",
    options: ["Un tableau d'objets avec la propriété `json` : `return [{ json: { ... } }]`", "Une simple chaîne de caractères", "Un objet vide `{}`", "Un booléen `true`"],
    answer: 0,
    explanation: "n8n exige que chaque item soit un objet contenant une propriété `json` encapsulant les données : `return [{ json: { key: value } }]`."
  },
  {
    question: "Que permet de faire le node 'Aggregate' (ou Item Lists) ?",
    options: ["Rassembler les valeurs d'un champ réparties sur plusieurs items dans un tableau unique", "Compter le nombre de serveurs", "Calculer le ping réseau", "Supprimer les items vides"],
    answer: 0,
    explanation: "Le node Item Lists / Aggregate permet de regrouper plusieurs items en un seul tableau ou de séparer un tableau en items distincts."
  },
  {
    question: "Pourquoi est-il crucial de tester un workflow avec des jeux de données variés (vides, volumineux, mal formés) ?",
    options: ["Pour s'assurer de sa robustesse face aux cas limites et éviter les arrêts inattendus en production", "Pour valider la licence n8n", "Pour accélérer le rendu du canvas", "Ce n'est pas nécessaire si le premier test passe"],
    answer: 0,
    explanation: "Tester des cas limites (champs manquants, listes vides, caractères spéciaux) garantit la fiabilité en conditions réelles de production."
  }
]

export const seance3Quiz = [
  {
    question: "Quelle méthode HTTP doit-on utiliser pour récupérer une ressource sans la modifier ?",
    options: ["POST", "PUT", "GET", "DELETE"],
    answer: 2,
    explanation: "La méthode GET est conçue pour lire et récupérer des données sans effet de bord ni modification sur le serveur."
  },
  {
    question: "Que signifie le status code HTTP 200 ?",
    options: ["Ressource créée avec succès", "Requête traitée avec succès (OK)", "Redirection permanente", "Erreur interne du serveur"],
    answer: 1,
    explanation: "200 OK indique que la requête a été reçue, comprise et traitée avec succès par le serveur."
  },
  {
    question: "Quel status code HTTP indique qu'une nouvelle ressource a été créée suite à un POST ?",
    options: ["200", "201 Created", "204 No Content", "202 Accepted"],
    answer: 1,
    explanation: "201 Created est le code standard retourné par une API lorsqu'une ressource a été créée avec succès."
  },
  {
    question: "Quelle est la différence fondamentale entre une API polling et un Webhook ?",
    options: ["Un webhook utilise XML, une API utilise JSON", "Un webhook envoie les données en temps réel lors d'un événement (Push), alors qu'une API est interrogée périodiquement (Pull)", "Un webhook ne nécessite jamais de sécurité", "Une API ne peut pas envoyer de données"],
    answer: 1,
    explanation: "Le Webhook fonctionne en mode 'Push' (temps réel déclenché par l'émetteur), évitant d'interroger en boucle un serveur (Polling/Pull)."
  },
  {
    question: "Que configure-t-on dans les 'Headers' d'une requête HTTP ?",
    options: ["Le corps principal des données", "Les métadonnées de la requête (Content-Type, Authorization, Accept, etc.)", "Le nom du workflow n8n", "La liste des destinataires"],
    answer: 1,
    explanation: "Les headers HTTP transmettent les métadonnées techniques indispensables : type de contenu, jeton d'authentification, encodage, etc."
  },
  {
    question: "Que signifie le status code HTTP 401 Unauthorized ?",
    options: ["Ressource non trouvée", "Accès refusé pour cause d'authentification manquante ou invalide", "Requête trop volumineuse", "Serveur en maintenance"],
    answer: 1,
    explanation: "401 Unauthorized indique que la requête requiert une authentification valide (API key, token manquant ou expiré)."
  },
  {
    question: "Que signifie le status code HTTP 404 Not Found ?",
    options: ["Erreur de syntaxe dans le JSON", "La ressource ou l'URL demandée n'existe pas sur le serveur", "Le serveur a mis trop de temps à répondre", "L'API a changé de domaine"],
    answer: 1,
    explanation: "404 Not Found indique que le point d'accès ou l'identifiant de la ressource demandée n'existe pas à l'adresse indiquée."
  },
  {
    question: "Quel format de données est le standard dominant des APIs REST modernes ?",
    options: ["XML", "CSV", "JSON (JavaScript Object Notation)", "YAML"],
    answer: 2,
    explanation: "JSON est le format universel pour les échanges REST : lisible, léger et nativement interprété par JavaScript et n8n."
  },
  {
    question: "Dans n8n, quelle est la distinction entre le 'Webhook Trigger' et le node 'HTTP Request' ?",
    options: ["Webhook Trigger reçoit des requêtes extérieures (n8n = serveur) ; HTTP Request envoie des requêtes vers l'extérieur (n8n = client)", "HTTP Request reçoit ; Webhook Trigger envoie", "Ils ont exactement le même rôle", "Webhook Trigger ne fonctionne qu'avec Stripe"],
    answer: 0,
    explanation: "Le Webhook Trigger met n8n en écoute d'événements externes, tandis que le HTTP Request permet à n8n d'appeler des services tiers."
  },
  {
    question: "Que contient le 'Body' d'une requête HTTP POST ?",
    options: ["L'URL de redirection", "Les paramètres DNS", "La charge utile (payload) des données à créer ou transmettre", "La version du navigateur"],
    answer: 2,
    explanation: "Le Body (corps de la requête) transporte les données envoyées au serveur, souvent au format JSON ou multipart/form-data."
  },
  {
    question: "Que signifie le status code HTTP 429 Too Many Requests ?",
    options: ["Données invalides", "La limite de requêtes autorisées (Rate Limit) de l'API a été dépassée", "Compte suspendu définitivement", "Erreur réseau"],
    answer: 1,
    explanation: "429 Too Many Requests signale que le client a envoyé trop de requêtes dans un temps donné et doit temporiser."
  },
  {
    question: "Quelle méthode HTTP utilise-t-on pour mettre à jour partiellement une ressource existante ?",
    options: ["PUT", "POST", "PATCH", "UPDATE"],
    answer: 2,
    explanation: "PATCH modifie uniquement les champs spécifiés d'une ressource. PUT remplace généralement la ressource entière."
  },
  {
    question: "Quelle est la méthode recommandée pour passer une clé API dans un node HTTP Request n8n ?",
    options: ["L'écrire en texte brut directement dans l'URL", "Créer un Credential 'Header Auth' ou 'Generic Credential Type' dédié", "La coller dans la description du workflow", "L'envoyer dans un fichier texte"],
    answer: 1,
    explanation: "Créer un Credential sécurisé chiffre la clé et évite toute fuite lors du partage ou de l'exportation du workflow."
  },
  {
    question: "Que signifie l'acronyme REST ?",
    options: ["Remote Execution Standard Technology", "Representational State Transfer", "Reliable Endpoint Secure Transmission", "Rapid Enterprise Software Tool"],
    answer: 1,
    explanation: "REST (Representational State Transfer) est le style architectural standard du web pour la conception de services et d'APIs."
  },
  {
    question: "Dans n8n, comment accède-t-on aux données transmises dans le corps d'un webhook entrant ?",
    options: ["Dans l'objet $json du node Webhook Trigger", "Dans une variable système globale $body", "En lisant un fichier temporaire", "Via un node de décodage spécial"],
    answer: 0,
    explanation: "n8n parse automatiquement le JSON reçu par le Webhook Trigger et l'injecte directement dans $json pour les nodes suivants."
  },
  {
    question: "Que signifie le status code HTTP 500 Internal Server Error ?",
    options: ["Votre requête contient une faute de frappe", "Une erreur inattendue est survenue du côté du serveur appelé", "Votre abonnement a expiré", "La connexion est refusée par le pare-feu"],
    answer: 1,
    explanation: "500 indique une anomalie interne au serveur distant : ce n'est pas une erreur de syntaxe client, mais un bug ou une défaillance de l'API appelée."
  },
  {
    question: "Quel Header HTTP indique au serveur que les données envoyées dans le body sont au format JSON ?",
    options: ["Accept: text/html", "Content-Type: application/json", "Data-Type: json", "Format: application/custom"],
    answer: 1,
    explanation: "Le header 'Content-Type: application/json' indique au serveur la façon dont il doit parser le corps de la requête."
  },
  {
    question: "Quelle méthode HTTP utilise-t-on pour supprimer une ressource identifiée par son URI ?",
    options: ["REMOVE", "DELETE", "DROP", "CLEAR"],
    answer: 1,
    explanation: "DELETE est le verbe HTTP dédié à la suppression de ressources."
  },
  {
    question: "Comment tester un Webhook Trigger dans n8n avant de le mettre en production ?",
    options: ["En activant le workflow et en espérant qu'il se déclenche", "En cliquant sur 'Listen for test event' et en envoyant un appel vers l'URL de test (ex: via Postman ou curl)", "En redémarrant n8n", "Ce n'est pas possible"],
    answer: 1,
    explanation: "Le mode 'Listen for test event' active temporairement l'URL de test du webhook pour capturer un échantillon réel de données."
  },
  {
    question: "Que signifie le status code HTTP 403 Forbidden ?",
    options: ["Le client n'est pas authentifié", "Le client est authentifié mais ne possède pas les permissions nécessaires pour accéder à cette ressource", "L'URL a été déplacée", "Le quota journalier est atteint"],
    answer: 1,
    explanation: "403 Forbidden indique que le serveur reconnaît l'identité du client mais refuse l'accès pour des raisons de permissions/droits insuffisants."
  },
  {
    question: "Où se placent les 'Query Parameters' dans une requête HTTP ?",
    options: ["Dans le corps de la requête", "À la fin de l'URL après le point d'interrogation (ex: ?page=2&limit=10)", "Dans les headers de sécurité", "Dans les certificats SSL"],
    answer: 1,
    explanation: "Les query parameters sont ajoutés après '?' dans l'URL pour filtrer, trier ou paginer les résultats."
  },
  {
    question: "Comment sécuriser un Webhook n8n exposé publiquement sur internet ?",
    options: ["En n'utilisant jamais de webhook", "En configurant une authentification par Header secret, Basic Auth ou signature HMAC vérifiée dans le workflow", "En changeant le port de n8n", "En masquant l'adresse IP"],
    answer: 1,
    explanation: "Vérifier un secret partagé (header secret ou signature HMAC) permet de rejeter immédiatement toute requête non autorisée."
  },
  {
    question: "Dans n8n, à quoi sert le node 'Respond to Webhook' ?",
    options: ["À désactiver le webhook", "À renvoyer une réponse personnalisée (status code, body JSON) au client ayant déclenché le webhook", "À envoyer un email de notification", "À archiver le log"],
    answer: 1,
    explanation: "Le node 'Respond to Webhook' permet à n8n de répondre avec des données sur mesure au système appelant avant de clore la requête."
  },
  {
    question: "Que signifie l'acronyme CORS dans le développement web et les requêtes d'APIs ?",
    options: ["Cross-Origin Resource Sharing", "Central Object Routing System", "Client Online Response Service", "Cryptographic Open Resource Standard"],
    answer: 0,
    explanation: "CORS (Cross-Origin Resource Sharing) est le mécanisme de sécurité qui contrôle les requêtes HTTP entre différents domaines dans les navigateurs."
  },
  {
    question: "Quel outil en ligne de commande populaire permet de tester et prototyper des requêtes HTTP rapidement ?",
    options: ["curl", "ping", "traceroute", "grep"],
    answer: 0,
    explanation: "curl est l'outil en ligne de commande universel pour tester, inspecter et envoyer des requêtes HTTP vers des APIs."
  }
]

export const seance4Quiz = [
  {
    question: "Quelle approche n8n privilégie-t-il pour s'authentifier à des services de messagerie comme Gmail ?",
    options: ["Un simple mot de passe", "L'utilisation de clés API basiques", "L'authentification OAuth2", "L'adresse IP du serveur"],
    answer: 2,
    explanation: "OAuth2 est le standard sécurisé qui permet d'autoriser n8n à agir au nom d'un compte sans stocker le mot de passe."
  },
  {
    question: "Pour ajouter de nouvelles données dans une feuille de calcul, quelle opération du node Google Sheets faut-il choisir ?",
    options: ["Update Row", "Append Row", "Get Row(s)", "Delete Row"],
    answer: 1,
    explanation: "Append Row ajoute une nouvelle ligne à la fin du tableau avec les données fournies."
  },
  {
    question: "Avec quel outil officiel crée-t-on un bot sur Telegram ?",
    options: ["Telegram Bot Manager", "BotFather", "Le Node Telegram", "Le site web de Telegram"],
    answer: 1,
    explanation: "BotFather est le bot officiel de Telegram permettant de créer de nouveaux bots et de récupérer leurs tokens d'API."
  }
];

export const seance5Quiz = [
  {
    question: "Pourquoi est-il crucial de demander au modèle IA de répondre 'uniquement avec un JSON' ?",
    options: ["Parce que le LLM ne parle pas français", "Parce que la sortie par défaut d'un LLM est du texte brut, et du texte autour du JSON ferait échouer l'analyse", "Pour accélérer le temps de réponse", "Parce que n8n n'accepte que le JSON"],
    answer: 1,
    explanation: "Si le modèle ajoute 'Voici la réponse :' avant le JSON, la fonction JSON.parse() renverra une erreur. La sortie doit être strictement du JSON."
  },
  {
    question: "Quelle méthode est utilisée pour transformer le texte renvoyé par l'IA en un objet exploitable ?",
    options: ["JSON.stringify()", "JSON.parse()", "Une requête HTTP GET", "Un node Switch"],
    answer: 1,
    explanation: "JSON.parse() convertit la chaîne de caractères brute au format JSON en un véritable objet JavaScript manipulable par n8n."
  },
  {
    question: "Est-il possible d'utiliser un node Switch après une classification par une IA ?",
    options: ["Non, le node Switch ne comprend pas l'IA", "Oui, l'IA génère une catégorie (ex: 'commande') qui peut être évaluée classiquement par le Switch", "Seulement si l'IA utilise un modèle GPT-4", "Oui, mais cela demande de coder en Python"],
    answer: 1,
    explanation: "C'est l'essence même de l'hybridation : l'IA classifie (produit une donnée structurée), et le Switch route le flux selon cette donnée, sans rien changer à sa logique."
  }
];

export const seance6Quiz = [
  {
    question: "Pourquoi est-il conseillé de vérifier le stock dans une base de données plutôt que de demander le prix à l'IA ?",
    options: ["L'IA est trop lente", "L'IA a tendance à 'halluciner' (inventer) des informations factuelles non présentes dans son prompt", "Cela coûte plus cher en API", "Google Sheets est plus moderne que l'IA"],
    answer: 1,
    explanation: "Un LLM ne 'connaît' pas votre base de données. Pour une information exacte comme un prix ou un stock, il faut consulter la source de vérité (Google Sheets) et fournir l'information à l'IA."
  },
  {
    question: "Comment améliorer la fiabilité d'un LLM lors de l'extraction d'une entité (ex: un nom de produit) ?",
    options: ["Le menacer de s'éteindre s'il se trompe", "Lui fournir une liste fermée de choix précis dans le prompt", "Lui demander de chercher sur Google", "Lui parler en anglais obligatoirement"],
    answer: 1,
    explanation: "Fournir une liste explicite (ex: 'Choisis parmi Produit A, Produit B') contraint le modèle et réduit fortement les erreurs d'extraction par rapport à une demande ouverte."
  },
  {
    question: "Quel node utiliser pour suspendre l'exécution du workflow et attendre une validation humaine ?",
    options: ["Wait Node classique", "Node de messagerie avec l'opération 'Send and Wait for Response'", "Switch Node", "Stop and Go Node"],
    answer: 1,
    explanation: "L'opération 'Send and Wait for Response' (disponible par ex. sur Gmail) permet d'envoyer un message contenant des liens d'action (Approuver/Rejeter) qui relanceront le workflow une fois cliqués."
  }
];
