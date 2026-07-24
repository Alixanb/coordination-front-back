# Protocole d'intégration continue (CI)

> Répond au critère C2.1.2 : « configurer le système d'intégration continue […] en fusionnant les codes sources et en testant régulièrement les blocs de code ». Définition : `.github/workflows/ci.yml`.

## 1. Déclencheurs

La CI s'exécute automatiquement sur :

- **push** sur la branche `main`,
- **pull request** ciblant `main`.

Toute fusion de code passe donc par une exécution complète de la chaîne, réduisant les risques de régression.

## 2. Séquence des jobs

```
backend-tests ─┐
               ├─► cypress-run ─┬─► backend-build ──┐
frontend-tests ┘               └─► frontend-build ──┴─► docker-delivery
```

| Ordre | Job               | Rôle                                                      | Dépend de                     |
| ----- | ----------------- | --------------------------------------------------------- | ----------------------------- |
| 1     | `backend-tests`   | `mvn clean test` + upload rapport **JaCoCo**              | —                             |
| 1     | `frontend-tests`  | `npm ci` → **`npm run lint`** (bloquant) → `npm run test` | —                             |
| 2     | `cypress-run`     | E2E Cypress (Chrome) sur l'app démarrée                   | backend-tests, frontend-tests |
| 3     | `backend-build`   | `mvn package` + upload artefact `backend.jar`             | cypress-run                   |
| 3     | `frontend-build`  | `npm run build` + upload artefact `front-dist`            | cypress-run                   |
| 4     | `docker-delivery` | build + push image Docker Hub                             | backend-build, frontend-build |

## 3. Séquences d'intégration détaillées

1. **Tests unitaires en parallèle** (backend + frontend) : validation rapide des blocs de code. Le lint frontend est bloquant (qualité) ; la couverture JaCoCo est publiée en artefact.
2. **Tests E2E** : ne s'exécutent que si les tests unitaires passent — évite de gaspiller des ressources sur du code déjà cassé.
3. **Builds** : packaging du JAR et du bundle frontend, uniquement après E2E verts.
4. **Livraison** : voir [03-protocole-cd.md](03-protocole-cd.md).

## 4. Critères de qualité contrôlés en CI

- Tous les tests unitaires backend et frontend passent.
- Le lint frontend (`angular-eslint`, incluant les règles d'accessibilité) passe.
- Les tests E2E passent.
- La couverture est mesurée et disponible (artefact `jacoco-report`).

Voir [04-criteres-qualite-performance.md](04-criteres-qualite-performance.md) pour les seuils.
