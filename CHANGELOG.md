# Changelog

Toutes les évolutions notables du projet **Sticky Notes** sont documentées ici.
Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) ; versionnement [sémantique](https://semver.org/lang/fr/).

## [1.0.0] — 2026-07-24

Mise en conformité pour le dossier professionnel Bloc 2 (RNCP) et durcissement du projet.

### Ajouté
- **Dossier technique** complet dans `docs/` : environnements, protocoles CI/CD, critères qualité, sécurité OWASP, accessibilité, cahier de recettes, plan de correction des bogues, 3 manuels (déploiement, utilisation, mise à jour), sommaire de lecture jury.
- **ADR** (`docs/adr/`) : 7 décisions d'architecture documentées, dont [0006 — User stories](docs/adr/0006-user-stories.md) (backlog fonctionnel formalisé : 9 US reliées à leurs tests) et [0007 — Stratégie de tests & couverture](docs/adr/0007-strategie-tests-couverture.md).
- **Tests backend** : test d'intégration `@SpringBootTest` sur les règles d'autorisation (`SecurityIntegrationTest`) + tests unitaires `UserInitializatorTest` et `SecurityConfigTest`. Couverture JaCoCo portée de **37 % à 94 %** (instructions, build propre 815/868).
- **Audit d'accessibilité** : rapport Lighthouse archivé dans `docs/audits/` — score **accessibilité 100/100**, `color-contrast` sans échec (palette « corkboard » conforme AA).
- **Portes qualité CI** : JaCoCo (couverture backend), Checkstyle (non bloquant), ESLint `angular-eslint` (bloquant, incl. règles d'accessibilité), couverture Jest.
- `CLAUDE.md` racine (documentation d'orientation du dépôt).

### Modifié
- **Sécurité (OWASP A05)** : CORS restreint à des origines explicites (`app.cors.allowed-origins`) au lieu du joker `*`.
- **Accessibilité (RGAA/WCAG AA)** : landmark `<main>`, lien d'évitement, focus visible global, carte de note navigable au clavier (vrai `<a>`), `aria-label` de suppression, `role="alert"` sur les erreurs.
- CI : lint frontend ajouté (bloquant), publication du rapport de couverture JaCoCo.
- Documentation d'architecture déplacée : `ARTICLE_NOTES.md` → `docs/architecture.md` ; corrections des mentions obsolètes (BCrypt déjà en place, usage de Docker).

### Supprimé
- Code mort backend (`model/Note.java`) et stubs Angular non routés (`login/login.*`, `note-detail/note-detail.*`).
- Classes compilées versionnées (`demo/bin/`) désormais ignorées (`bin/` ajouté au `.gitignore`).

### Corrigé
- **Livraison frontend** : le job `docker-delivery` construit et publie désormais l'image `alixanb/coordination-front` ; `front/Dockerfile.prod` corrigé (fautes de frappe, chemin de build).
- CI backend exécutée via le Maven Wrapper (`./mvnw`) pour épingler la version de Maven.
- `EXPOSE 9090` dans `demo/Dockerfile.prod`, aligné sur `server.port`.
- Registre des anomalies (`docs/08`) restructuré (B1–B13 + limites assumées) et comptages de tests corrigés (18 → 31 backend).

### Sécurité
- Mots de passe hachés avec BCrypt (déjà en place, confirmé et documenté).

## [v1] — antérieur

Version initiale : application fullstack fonctionnelle (auth JWT, CRUD notes, catégories), tests backend/frontend/E2E, pipeline CI avec livraison Docker.
