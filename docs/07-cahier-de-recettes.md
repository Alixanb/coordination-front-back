# Cahier de recettes

> Répond au critère C2.3.1. Reprend l'ensemble des fonctionnalités attendues sous forme de scénarios de test (fonctionnels, structurels, sécurité) avec résultat attendu et statut.
>
> **Automatisation** : la majorité des scénarios sont couverts par des tests automatisés — Cypress (E2E, `front/cypress/e2e/spec.cy.ts`), Jest (`front/src/app/**/*.spec.ts`), JUnit/MockMvc (`demo/src/test/**`). Rejeu : `npm run e2e`, `npm test`, `./mvnw test`.

Légende statut : ✅ OK (rejoué et conforme) · ⚠️ à surveiller · ❌ KO.

## 1. Authentification

| ID      | Scénario                            | Préconditions           | Étapes                                   | Résultat attendu                                 | Type        | Statut |
| ------- | ----------------------------------- | ----------------------- | ---------------------------------------- | ------------------------------------------------ | ----------- | ------ |
| AUTH-01 | Affichage du formulaire de login    | —                       | Aller sur `/login`                       | Champs username/password + bouton désactivé      | Fonctionnel | ✅     |
| AUTH-02 | Bouton actif quand champs remplis   | Sur `/login`            | Saisir username + password               | Bouton « Sign In » activé                        | Fonctionnel | ✅     |
| AUTH-03 | Bouton désactivé si un champ manque | Sur `/login`            | Saisir uniquement username (ou password) | Bouton reste désactivé                           | Fonctionnel | ✅     |
| AUTH-04 | Connexion valide                    | Compte `admin/password` | Saisir identifiants + valider            | Redirection `/notes`, token en localStorage      | Fonctionnel | ✅     |
| AUTH-05 | Identifiants invalides              | —                       | Saisir mauvais identifiants              | Message « Invalid credentials » (`role="alert"`) | Fonctionnel | ✅     |
| AUTH-06 | Stockage du token                   | Connexion valide        | Se connecter                             | JWT présent dans `localStorage`                  | Structurel  | ✅     |
| AUTH-07 | Échec réseau                        | Backend injoignable     | Tenter connexion                         | Message d'erreur affiché, pas de crash           | Fonctionnel | ✅     |
| AUTH-08 | Émission JWT (backend)              | Basic `admin:password`  | `POST /token`                            | 200 + JWT RS256 signé                            | Structurel  | ✅     |

## 2. Gestion des notes (CRUD)

| ID      | Scénario                   | Préconditions      | Étapes                           | Résultat attendu                            | Type        | Statut |
| ------- | -------------------------- | ------------------ | -------------------------------- | ------------------------------------------- | ----------- | ------ |
| NOTE-01 | Liste des notes            | Notes existantes   | Aller sur `/notes`               | Les notes s'affichent (cartes)              | Fonctionnel | ✅     |
| NOTE-02 | Troncature du contenu long | Note > 80 car.     | Afficher la liste                | Aperçu tronqué avec « … »                   | Fonctionnel | ✅     |
| NOTE-03 | Pas de troncature si court | Note courte        | Afficher la liste                | Contenu complet                             | Fonctionnel | ✅     |
| NOTE-04 | État vide                  | Aucune note        | Afficher la liste                | Message « No notes yet »                    | Fonctionnel | ✅     |
| NOTE-05 | Navigation vers le détail  | Notes existantes   | Cliquer une carte                | Ouverture `/notes/:id` avec titre + contenu | Fonctionnel | ✅     |
| NOTE-06 | Retour à la liste          | Sur le détail      | Cliquer « Back to board »        | Retour `/notes`                             | Fonctionnel | ✅     |
| NOTE-07 | Suppression d'une note     | Connecté           | Cliquer la croix de suppression  | Note retirée de la liste                    | Fonctionnel | ✅     |
| NOTE-08 | Échec de suppression       | Erreur serveur     | Supprimer avec erreur backend    | Note conservée dans la liste                | Fonctionnel | ✅     |
| NOTE-09 | Erreur de chargement       | Erreur serveur GET | Charger la liste                 | Message d'erreur, pas de crash              | Fonctionnel | ✅     |
| NOTE-10 | Détail inexistant (404)    | ID inconnu         | Aller sur `/notes/9999`          | Gestion 404 propre                          | Fonctionnel | ✅     |
| NOTE-11 | Création de note (ADMIN)   | Connecté ADMIN     | `POST /notes` avec titre/contenu | 200/201, note créée                         | Fonctionnel | ✅     |
| NOTE-12 | Lecture par catégorie      | Catégories seedées | `GET /notes/name/{cat}`          | Notes de la catégorie                       | Fonctionnel | ✅     |

## 3. Sécurité et contrôle d'accès

| ID     | Scénario                       | Préconditions     | Étapes                               | Résultat attendu            | Type     | Statut |
| ------ | ------------------------------ | ----------------- | ------------------------------------ | --------------------------- | -------- | ------ |
| SEC-01 | Lecture publique               | —                 | `GET /notes` sans token              | 200 (accès public autorisé) | Sécurité | ✅     |
| SEC-02 | Création interdite sans token  | —                 | `POST /notes` sans token             | 401/403                     | Sécurité | ✅     |
| SEC-03 | Création interdite à un USER   | Token USER        | `POST /notes`                        | 403 (rôle ADMIN requis)     | Sécurité | ✅     |
| SEC-04 | Écriture autorisée à l'ADMIN   | Token ADMIN       | `POST /notes`                        | 200/201                     | Sécurité | ✅     |
| SEC-05 | Suppression sans token refusée | —                 | `DELETE /notes/{id}` sans token      | 401/403                     | Sécurité | ✅     |
| SEC-06 | CORS restreint                 | —                 | Requête depuis origine non autorisée | Pré-vol CORS refusé         | Sécurité | ✅     |
| SEC-07 | Mot de passe haché             | Utilisateur seedé | Inspecter la base H2                 | Hash BCrypt, pas de clair   | Sécurité | ✅     |

## 4. Couverture par les tests automatisés

| Suite                     | Nombre | Portée                                                                      |
| ------------------------- | ------ | --------------------------------------------------------------------------- |
| JUnit / MockMvc (backend) | 31     | Controllers (NoteController, UserController) + services (Note, User, Token) |
| Jest (frontend)           | 37     | Composants + services + intercepteur                                        |
| Cypress (E2E)             | 20     | Parcours login, liste, détail, suppression, états d'erreur                  |

> Tous les scénarios ci-dessus sont **au vert** au dernier rejeu (voir `docs/08-plan-correction-bogues.md` pour le suivi des anomalies).
