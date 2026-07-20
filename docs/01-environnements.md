# Environnements de développement et de test

> Répond au critère C2.1.1 : « l'environnement de développement est détaillé (éditeur, compilateur, serveur d'application, gestion de sources) ».

## 1. Environnement de développement

| Composant | Outil / version | Rôle |
|-----------|-----------------|------|
| Éditeur de code | VS Code (config `.vscode/`) | Développement back & front |
| Langage backend | Java 17 (Temurin) | Compilation via `javac` piloté par Maven |
| Compilateur / build backend | Maven Wrapper `./mvnw` (Spring Boot 4.0.1) | Build, tests, packaging JAR |
| Serveur d'application backend | Tomcat **embarqué** (Spring Boot), port **9090** | Exécution de l'API |
| Langage frontend | TypeScript 5.9 | Compilé par le build Angular |
| Build / serveur frontend | Angular CLI + `@angular/build` (Vite), port **4200** | Dev server + build de production |
| Gestionnaire de paquets | npm 11 | Dépendances frontend |
| Base de données | H2 **en mémoire** (`jdbc:h2:mem:testdb`) | Persistance de dev/test |
| Gestion de sources | **Git** + **GitHub** (`Alixanb/coordination-front-back`) | Versionnement, CI |
| Conteneurisation | Docker (`Dockerfile.prod`) | Packaging / livraison |

## 2. Lancement de l'environnement

```bash
./start.sh          # backend :9090 + frontend :4200 (logs backend.log / frontend.log)
```

Démarrage manuel :

```bash
cd demo && ./mvnw spring-boot:run     # API
cd front && npm start                 # SPA
```

Comptes de test (seedés par `UserInitializator`) : `admin/password` (ADMIN), `user/password` (USER).

## 3. Environnement de test

| Niveau | Outil | Commande | Environnement d'exécution |
|--------|-------|----------|---------------------------|
| Unitaire backend | JUnit + MockMvc (`@WebMvcTest`) | `cd demo && ./mvnw test` | JVM, contexte Spring partiel |
| Unitaire frontend | Jest + jest-preset-angular | `cd front && npm test` | jsdom |
| E2E | Cypress (API mockée `cy.intercept`) | `cd front && npm run e2e` | Chrome headless |
| Couverture | JaCoCo (back) / Jest `--coverage` (front) | voir [04](04-criteres-qualite-performance.md) | — |
| Lint | ESLint (front) / Checkstyle (back) | `npm run lint` / `./mvnw checkstyle:check` | — |

Les tests s'exécutent **localement** et **à chaque push/PR** sur `main` via la CI (voir [02-protocole-ci.md](02-protocole-ci.md)). La base H2 en mémoire garantit des tests reproductibles et isolés (données reseedées à chaque démarrage).
