# Sticky Notes

Application fullstack de prise de notes avec authentification JWT, catégorisation et gestion complète des notes (CRUD).

## Stack

| Couche | Technologie |
|--------|------------|
| Backend | Java 17 · Spring Boot 4 · Spring Security OAuth2/JWT · Spring Data JPA |
| Base de données | H2 in-memory |
| Frontend | Angular 21 · TypeScript 5.9 · RxJS 7.8 |
| Tests unitaires | JUnit (backend) · Jest (frontend) |
| Tests E2E | Cypress |
| Build backend | Maven Wrapper (`./mvnw`) |
| Build frontend | Angular CLI / Vite |

## Lancer le projet

```bash
./start.sh
```

Le script démarre le backend (port **9090**) et le frontend (port **4200**), puis ouvre **http://localhost:4200**.

Les logs sont écrits dans `backend.log` et `frontend.log` à la racine du projet.

> **Pré-requis** : Java 17+ et Node.js 20+ installés.

### Démarrage manuel

```bash
# Terminal 1 — backend
cd demo && ./mvnw spring-boot:run

# Terminal 2 — frontend
cd front && npm install && npm start
```

## Comptes de test

| Rôle | Utilisateur | Mot de passe | Droits |
|------|-------------|--------------|--------|
| Admin | `admin` | `password` | Lecture + création de notes |
| Utilisateur | `user` | `password` | Lecture seule |

## Fonctionnement de l'authentification

1. Le frontend envoie les credentials en **HTTP Basic** vers `POST /token`.
2. Le backend retourne un **JWT RS256** valable **1 heure**.
3. Le token est stocké en `localStorage` et injecté automatiquement dans chaque requête via un intercepteur HTTP Angular.

> Les clés RSA sont générées à chaque démarrage : les tokens précédents sont invalidés à chaque redémarrage du backend.

## API REST

Base URL : `http://localhost:9090`

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| `POST` | `/token` | Basic | Obtenir un JWT |
| `GET` | `/notes` | Non | Lister toutes les notes |
| `GET` | `/notes/{id}` | Non | Détail d'une note |
| `GET` | `/notes/name/{name}` | Non | Notes par catégorie |
| `POST` | `/notes` | JWT (ADMIN) | Créer une note |
| `PUT` | `/notes` | JWT | Modifier une note |
| `DELETE` | `/notes/{id}` | JWT | Supprimer une note |

La documentation Swagger UI est disponible sur **http://localhost:9090/swagger-ui.html** et la console H2 sur **http://localhost:9090/h2-console**.

## Tests

### Backend

```bash
cd demo && ./mvnw test
```

Couvre les controllers (`NoteController`, `UserController`) et les services (`NoteService`, `UserService`, `TokenService`) avec Spring Boot test slices et MockMvc.

### Frontend — unitaires

```bash
cd front && npm test
```

Tests Jest des composants et services Angular.

### Frontend — E2E

```bash
cd front && npx cypress open   # mode interactif
cd front && npx cypress run    # mode headless
```

Les tests Cypress mockent l'API via `cy.intercept` (pas besoin que le backend tourne).

## Structure du projet

```
.
├── demo/                   # Backend Spring Boot
│   ├── src/main/java/com/example/demo/
│   │   ├── config/         # SecurityConfig, Jwks, UserInitializator
│   │   ├── controller/     # NoteController, UserController
│   │   ├── entity/         # Note, Category, User, Role
│   │   ├── repository/     # Spring Data repositories
│   │   ├── service/        # NoteService, UserService, TokenService
│   │   └── dto/            # BasicNoteDTO
│   └── src/test/           # Tests JUnit
├── front/                  # Frontend Angular
│   ├── src/app/
│   │   ├── components/     # NoteListComponent, NoteDetailComponent, NoteComponent, LoginComponent
│   │   ├── services/       # AuthService, NoteService
│   │   └── interceptors/   # authInterceptor (Bearer JWT)
│   └── cypress/e2e/        # Tests E2E
└── start.sh                # Script de démarrage unifié
```
