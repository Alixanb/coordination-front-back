# Plan de correction des bogues

> Répond au critère C2.3.2 : élaborer un plan de correction à partir de l'analyse des anomalies et régressions détectées en recette.

## 1. Processus

1. **Détection** : test en échec (CI, cahier de recettes), remontée manuelle, ou revue de code.
2. **Qualification** : gravité (bloquant / majeur / mineur), périmètre, reproductibilité.
3. **Analyse** : cause racine + point d'amélioration.
4. **Correction** : commit dédié sur une branche `fix/*`, revue, merge.
5. **Non-régression** : ajout/mise à jour d'un test automatisé couvrant le cas.

Gravité : 🔴 bloquant · 🟠 majeur · 🟡 mineur.

## 2. Registre des anomalies

| ID     | Description                                                               | Gravité | Statut     | Cause racine / Analyse                                      | Correction                                          | Non-régression                 |
| ------ | ------------------------------------------------------------------------- | ------- | ---------- | ----------------------------------------------------------- | --------------------------------------------------- | ------------------------------ |
| BUG-01 | Le job CI `docker-delivery` ne publiait pas l'image                       | 🟠      | ✅ Corrigé | Contexte/Dockerfile de build mal ciblés                     | `Dockerfile.prod` + job corrigés (commit `fcba33f`) | Pipeline CI vert               |
| BUG-02 | Code mort : deux entités `Note` (`entity` vs `model`) prêtant à confusion | 🟡      | ✅ Corrigé | Scaffold non nettoyé ; `model.Note` jamais utilisé          | Suppression de `model/Note.java` + import commenté  | Compilation + 18 tests backend |
| BUG-03 | Stubs Angular morts (`login.ts`, `note-detail.ts` « … works! »)           | 🟡      | ✅ Corrigé | Fichiers générés non supprimés après refactor `*.component` | Suppression des stubs non routés                    | Lint + 37 tests Jest           |
| BUG-04 | Classes compilées (`demo/bin/`) versionnées                               | 🟡      | ✅ Corrigé | Absence de `bin/` dans `.gitignore`                         | `git rm --cached` + `.gitignore`                    | `git status` propre            |
| BUG-05 | CORS trop permissif (`allowedOriginPatterns("*")`)                        | 🟠      | ✅ Corrigé | Configuration de démo laissée ouverte                       | Origines restreintes et externalisées               | Tests sécurité (SEC-06)        |
| BUG-06 | Carte de note non accessible au clavier (`<div>` cliquable)               | 🟠      | ✅ Corrigé | Navigation portée par un `<div>` sans focus                 | Passage à un vrai `<a>` (lien étiré)                | Cypress NOTE-05 + lint a11y    |
| BUG-07 | Bouton de suppression invisible au clavier (`opacity:0`)                  | 🟡      | ✅ Corrigé | Révélé uniquement au survol souris                          | Ajout `:focus-within` / `:focus-visible`            | Revue visuelle + lint a11y     |
| BUG-08 | Documentation obsolète : « mots de passe en clair »                       | 🟡      | ✅ Corrigé | Doc non mise à jour après ajout de BCrypt                   | Correction `ARTICLE_NOTES.md` / `CLAUDE.md`         | Relecture croisée code/doc     |

## 3. Anomalies connues non corrigées (limites assumées)

Ces points sont **documentés et acceptés** dans le cadre du projet démo (voir `docs/05-securite-owasp.md` et `docs/architecture.md`) — ils ne constituent pas des bogues mais des choix :

| Réf    | Limite                                          | Raison du non-traitement          |
| ------ | ----------------------------------------------- | --------------------------------- |
| LIM-01 | Pas de refresh token (reconnexion à 1h)         | Périmètre démo ; simplicité       |
| LIM-02 | Clés RSA régénérées au redémarrage              | H2 en mémoire, pas de persistance |
| LIM-03 | Console H2 / Swagger exposées                   | Pratique en développement         |
| LIM-04 | Pas de pagination sur `GET /notes`              | Volume de données faible          |
| LIM-05 | Journalisation de sécurité minimale (OWASP A09) | Hors périmètre démo               |

## 4. Analyse des tests en échec

Au dernier rejeu complet (backend 18, Jest 37, Cypress 20), **aucun test n'est en échec**. Toute nouvelle anomalie détectée sera ajoutée au registre §2 avec son analyse et son correctif.
