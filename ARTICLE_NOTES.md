# Notes d'article — Sticky Notes (architecture & techno)

## Concept général

Application fullstack de prise de notes avec authentification, catégorisation et gestion CRUD complète.
Projet académique (Ynov M2) illustrant une stack moderne Java/TypeScript avec une chaîne de sécurité OAuth2/JWT de bout en bout.

---

## Architecture

```
┌─────────────────────┐        HTTP REST        ┌──────────────────────┐
│   Angular 21 (SPA)  │ ──────────────────────► │  Spring Boot 4 API   │
│   localhost:4200    │ ◄────────────────────── │   localhost:9090     │
└─────────────────────┘      JSON / JWT          └──────────┬───────────┘
                                                             │ JPA
                                                    ┌────────▼────────┐
                                                    │  H2 (in-memory) │
                                                    └─────────────────┘
```

Aucun Docker, aucun proxy : les deux processus tournent directement sur la machine via un seul script `start.sh`.

---

## Backend — Spring Boot 4

### Stack

| Composant | Version / détail |
|-----------|-----------------|
| Java | 17 |
| Spring Boot | 4.0.1 |
| Spring Data JPA | Hibernate / H2 dialect |
| Base de données | H2 in-memory (`jdbc:h2:mem:testdb`) |
| Sécurité | Spring Security — OAuth2 Resource Server (JWT) + HTTP Basic |
| Doc API | SpringDoc OpenAPI 3.0.1 (Swagger UI exposé à `/swagger-ui.html`) |
| Build | Maven Wrapper (`./mvnw`) |

### Sécurité & flux d'authentification

Le design suit le pattern **"self-issued JWT"** :

1. Le client envoie ses credentials en **HTTP Basic** vers `POST /token`.
2. Spring Security authentifie via `UserDetailsService` (users en base H2).
3. `TokenService` génère un **JWT RS256** signé avec une paire RSA 2048 bits générée au démarrage (`Jwks.generateRsa()`).
   - `issuer` : `"self"`
   - `expiresAt` : maintenant + 1 heure
   - `scope` : liste des rôles (`ROLE_ADMIN`, `ROLE_USER`)
4. Le client stocke le token et l'envoie ensuite en **Bearer** pour toutes les requêtes.
5. Le Resource Server valide la signature JWT à chaque requête (clé publique en mémoire).

> Point notable : les clés RSA sont regénérées à chaque redémarrage — les tokens précédents deviennent invalides. Acceptable pour un projet démo, pas pour la production.

### Modèle de données

```
User (N) ──── (M) Role
Note (N) ──── (1) Category
```

- **User** implémente `UserDetails` directement (pattern Spring Security classique).
- **Role** : `ADMIN` ou `USER`.
- **Note** : `title` (non null), `content`, `category` (FK, cascade MERGE, fetch EAGER).
- **Category** : `name`, relation inverse `OneToMany` vers `Note`.

### Endpoints

| Méthode | Route | Auth requise | Rôle |
|---------|-------|-------------|------|
| `GET` | `/notes` | Non | — |
| `GET` | `/notes/{id}` | Non | — |
| `GET` | `/notes/name/{name}` | Non | — |
| `POST` | `/notes` | Oui | ADMIN |
| `PUT` | `/notes` | Oui | Authentifié |
| `DELETE` | `/notes/{id}` | Oui | Authentifié |
| `POST` | `/token` | Oui (Basic) | — |

### Données de démarrage

`UserInitializator` (implémente `CommandLineRunner`) ensemence la base à chaque démarrage :
- Rôles : `ADMIN`, `USER`
- Users : `admin / password` (ADMIN), `user / password` (USER)
- Catégories : `Work`, `Personal`
- Notes : 3 notes exemples

### Tests backend

- **WebMvcTest** + **MockMvc** pour les controllers (`NoteControllerTest`, `UserControllerTest`)
- **Service layer tests** avec mocks (`NoteServiceTest`, `UserServiceTest`, `TokenServiceTest`)
- Runner : `./mvnw test`

---

## Frontend — Angular 21

### Stack

| Composant | Version / détail |
|-----------|-----------------|
| Angular | 21.1 |
| TypeScript | ~5.9 |
| RxJS | ~7.8 |
| Zone.js | ^0.16 |
| Test unitaires | Jest 30 + jest-preset-angular |
| E2E | Cypress |
| Build tool | `@angular/build` (Vite sous le capot) |
| Package manager | npm 11.6 |

### Architecture Angular moderne (standalone)

Le projet n'utilise **pas de NgModules** — tout est en composants standalone (Angular 14+).

`app.config.ts` configure le bootstrap avec `provideRouter`, `provideHttpClient` + intercepteur fonctionnel.

### Composants

| Composant | Route | Rôle |
|-----------|-------|------|
| `LoginComponent` | `/login` | Formulaire Basic Auth → échange contre JWT |
| `NoteListComponent` | `/notes` | Liste toutes les notes, suppression |
| `NoteComponent` | — | Carte individuelle d'une note (enfant de NoteListComponent) |
| `NoteDetailComponent` | `/notes/:id` | Affichage complet d'une note |

### Services

- **AuthService** : gère login/logout, stockage du JWT en `localStorage`, expose `isAuthenticated` comme **Signal** Angular (état réactif sans RxJS Subject).
- **NoteService** : appels HTTP GET/DELETE vers l'API.

### Intercepteur HTTP

`authInterceptor` (fonctionnel, pas de classe) clone chaque requête sortante et injecte le header `Authorization: Bearer <token>` si un token est présent.

### Routing & Guards

Guard `authGuard` inline dans `app.routes.ts` : vérifie `auth.isAuthenticated()` (Signal), redirige vers `/login` sinon.

### Tests frontend

- **Jest** : tests unitaires des composants et services (`*.spec.ts`)
- **Cypress** : tests E2E avec `cy.intercept` pour mocker l'API — couvre login, liste, détail, suppression, états d'erreur, stockage du token en localStorage

---

## Script de démarrage

`start.sh` :
1. Kill les processus sur les ports 9090 et 4200
2. Lance `./mvnw spring-boot:run` en background, log → `backend.log`
3. Attend 10s (warm-up JVM/Spring)
4. Lance `npm start` en background, log → `frontend.log`
5. Trap `SIGINT/SIGTERM` pour tuer les deux PID proprement

---

## Points intéressants à développer dans l'article

- **JWT self-issued** : pas d'Authorization Server externe (Keycloak, Auth0) — le backend joue les deux rôles (émetteur + validateur). Simple mais les clés sont éphémères.
- **Angular Signals** pour l'état d'auth : alternative légère aux BehaviorSubject RxJS, plus idiomatique depuis Angular 17+.
- **Intercepteur fonctionnel** : la nouvelle API `HttpInterceptorFn` vs l'ancienne classe `HttpInterceptor`.
- **Spring Boot 4** : première version majeure post-3.x, requiert Java 17+, aligne sur Spring Framework 7.
- **H2 en mémoire** : parfait pour un projet démo ou des tests d'intégration rapides, données perdues à l'arrêt.
- **Test slices Spring** : `@WebMvcTest` isole la couche HTTP sans démarrer tout le contexte — tests rapides.
- **Cypress intercept** : les tests E2E mockent entièrement le backend, pas besoin que le serveur tourne.

---

## Ce qui manque / pistes d'amélioration

- Pas de refresh token — expiration à 1h, reconnexion obligatoire
- CORS `allowedOriginPatterns("*")` — trop permissif pour la prod
- Mots de passe en clair dans `UserInitializator` (à chiffrer avec `BCryptPasswordEncoder`)
- Pas de pagination sur `GET /notes`
- Clés RSA non persistées → tokens invalidés à chaque redémarrage
