# 0004 — Clés RSA éphémères (régénérées au démarrage)

- **Statut** : Accepté (limite assumée)
- **Date** : 2026-07

## Contexte

La signature des JWT (RS256) nécessite une paire de clés RSA. Cette paire peut être **persistée** (fichier/keystore/secret) ou **générée à chaque démarrage**.

## Décision

Générer une **nouvelle paire RSA 2048** à chaque démarrage de l'application (`Jwks.generateRsa()`), conservée uniquement **en mémoire**.

## Conséquences

**Positives**
- Aucune gestion de secret/keystore pour la démo.
- Cohérent avec la base H2 en mémoire (rien à persister).

**Négatives / limites assumées**
- **Tous les jetons émis avant un redémarrage deviennent invalides** → reconnexion nécessaire (comportement attendu, pas un bug).
- Incompatible avec un déploiement multi-instances (chaque instance aurait ses propres clés).
- En production : persister les clés (keystore) ou utiliser un Authorization Server (voir [0001](0001-jwt-self-issued.md)).
