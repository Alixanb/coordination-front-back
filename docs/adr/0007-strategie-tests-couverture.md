# 0007 — Stratégie de tests unitaires et couverture

- **Statut** : Accepté
- **Date** : 2026-07

## Contexte

Le critère **C2.2.2** attend un **harnais de tests unitaires** couvrant « la majorité du code ». La mesure de couverture backend (JaCoCo) plafonnait à **≈ 37 %** : les couches `controller/`, `service/` et `dto/` étaient testées, mais la configuration (`config/`) — pourtant porteuse de la logique de sécurité — ne l'était pas du tout (`SecurityConfig`, `UserInitializator`, `Jwks` à 0 %). 37 % ne constitue pas une « majorité » défendable devant un jury.

## Décision

Compléter le harnais avec deux niveaux de tests, sans introduire de nouvelle dépendance (starters `*-test` déjà présents) :

1. **Tests unitaires isolés (Mockito)** pour la logique métier et les branches de configuration :
   - `UserInitializatorTest` — vérifie le seed (base vierge) **et** l'idempotence (base déjà peuplée), les deux branches de chaque `if`.
   - `SecurityConfigTest` — vérifie le bean CORS restreint (origines explicites, méthodes, credentials), via `ReflectionTestUtils` pour injecter `app.cors.allowed-origins`.

2. **Un test d'intégration bout-en-bout** (`SecurityIntegrationTest`, `@SpringBootTest` + `@AutoConfigureMockMvc`) qui démarre le contexte Spring complet et exerce les **règles d'autorisation réelles** : `GET /notes` public, `POST /notes` réservé ADMIN (401/403/200), `POST /token` (JWT émis, mauvais mot de passe rejeté). Ce test couvre en une passe `SecurityConfig` (chaînes de filtres), les beans JWT de `DemoApplication`, `Jwks` et le `CommandLineRunner` de seed.

### Pourquoi un test d'intégration plutôt que des mocks partout

Les chaînes de sécurité (`SecurityFilterChain`) et l'émission/validation du JWT ne se testent pas de façon crédible en isolation : leur comportement **émerge** de l'assemblage des filtres Spring Security. Un test qui boote le contexte et tape les endpoints valide la **règle effective**, pas une reconstitution mockée qui pourrait diverger de la production.

## Conséquences

**Positives**
- Couverture backend passée de **37 % à 94 %** (instructions, JaCoCo, build propre `mvn clean test` : 815/868) ; `SecurityConfig`, `UserInitializator`, `TokenService` à **100 %**.
- Les règles d'autorisation (cœur sécurité, OWASP A01) sont désormais **testées de bout en bout**, pas seulement documentées.
- Le test d'intégration sert aussi de **test de fumée** (`contextLoads`) : toute régression de configuration casse le build CI.

**Négatives / limites assumées**
- `@SpringBootTest` ajoute ~10 s au build (démarrage du contexte) — acceptable pour ce volume.
- Restent volontairement non couverts : `model/Note` (**code mort** documenté, à supprimer), certains getters/setters d'entités JPA, et `main()` de `DemoApplication`. Aucune **porte de couverture (gate) bloquante** n'est configurée en CI — le seuil reste un objectif documenté, cohérent avec le cadre académique.

## Liens

- Fonctionnalités testées : [0006 — User stories](0006-user-stories.md)
- Cas de recette associés : [cahier de recettes](../07-cahier-de-recettes.md)
- Règles de sécurité vérifiées : [05-securite-owasp.md](../05-securite-owasp.md)
