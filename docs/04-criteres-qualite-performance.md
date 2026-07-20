# Critères de qualité et de performance

> Répond au critère C2.1.1 : « intégrer les outils de suivi de performance et de qualité ».
> Ces critères sont mesurés automatiquement à chaque exécution de la CI (`.github/workflows/ci.yml`).

## 1. Outils de suivi de la qualité

| Domaine | Outil | Commande | Sortie |
|--------|-------|----------|--------|
| Couverture backend | **JaCoCo** (`jacoco-maven-plugin`) | `cd demo && ./mvnw test` | `demo/target/site/jacoco/index.html` + artefact CI `jacoco-report` |
| Style backend | **Checkstyle** (`google_checks`, non bloquant) | `cd demo && ./mvnw checkstyle:check` | rapport console |
| Lint frontend | **ESLint** (`angular-eslint`, bloquant en CI) | `cd front && npm run lint` | rapport console |
| Couverture frontend | **Jest** (`--coverage`) | `cd front && npm run test:coverage` | `front/coverage/` (lcov) |
| Tests E2E | **Cypress** | `cd front && npm run e2e` | vidéos/logs Cypress |

## 2. Seuils de couverture

La couverture est **mesurée et publiée** à chaque build. Les seuils ci-dessous sont les cibles du projet ; ils ne cassent pas volontairement la CI (contexte académique/démo), mais toute régression est visible dans le rapport.

| Périmètre | Métrique | Mesuré actuellement | Cible |
|-----------|----------|---------------------|-------|
| Backend (JaCoCo) | Instructions | **≈ 94 %** (815/868) | ≥ 60 % |
| Frontend (Jest) | Lignes | **≈ 76 %** (96/126) | ≥ 70 % |
| Frontend (Jest) | Fonctions | **≈ 80 %** (24/30) | ≥ 70 % |
| Frontend (Jest) | Branches | **≈ 50 %** (8/16) | ≥ 50 % |

> La couverture backend porte à la fois sur la logique métier (services, controllers, à 100 %) et sur la configuration sécurité/JWT + seed de données, désormais couverts par un test d'intégration `@SpringBootTest` et des tests unitaires ciblés (`SecurityConfig`, `UserInitializator` à 100 %). Voir [ADR 0007 — Stratégie de tests](adr/0007-strategie-tests-couverture.md). Restent partiellement couverts quelques accesseurs d'entités (`Category`, `User`) et la méthode `main()` (mesuré sur build propre `mvn clean test` : 815/868).

## 3. Critères de performance

| Critère | Cible | Justification |
|--------|-------|---------------|
| Temps de réponse `GET /notes` | < 200 ms (local, H2 en mémoire) | Base en mémoire, pas d'I/O disque |
| Émission d'un JWT (`POST /token`) | < 500 ms | Inclut la vérification BCrypt + signature RS256 |
| Bundle initial frontend (prod) | < 500 kB (warning) / < 1 MB (error) | Budgets définis dans `angular.json` (`budgets`) |
| Style de composant | < 4 kB (warning) / < 8 kB (error) | Budgets `anyComponentStyle` dans `angular.json` |

## 4. Bonnes pratiques de développement contrôlées

- **Backend** : paradigme Spring (injection de dépendances, couches controller/service/repository, DTO), sécurité déclarative.
- **Frontend** : Angular standalone, Signals, intercepteur fonctionnel, `inject()` plutôt qu'injection par constructeur (règle ESLint `@angular-eslint/prefer-inject`).
- **Accessibilité** : le lint frontend inclut `angular-eslint` *template-accessibility* (voir [`06-accessibilite.md`](06-accessibilite.md)).
