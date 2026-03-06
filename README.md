# Sticky Notes (Projet de Coordination)

Bienvenue sur le projet **Sticky Notes** ! Il s'agit d'une application de prise de notes simple et efficace, conçue pour vous aider à vous organiser (travail, personnel, etc.).

L'application est découpée en deux grandes parties : un **Backend** (l'intelligence côté serveur) et un **Frontend** (l'interface utilisateur).

## 🚀 Fonctionnalités Principales

- **Authentification sécurisée** : Connectez-vous avec un nom d'utilisateur et un mot de passe (les accès sont protégés par un système de jetons).
- **Gestion des notes** : Créez, lisez, modifiez et supprimez vos notes facilement.
- **Catégorisation** : Classez vos notes (par exemple : "Travail" ou "Personnel").
- **Aperçu rapide** : La liste principale vous montre un résumé de vos notes, avec une troncature intelligente pour les textes trop longs.

## 🛠️ Les Technologies Utilisées

- **Backend (Dossier `demo/`)** : Construit avec **Java** et **Spring Boot 4**. Il utilise une petite base de données en mémoire (H2) idéale pour le développement, et sécurise vos données grâce à un système appelé OAuth2 (JWT).
- **Frontend (Dossier `front/`)** : Construit avec **Angular 21**. L'interface est moderne et communique directement avec le Backend.

## 🧪 Une Qualité Assurée (Tests)

Pour garantir que l'application fonctionne parfaitement avant de vous être livrée, nous avons mis en place une batterie de tests complète :
1. **Tests Backend (Java)** : Plus d'une quinzaine de tests s'assurent que les "routes" et la logique de données fonctionnent sans bug (récupération de notes, sauvegarde, génération de mots de passe, etc.).
2. **Tests Frontend (Jest)** : Près de 40 tests rapides valident le bon comportement de l'interface (comme vérifier que le bouton "Se connecter" reste grisé si le mot de passe est vide).
3. **Tests de Bout-en-Bout (Cypress)** : Des tests automatisés simulent un véritable utilisateur sur son navigateur pour vérifier le parcours complet (connexion, affichage des notes, suppression, gestion des erreurs réseau).

## 🏃‍♂️ Comment lancer le projet ?

C'est très simple ! Un script automatisé s'occupe de tout démarrer pour vous.

Depuis la racine du projet, exécutez la commande suivante dans votre terminal :

```bash
./start.sh
```

Ce script va :
1. Nettoyer les ports réseau (9090 et 4200) pour éviter les conflits.
2. Démarrer le serveur Backend (sur le port 9090).
3. Démarrer l'interface Frontend (sur le port 4200).

Une fois que tout est prêt, ouvrez votre navigateur et allez sur : **http://localhost:4200**

👉 **Identifiants de test pré-configurés :**
- Compte Administrateur : Utilisateur `admin` / Mot de passe `password`
- Compte Classique : Utilisateur `user` / Mot de passe `password`

## 📁 Architecture du Code

- `demo/` : Tout le code Java. Les "Controllers" reçoivent les requêtes, les "Services" font le traitement intelligent, et les "Repositories" parlent à la base de données.
- `front/` : L'application web Angular. Vous y trouverez les vues (HTML/SCSS), les composants (`note-list`, `login`, `note-detail`) et les services qui parlent au Backend.

Bonnes prises de notes ! 📝
