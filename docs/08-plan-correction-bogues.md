# Plan de correction des bogues

> Répond au critère C2.3.2 : élaborer un plan de correction à partir de l'analyse des anomalies et régressions détectées en recette.

## 1. Processus

1. **Détection** : test en échec (CI, cahier de recettes), remontée manuelle, ou revue de code.
2. **Qualification** : gravité (élevée / moyenne / faible), périmètre, reproductibilité.
3. **Analyse** : cause racine + point d'amélioration.
4. **Correction** : commit dédié, revue, merge.
5. **Non-régression** : ajout/mise à jour d'un test automatisé couvrant le cas.

## 2. Registre des anomalies

| Réf | Anomalie                                                                                   | Gravité | Détection                                | Cause racine / Analyse                                               | Correction                                                                                                                                    | Non-régression                   | Statut     |
| --- | ------------------------------------------------------------------------------------------ | ------- | ---------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ---------- |
| B1  | CORS configuré avec le joker `*`, autorisant toute origine                                 | Élevée  | Revue de sécurité (OWASP A05)            | Configuration de démo laissée ouverte                                | Restriction aux origines déclarées, externalisées (`app.cors.allowed-origins`)                                                                | `SecurityConfigTest` + SEC-06    | ✅ Corrigé |
| B2  | Carte de note en `<div>` cliquable, inaccessible au clavier                                | Élevée  | Règles `angular-eslint` et audit RGAA    | Navigation portée par un `<div>` sans focus ni sémantique            | Refonte en `<a>` réel avec lien étiré (`::after`), sans JavaScript                                                                            | Cypress NOTE-05 + lint a11y      | ✅ Corrigé |
| B3  | Bouton de suppression révélé au survol souris uniquement                                   | Moyenne | Audit RGAA (action réservée à la souris) | Bouton révélé uniquement via `:hover` (`opacity:0`)                  | Ajout de `:focus-within` / `:focus-visible` à la règle d'affichage                                                                            | Revue visuelle + lint a11y       | ✅ Corrigé |
| B4  | Attribut `lang` du document non aligné sur la microcopie affichée                          | Faible  | Audit RGAA (langue du document)          | Valeur par défaut du scaffold non vérifiée                           | Alignement de `lang="en"` sur le contenu réellement affiché                                                                                   | Audit Lighthouse (a11y 100)      | ✅ Corrigé |
| B5  | Couverture du code de configuration et d'amorçage à 0 %                                    | Moyenne | Rapport JaCoCo lu par classe             | Harnais centré sur la logique métier ; chaîne de sécurité non testée | Ajout de 13 tests d'intégration (`SecurityIntegrationTest`, `SecurityConfigTest`, `UserInitializatorTest`) ; couverture backend portée à 94 % | Artefact CI `jacoco-report`      | ✅ Corrigé |
| B6  | 617 violations Checkstyle sur le code Java                                                 | Faible  | Rapport `google_checks`                  | Code préexistant non écrit sous cette convention                     | Écart mesuré et documenté, règle maintenue non bloquante                                                                                      | Rapport publié à chaque CI       | ⚠️ Accepté |
| B7  | `front/Dockerfile.prod` comportait des fautes de frappe et n'était pas branché au pipeline | Moyenne | Revue du protocole de déploiement        | Fichier écrit mais jamais exécuté par la CI                          | Fautes corrigées ; job `docker-delivery` étendu à la construction et à la publication de l'image frontend                                     | Pipeline CI vert + `docker pull` | ✅ Corrigé |
| B8  | La documentation annonçait « 18 tests backend » au lieu des 31 réels                       | Faible  | Relecture croisée du dossier et du dépôt | Comptage non mis à jour après l'ajout des tests d'intégration        | Comptages corrigés dans le dépôt (`docs/07`, `docs/08`, `docs/11`), alignés sur le harnais réel                                               | Relecture croisée code/doc       | ✅ Corrigé |

## 3. Corrections antérieures (hygiène du dépôt)

Anomalies détectées et corrigées plus tôt dans le projet, consignées ici pour la traçabilité :

| Réf | Anomalie                                                                  | Gravité | Détection                  | Cause racine / Analyse                                      | Correction                                          | Non-régression              | Statut     |
| --- | ------------------------------------------------------------------------- | ------- | -------------------------- | ----------------------------------------------------------- | --------------------------------------------------- | --------------------------- | ---------- |
| B9  | Le job CI `docker-delivery` ne publiait pas l'image backend               | Moyenne | Pipeline CI                | Contexte/Dockerfile de build mal ciblés                     | `Dockerfile.prod` + job corrigés (commit `fcba33f`) | Pipeline CI vert            | ✅ Corrigé |
| B10 | Code mort : deux entités `Note` (`entity` vs `model`) prêtant à confusion | Faible  | Revue de code              | Scaffold non nettoyé ; `model.Note` jamais utilisé          | Suppression de `model/Note.java` + import commenté  | Compilation + tests backend | ✅ Corrigé |
| B11 | Stubs Angular morts (`login.ts`, `note-detail.ts` « … works! »)           | Faible  | Revue de code              | Fichiers générés non supprimés après refactor `*.component` | Suppression des stubs non routés                    | Lint + 37 tests Jest        | ✅ Corrigé |
| B12 | Classes compilées (`demo/bin/`) versionnées                               | Faible  | Revue du dépôt             | Absence de `bin/` dans `.gitignore`                         | `git rm --cached` + `.gitignore`                    | `git status` propre         | ✅ Corrigé |
| B13 | Documentation obsolète : « mots de passe en clair »                       | Faible  | Relecture croisée code/doc | Doc non mise à jour après ajout de BCrypt                   | Correction `ARTICLE_NOTES.md` / `CLAUDE.md`         | Relecture croisée code/doc  | ✅ Corrigé |

## 4. Anomalies connues non corrigées (limites assumées)

Ces points sont **documentés et acceptés** dans le cadre du projet démo (voir `docs/05-securite-owasp.md` et `docs/architecture.md`) — ils ne constituent pas des bogues mais des choix :

| Réf    | Limite                                          | Raison du non-traitement          |
| ------ | ----------------------------------------------- | --------------------------------- |
| LIM-01 | Pas de refresh token (reconnexion à 1h)         | Périmètre démo ; simplicité       |
| LIM-02 | Clés RSA régénérées au redémarrage              | H2 en mémoire, pas de persistance |
| LIM-03 | Console H2 / Swagger exposées                   | Pratique en développement         |
| LIM-04 | Pas de pagination sur `GET /notes`              | Volume de données faible          |
| LIM-05 | Journalisation de sécurité minimale (OWASP A09) | Hors périmètre démo               |

## 5. Analyse des tests en échec

Au dernier rejeu complet (backend 31, Jest 37, Cypress 20), **aucun test n'est en échec**. Toute nouvelle anomalie détectée sera ajoutée au registre §2 avec son analyse et son correctif.
