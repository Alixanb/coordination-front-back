# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> There is also a `.claude/CLAUDE.md` (French, gitignored) with the same intent plus academic-grading context (`CONSIGNES.md`). This root file is the committed, canonical version — keep the two in sync when you change project-wide facts.

## Project

**Sticky Notes** — academic fullstack note-taking app (Ynov M2). JWT auth, categories, full CRUD. Two independent apps: Spring Boot API in `demo/`, Angular SPA in `front/`. No database server — H2 runs in-memory.

## Commands

Run everything from the repo root unless noted.

```bash
./start.sh                    # backend :9090 + frontend :4200, logs → backend.log / frontend.log
```

**Backend** (`cd demo`):
```bash
./mvnw spring-boot:run        # dev server on :9090
./mvnw test                   # all unit tests
./mvnw test -Dtest=NoteServiceTest              # one test class
./mvnw test -Dtest=NoteServiceTest#methodName   # one test method
./mvnw package -DskipTests    # build JAR
```

**Frontend** (`cd front`):
```bash
npm start                     # dev server on :4200
npm test                      # Jest unit tests
npx jest note.service         # single spec by path fragment
npm run build                 # production build → front/dist
npm run e2e                   # Cypress headless (mocks API, backend not required)
npm run e2e:open              # Cypress interactive
```

Test accounts: `admin/password` (ADMIN), `user/password` (USER).

## Architecture

### Self-issued JWT (the core design decision)
There is **no external Authorization Server**. The backend both **issues and validates** its own tokens:
- `POST /token` with HTTP Basic → Spring authenticates via `UserDetailsService` → `TokenService` mints an RS256 JWT (issuer `"self"`, 1h expiry, roles in `scope`).
- The same app runs as an OAuth2 Resource Server validating that JWT on every request.
- RSA keys are generated **fresh at each startup** (`Jwks.generateRsa()`), so all previously issued tokens become invalid on restart. This is intended, not a bug.
- Frontend flow: Basic → JWT stored in `localStorage` → `authInterceptor` (functional `HttpInterceptorFn`) injects `Authorization: Bearer <token>` on outgoing requests. `AuthService.isAuthenticated` is an Angular **Signal** (not an RxJS Subject); `authGuard` reads it.

### Authorization rules (backend `SecurityConfig`)
- `GET /notes*` → public
- `POST /notes` → ADMIN only
- `PUT` / `DELETE /notes` → any authenticated user

### Data
H2 in-memory, reseeded on every startup by `UserInitializator` (`CommandLineRunner`): roles, the two test users, categories `Work`/`Personal`, 3 sample notes. Data does not persist across restarts.

### Backend layout (`demo/src/main/java/com/example/demo/`)
Standard Spring layering: `config/` (SecurityConfig, Jwks, UserInitializator) · `controller/` · `service/` · `repository/` (Spring Data JPA) · `entity/` · `dto/`.

Backend tests use `@WebMvcTest` + MockMvc for controllers and mock-based tests for services.

### Frontend layout (`front/src/app/`)
Angular 21, **standalone components only** (no NgModules). `app.config.ts` bootstraps with `provideRouter` + `provideHttpClient` + the functional interceptor. Components: `login/`, `note-list/`, `note-detail/`, `note/` (card, child of note-list). Services: `AuthService`, `NoteService`.

## Landmines

- **Two `Note` classes exist**: `entity/Note.java` (the real one, used everywhere) and `model/Note.java` (**dead code** — only referenced by a commented-out import in `NoteController.java`). Always use `entity.Note`; do not add to `model.Note`.
- **`demo/bin/`** contains stale committed Eclipse `.class` files and is not gitignored — do not treat it as source, and don't rebuild from it.
- CORS uses `allowedOriginPatterns("*")` — deliberately permissive for the demo.

## Known & accepted limitations

These are documented, intentional trade-offs for an academic demo (see `ARTICLE_NOTES.md`). **Do not "fix" them unless explicitly asked**: no refresh token (1h re-login), fixed demo credentials seeded by `UserInitializator`, no pagination on `GET /notes`, RSA keys not persisted. (Note: passwords *are* hashed with BCrypt via `UserService.saveUser` — this is not a gap.)

## CI/CD

`.github/workflows/ci.yml` runs on push/PR to `main`: backend tests → frontend tests → Cypress → backend/frontend builds → docker delivery (pushes `alixanb/coordination-front-back` from `demo/Dockerfile.prod`). There are currently **no coverage or lint gates** in CI.
