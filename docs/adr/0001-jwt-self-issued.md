# 0001 — JWT auto-émis (self-issued)

- **Statut** : Accepté
- **Date** : 2026-07
- **Contexte technique** : authentification de l'API Spring Boot consommée par un SPA Angular.

## Contexte

L'application doit authentifier ses utilisateurs et protéger les écritures. Deux options : déléguer à un **Authorization Server externe** (Keycloak, Auth0) ou faire émettre les jetons par l'application elle-même.

## Décision

Le backend **émet et valide ses propres JWT** (RS256). Le endpoint `POST /token` (HTTP Basic) délivre un jeton signé avec une paire RSA générée par l'application ; le même service agit comme *OAuth2 Resource Server* pour valider ce jeton à chaque requête.

## Conséquences

**Positives**
- Aucune infrastructure externe à déployer/maintenir pour une démo.
- Chaîne de sécurité OAuth2/JWT standard et pédagogique.

**Négatives / limites assumées**
- Pas de séparation des responsabilités (émetteur = validateur).
- Pas de refresh token (voir [0004](0004-cles-rsa-ephemeres.md)).
- Non recommandé tel quel en production (préférer un AS dédié).
