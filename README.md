# Sticky Notes

Application de prise de notes avec authentification, catégorisation et gestion complète des notes.

## Stack

- **Backend** (`demo/`) — Java, Spring Boot 4, H2 (in-memory), OAuth2/JWT
- **Frontend** (`front/`) — Angular 21

## Lancer le projet

```bash
./start.sh
```

Le script démarre le backend (port 9090) et le frontend (port 4200), puis ouvre **http://localhost:4200**.

**Comptes de test :**
| Rôle | Utilisateur | Mot de passe |
|------|-------------|--------------|
| Admin | `admin` | `password` |
| Utilisateur | `user` | `password` |

## Tests

- **Backend (Java)** — routes et logique métier
- **Frontend (Jest)** — comportement des composants
- **E2E (Cypress)** — parcours utilisateur complets