# Dossier technique — Sommaire

> Dossier professionnel **Bloc 2 : Concevoir et développer des applications logicielles** (RNCP).
> Projet **Sticky Notes** — application fullstack de prise de notes (Spring Boot 4 + Angular 21).

## Grille de lecture jury (compétence → livrable)

| Compétence | Livrable attendu                                | Document                                                                                                                                                             |
| ---------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C2.1.1** | Environnements + outils qualité/perf            | [01-environnements.md](01-environnements.md) · [04-criteres-qualite-performance.md](04-criteres-qualite-performance.md)                                              |
| **C2.1.2** | Protocole d'intégration continue                | [02-protocole-ci.md](02-protocole-ci.md)                                                                                                                             |
| **C2.2.1** | Prototype + user stories + sécurité             | [architecture.md](architecture.md) · [ADR 0006 — User stories](adr/0006-user-stories.md) · [05-securite-owasp.md](05-securite-owasp.md)                              |
| **C2.2.2** | Harnais de tests unitaires                      | [07-cahier-de-recettes.md](07-cahier-de-recettes.md) (§4) · [ADR 0007 — Stratégie de tests](adr/0007-strategie-tests-couverture.md) · code `*.spec.ts`, `*Test.java` |
| **C2.2.3** | Sécurité OWASP + accessibilité                  | [05-securite-owasp.md](05-securite-owasp.md) · [06-accessibilite.md](06-accessibilite.md) (audit Lighthouse a11y **100/100**)                                        |
| **C2.2.4** | Déploiement continu                             | [03-protocole-cd.md](03-protocole-cd.md) · [09-manuel-deploiement.md](09-manuel-deploiement.md)                                                                      |
| **C2.3.1** | Cahier de recettes                              | [07-cahier-de-recettes.md](07-cahier-de-recettes.md)                                                                                                                 |
| **C2.3.2** | Plan de correction des bogues                   | [08-plan-correction-bogues.md](08-plan-correction-bogues.md)                                                                                                         |
| **C2.4.1** | Manuels déploiement / utilisation / mise à jour | [09](09-manuel-deploiement.md) · [10](10-manuel-utilisation.md) · [11](11-manuel-mise-a-jour.md)                                                                     |

## Décisions d'architecture (ADR)

| ADR                                            | Sujet                                              |
| ---------------------------------------------- | -------------------------------------------------- |
| [0001](adr/0001-jwt-self-issued.md)            | JWT auto-émis (pas d'Authorization Server externe) |
| [0002](adr/0002-h2-in-memory.md)               | Base H2 en mémoire                                 |
| [0003](adr/0003-angular-signals-standalone.md) | Angular standalone + Signals                       |
| [0004](adr/0004-cles-rsa-ephemeres.md)         | Clés RSA éphémères                                 |
| [0005](adr/0005-strategie-docker-delivery.md)  | Livraison Docker                                   |
| [0006](adr/0006-user-stories.md)               | User stories (backlog fonctionnel)                 |
| [0007](adr/0007-strategie-tests-couverture.md) | Stratégie de tests unitaires & couverture          |

## Autres documents

- [architecture.md](architecture.md) — architecture détaillée back & front.
- [CHANGELOG.md](../CHANGELOG.md) — historique des versions.
- [README.md](../README.md) — prise en main rapide.
