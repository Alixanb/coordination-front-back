# Sécurité — Couverture OWASP Top 10 (2021)

> Répond au critère C2.2.3 : « les mesures prises permettent de couvrir les 10 failles de sécurité principales décrites par l'OWASP ».
> Contexte : projet académique/démo. Certaines limites sont **assumées et documentées** (base H2 en mémoire, clés RSA éphémères) ; elles seraient traitées différemment en production.

## Synthèse

| #   | Faille OWASP 2021              | Niveau       | Mesure en place                                |
| --- | ------------------------------ | ------------ | ---------------------------------------------- |
| A01 | Broken Access Control          | 🟢 Couvert   | Contrôle de rôle serveur (`SecurityConfig`)    |
| A02 | Cryptographic Failures         | 🟢 Couvert   | BCrypt (mots de passe) + JWT RS256             |
| A03 | Injection                      | 🟢 Couvert   | JPA/requêtes paramétrées, pas de SQL concaténé |
| A04 | Insecure Design                | 🟡 Partiel   | Séparation des chaînes de sécurité, stateless  |
| A05 | Security Misconfiguration      | 🟡 Amélioré  | CORS restreint ; H2/Swagger exposés (démo)     |
| A06 | Vulnerable Components          | 🟡 Partiel   | Spring Boot 4 récent ; pas de scan auto        |
| A07 | Identification & Auth Failures | 🟢 Couvert   | Auth Spring Security, JWT signé, expiration 1h |
| A08 | Software & Data Integrity      | 🟡 Partiel   | Signature JWT ; livraison Docker               |
| A09 | Logging & Monitoring Failures  | 🔴 À traiter | Logs applicatifs basiques uniquement           |
| A10 | Server-Side Request Forgery    | 🟢 N/A       | Aucun appel sortant piloté par l'utilisateur   |

## Détail par faille

### A01 — Broken Access Control 🟢

- Autorisation déclarative dans `SecurityConfig` : `GET /notes*` public, `POST /notes` = `hasRole("ADMIN")`, `PUT`/`DELETE` = authentifié.
- Deux `SecurityFilterChain` séparées : une chaîne publique en lecture, une chaîne sécurisée pour les écritures et `/token`.
- Sessions **STATELESS** : aucune session serveur exploitable.

### A02 — Cryptographic Failures 🟢

- Mots de passe **hachés avec BCrypt** (`BCryptPasswordEncoder` dans `DemoApplication`, appliqué par `UserService.saveUser`) — jamais stockés en clair.
- JWT signés en **RS256** (RSA 2048, clé privée en mémoire ; clé publique pour validation).

### A03 — Injection 🟢

- Accès aux données via **Spring Data JPA** (requêtes dérivées / paramétrées) : pas de concaténation SQL.
- Entrées désérialisées en DTO/entités typés.

### A04 — Insecure Design 🟡

- Modèle « self-issued JWT » assumé (voir `docs/adr/0001-jwt-self-issued.md`).
- **Limite assumée** : pas de refresh token (reconnexion à 1h), clés RSA non persistées.

### A05 — Security Misconfiguration 🟡 (amélioré dans ce lot)

- **CORS durci** : `allowedOrigins` restreint à `http://localhost:4200` (externalisé dans `application.properties`, `app.cors.allowed-origins`) au lieu du joker `*`.
- CSRF désactivé — cohérent avec une API stateless consommée par un SPA porteur de token.
- **Limite assumée (démo)** : console H2 (`/h2-console`) et Swagger UI exposés. En production : désactiver H2, restreindre Swagger à un profil interne.

### A06 — Vulnerable and Outdated Components 🟡

- Dépendances récentes (Spring Boot 4.0.1, Angular 21).
- **Piste** : ajouter un scan automatique (`dependabot`, `npm audit`, OWASP Dependency-Check) en CI.

### A07 — Identification and Authentication Failures 🟢

- Authentification via Spring Security (`UserDetailsService` + BCrypt).
- Token signé, `issuer` contrôlé, expiration 1h ; validation de signature à chaque requête (resource server).

### A08 — Software and Data Integrity Failures 🟡

- Intégrité des tokens garantie par la signature RS256.
- Livraison via image Docker versionnée (`docker-delivery`).
- **Piste** : signer les images / verrouiller les versions de base.

### A09 — Security Logging and Monitoring Failures 🔴

- **À traiter** : pas de journalisation de sécurité dédiée (tentatives d'auth échouées, accès refusés).
- **Piste** : logs structurés + alerting.

### A10 — Server-Side Request Forgery 🟢

- L'application n'effectue **aucune requête sortante** à partir d'une URL fournie par l'utilisateur → surface nulle.

## Tests de sécurité associés

Les contrôles d'accès sont vérifiés fonctionnellement (voir `docs/07-cahier-de-recettes.md`) : POST refusé à un USER, écritures refusées sans token, émission de token en Basic.
