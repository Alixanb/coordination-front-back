# 0002 — Base de données H2 en mémoire

- **Statut** : Accepté
- **Date** : 2026-07

## Contexte

Le projet a besoin d'une persistance relationnelle pour les notes, catégories et utilisateurs, sans contrainte d'exploitation lourde (contexte académique/démo).

## Décision

Utiliser **H2 en mémoire** (`jdbc:h2:mem:testdb`) avec Spring Data JPA / Hibernate. Les données sont **ensemencées au démarrage** par `UserInitializator`.

## Conséquences

**Positives**
- Zéro installation ; démarrage instantané.
- Tests d'intégration rapides et isolés (base fraîche à chaque run).
- Console H2 disponible pour l'inspection en développement.

**Négatives / limites assumées**
- **Données non persistées** : tout redémarrage réinitialise la base.
- Dialecte H2 ≠ moteur de production (écarts possibles).
- Console H2 exposée : à désactiver hors développement (voir [05-securite-owasp.md](../05-securite-owasp.md), A05).
