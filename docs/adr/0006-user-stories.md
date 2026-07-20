# 0006 — User stories (backlog fonctionnel formalisé)

- **Statut** : Accepté
- **Date** : 2026-07

## Contexte

Le critère **C2.2** attend que l'expression du besoin soit tracée sous forme de **user stories** avant le développement du prototype. Le projet **Sticky Notes** a été développé sans backlog écrit ; cet ADR **formalise a posteriori** les user stories couvertes par le code livré, afin de relier chaque fonctionnalité à un besoin utilisateur et à un critère d'acceptation vérifiable.

## Décision

Adopter le format standard **« En tant que _\<rôle\>_, je veux _\<action\>_ afin de _\<bénéfice\>_ »**, avec des critères d'acceptation testables. Trois rôles (personas) sont retenus, alignés sur les règles d'autorisation de `SecurityConfig` :

- **Visiteur** — non authentifié (lecture seule publique).
- **Utilisateur** (`USER`) — authentifié, peut modifier/supprimer.
- **Administrateur** (`ADMIN`) — authentifié, peut en plus créer des notes.

### Backlog

| # | Rôle | User story | Critères d'acceptation | Preuve (test / recette) |
|---|------|-----------|------------------------|-------------------------|
| **US-01** | Visiteur | En tant que **visiteur**, je veux **consulter la liste des notes** sans me connecter, afin de découvrir le contenu partagé. | `GET /notes` renvoie 200 sans authentification ; le front affiche la grille. | `SecurityIntegrationTest.getNotesIsPublic`, `NoteServiceTest`, E2E `spec.cy.ts` |
| **US-02** | Visiteur | En tant que **visiteur**, je veux **filtrer les notes par catégorie**, afin de retrouver un sujet précis. | `GET /notes/name/{cat}` renvoie 200 et la liste filtrée. | `SecurityIntegrationTest.getNotesByCategoryIsPublic`, `NoteServiceTest.testGetByCategoryName` |
| **US-03** | Visiteur | En tant que **visiteur**, je veux **consulter le détail d'une note**, afin d'en lire le contenu complet. | `GET /notes/{id}` renvoie titre + contenu. | `NoteControllerTest.testGetById`, écran `note-detail` |
| **US-04** | Utilisateur | En tant qu'**utilisateur**, je veux **m'authentifier** avec mes identifiants, afin d'accéder aux actions protégées. | `POST /token` en HTTP Basic renvoie un JWT (1h) ; mauvais mot de passe → 401. | `SecurityIntegrationTest.tokenEndpointReturnsJwtForValidBasicAuth` / `...RejectsBadCredentials`, `login.component.spec.ts` |
| **US-05** | Administrateur | En tant qu'**administrateur**, je veux **créer une note** dans une catégorie, afin d'enrichir le contenu partagé. | `POST /notes` : ADMIN → 200, USER → 403, anonyme → 401. | `SecurityIntegrationTest.postNoteAsAdminIsAllowed` / `...AsUserIsForbidden` / `...AnonymousIsUnauthorized` |
| **US-06** | Utilisateur | En tant qu'**utilisateur** authentifié, je veux **modifier une note existante**, afin de corriger ou compléter son contenu. | `PUT /notes` exige une authentification (tout rôle). | `NoteControllerTest.testUpdate`, règle `SecurityConfig` |
| **US-07** | Utilisateur | En tant qu'**utilisateur** authentifié, je veux **supprimer une note**, afin de retirer un contenu obsolète. | `DELETE /notes/{id}` exige une authentification ; bouton avec `aria-label` explicite. | `NoteControllerTest.testDeleteById`, `note.component` |
| **US-08** | Utilisateur | En tant qu'**utilisateur**, je veux **rester connecté pendant ma session**, afin de ne pas ressaisir mes identifiants à chaque action. | JWT stocké en `localStorage`, injecté en `Authorization: Bearer` par l'intercepteur ; l'état de session est exposé via un Signal (`AuthService.isAuthenticated`) qui pilote l'affichage des actions protégées (la liste reste publique par conception). | `auth.interceptor.ts`, `auth.service.spec.ts` |
| **US-09** | Utilisateur | En tant qu'**utilisateur en situation de handicap**, je veux **naviguer au clavier et avec un lecteur d'écran**, afin d'utiliser l'application de façon autonome. | Lien d'évitement, `:focus-visible`, noms accessibles, contrastes AA. | Audit Lighthouse a11y **100/100** (voir [06-accessibilite.md](../06-accessibilite.md)) |

## Conséquences

**Positives**
- Chaque fonctionnalité livrée est reliée à un besoin utilisateur et à une **preuve de test** (traçabilité exigence → code → recette).
- Le backlog sert de grille de lecture au [cahier de recettes](../07-cahier-de-recettes.md) : chaque US correspond à un ou plusieurs cas de test.

**Négatives / limites assumées**
- User stories rédigées **a posteriori** (le projet académique n'a pas suivi une démarche agile amont). Elles décrivent le périmètre livré, pas un backlog priorisé évolutif.
- Pas d'estimation (story points) ni de découpage en sprints — hors périmètre du rendu.

## Liens

- Règles d'autorisation : [0001 — JWT auto-émis](0001-jwt-self-issued.md)
- Stratégie de tests couvrant ces US : [0007 — Stratégie de tests unitaires](0007-strategie-tests-couverture.md)
- Vérification : [cahier de recettes](../07-cahier-de-recettes.md)
