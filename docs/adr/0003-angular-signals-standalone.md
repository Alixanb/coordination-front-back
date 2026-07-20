# 0003 — Angular standalone + Signals

- **Statut** : Accepté
- **Date** : 2026-07

## Contexte

Le frontend (Angular 21) doit gérer l'état d'authentification de façon réactive et structurer ses composants.

## Décision

- **Composants standalone** uniquement (pas de NgModules) ; bootstrap via `app.config.ts`.
- État d'authentification exposé comme **Signal** Angular (`AuthService.isAuthenticated`).
- **Intercepteur fonctionnel** (`HttpInterceptorFn`) pour injecter le `Bearer` token.
- Injection via **`inject()`** plutôt que par constructeur (règle ESLint `prefer-inject`).

## Conséquences

**Positives**
- Alignement sur les pratiques Angular modernes (17+), moins de boilerplate.
- Signals : réactivité simple sans `BehaviorSubject`/RxJS pour l'état d'auth.
- Cohérence garantie par le lint (`angular-eslint`).

**Négatives**
- Nécessite Angular récent ; patterns différents de la documentation « historique » à base de NgModules.
