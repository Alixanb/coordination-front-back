# 0005 — Stratégie de livraison Docker

- **Statut** : Accepté
- **Date** : 2026-07

## Contexte

Le logiciel doit être livré de façon reproductible « à chaque modification de code » (C2.2.4), depuis GitHub.

## Décision

Publier une **image Docker** de l'application via un job CI (`docker-delivery`) déclenché après des tests et builds verts. L'image backend (`eclipse-temurin:17-jre` + JAR) est poussée sur **Docker Hub** (`alixanb/coordination-front-back`).

## Conséquences

**Positives**
- Livraison automatisée et reproductible à chaque push `main` validé.
- Artefact déployable identique quel que soit l'environnement cible.
- Traçabilité via tags Git + `CHANGELOG.md`.

**Négatives / limites assumées**
- Seule l'image **backend** est publiée automatiquement ; l'image frontend (`front/Dockerfile.prod`) n'est pas encore intégrée au pipeline et requiert une correction (voir [08-plan-correction-bogues.md](../08-plan-correction-bogues.md)).
- Tag `:latest` uniquement — le versionnement d'image (`:x.y.z`) reste à généraliser pour faciliter le rollback.
- Pas d'environnement de staging distinct.
