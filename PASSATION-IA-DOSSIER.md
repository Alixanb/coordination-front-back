# Passation IA — contenu réel à recoller dans le dossier

> **But de ce fichier.** Fournir à l'IA rédactrice du dossier le **contenu réel, vérifié dans le dépôt**, pour remplir tous les emplacements balisés `⟨…⟩` ou `⚠️`. Chaque section ci-dessous correspond à une des 6 tâches restantes. Tout est copié **verbatim depuis les fichiers sources** (chemins indiqués) — ne pas paraphraser le code.
>
> État du dépôt au moment de la passation : `mvn clean test` = **31 tests backend au vert**, couverture JaCoCo **≈ 94 % instructions (815/868)**. Audit Lighthouse accessibilité **100/100**.

---

## Tâche 1 — Recoller les 9 user stories

Source de vérité : `docs/adr/0006-user-stories.md`. Table à insérer telle quelle (les noms de tests cités **existent réellement** dans le dépôt) :

| # | Rôle | User story | Critères d'acceptation | Preuve (test / recette) |
|---|------|-----------|------------------------|-------------------------|
| **US-01** | Visiteur | En tant que **visiteur**, je veux **consulter la liste des notes** sans me connecter, afin de découvrir le contenu partagé. | `GET /notes` renvoie 200 sans authentification ; le front affiche la grille. | `SecurityIntegrationTest.getNotesIsPublic`, `NoteServiceTest`, E2E `spec.cy.ts` |
| **US-02** | Visiteur | En tant que **visiteur**, je veux **filtrer les notes par catégorie**, afin de retrouver un sujet précis. | `GET /notes/name/{cat}` renvoie 200 et la liste filtrée. | `SecurityIntegrationTest.getNotesByCategoryIsPublic`, `NoteServiceTest.testGetByCategoryName` |
| **US-03** | Visiteur | En tant que **visiteur**, je veux **consulter le détail d'une note**, afin d'en lire le contenu complet. | `GET /notes/{id}` renvoie titre + contenu. | `NoteControllerTest.testGetById`, écran `note-detail` |
| **US-04** | Utilisateur | En tant qu'**utilisateur**, je veux **m'authentifier** avec mes identifiants, afin d'accéder aux actions protégées. | `POST /token` en HTTP Basic renvoie un JWT (1h) ; mauvais mot de passe → 401. | `SecurityIntegrationTest.tokenEndpointReturnsJwtForValidBasicAuth` / `...RejectsBadCredentials`, `login.component.spec.ts` |
| **US-05** | Administrateur | En tant qu'**administrateur**, je veux **créer une note** dans une catégorie, afin d'enrichir le contenu partagé. | `POST /notes` : ADMIN → 200, USER → 403, anonyme → 401. | `SecurityIntegrationTest.postNoteAsAdminIsAllowed` / `...AsUserIsForbidden` / `...AnonymousIsUnauthorized` |
| **US-06** | Utilisateur | En tant qu'**utilisateur** authentifié, je veux **modifier une note existante**, afin de corriger ou compléter son contenu. | `PUT /notes` exige une authentification (tout rôle). | `NoteControllerTest.testUpdate`, règle `SecurityConfig` |
| **US-07** | Utilisateur | En tant qu'**utilisateur** authentifié, je veux **supprimer une note**, afin de retirer un contenu obsolète. | `DELETE /notes/{id}` exige une authentification ; bouton avec `aria-label` explicite. | `NoteControllerTest.testDeleteById`, `note.component` |
| **US-08** | Utilisateur | En tant qu'**utilisateur**, je veux **rester connecté pendant ma session**, afin de ne pas ressaisir mes identifiants à chaque action. | JWT stocké en `localStorage`, injecté en `Authorization: Bearer` par l'intercepteur ; état exposé via un Signal (`AuthService.isAuthenticated`) qui pilote l'affichage des actions protégées. | `auth.interceptor.ts`, `auth.service.spec.ts` |
| **US-09** | Utilisateur | En tant qu'**utilisateur en situation de handicap**, je veux **naviguer au clavier et avec un lecteur d'écran**, afin d'utiliser l'application de façon autonome. | Lien d'évitement, `:focus-visible`, noms accessibles, contrastes AA. | Audit Lighthouse a11y **100/100** (`docs/06-accessibilite.md`) |

---

## Tâche 2 — Recoller les scénarios de recette sur les docs réelles

Source de vérité : `docs/07-cahier-de-recettes.md`. Les scénarios sont **déjà rédigés et au vert** ; ils se répartissent en 3 blocs :

- **§1 Authentification** — 8 scénarios `AUTH-01 … AUTH-08`.
- **§2 Gestion des notes (CRUD)** — 12 scénarios `NOTE-01 … NOTE-12`.
- **§3 Sécurité et contrôle d'accès** — 7 scénarios `SEC-01 … SEC-07`.

**Correspondance US → recette** (pour la traçabilité du dossier) :

| US | Scénarios de recette associés |
|----|-------------------------------|
| US-01 | NOTE-01, SEC-01 |
| US-02 | NOTE-12 |
| US-03 | NOTE-05, NOTE-10 |
| US-04 | AUTH-04, AUTH-05, AUTH-08 |
| US-05 | NOTE-11, SEC-02, SEC-03, SEC-04 |
| US-06 | (PUT — couvert par `NoteControllerTest.testUpdate`) |
| US-07 | NOTE-07, NOTE-08, SEC-05 |
| US-08 | AUTH-06 |
| US-09 | (audit a11y — `docs/06-accessibilite.md` §4) |

> ⚠️ **À corriger dans `docs/07-cahier-de-recettes.md` §4** (table « Couverture par les tests automatisés ») : la ligne backend indique encore **« JUnit / MockMvc (backend) | 18 »**. Le chiffre réel est désormais **31** (ajout de `SecurityIntegrationTest` = 9, `UserInitializatorTest` = 2, `SecurityConfigTest` = 2). Portée à mettre à jour : « Controllers + services + **configuration de sécurité (chaînes de filtres, seed, CORS) via test d'intégration `@SpringBootTest`** ».

---

## Tâche 3 — Les 4 extraits de code (verbatim)

### Extrait 3.1 — Intercepteur d'authentification

Fichier : `front/src/app/interceptors/auth.interceptor.ts`

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
```

### Extrait 3.2 — Test d'intégration de sécurité

Fichier : `demo/src/test/java/com/example/demo/SecurityIntegrationTest.java` (méthodes clés — le reste = imports/`@SpringBootTest`)

```java
@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getNotesIsPublic() throws Exception {
        mockMvc.perform(get("/notes"))
            .andExpect(status().isOk());
    }

    @Test
    void postNoteAnonymousIsUnauthorized() throws Exception {
        mockMvc.perform(post("/notes")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Anon\",\"content\":\"x\"}"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void postNoteAsUserIsForbidden() throws Exception {
        mockMvc.perform(post("/notes")
                .with(httpBasic("user", "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"User note\",\"content\":\"x\"}"))
            .andExpect(status().isForbidden());
    }

    @Test
    void postNoteAsAdminIsAllowed() throws Exception {
        mockMvc.perform(post("/notes")
                .with(httpBasic("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Admin note\",\"content\":\"x\"}"))
            .andExpect(status().isOk());
    }

    @Test
    void tokenEndpointReturnsJwtForValidBasicAuth() throws Exception {
        mockMvc.perform(post("/token")
                .with(httpBasic("admin", "password")))
            .andExpect(status().isOk())
            .andExpect(content().string(not(emptyOrNullString())));
    }
}
```

### Extrait 3.3 — Les deux `SecurityFilterChain`

Fichier : `demo/src/main/java/com/example/demo/config/SecurityConfig.java`

```java
/**
 * Public chain: handles GET /notes and GET /notes/** without an oauth2ResourceServer.
 * A separate chain is required because BearerTokenAuthenticationFilter (added by
 * oauth2ResourceServer) challenges anonymous requests before permitAll() is evaluated.
 */
@Bean
@Order(1)
public SecurityFilterChain publicReadChain(HttpSecurity http) throws Exception {
    return http
        .securityMatcher(new OrRequestMatcher(
            PathPatternRequestMatcher.pathPattern(HttpMethod.GET, "/notes"),
            PathPatternRequestMatcher.pathPattern(HttpMethod.GET, "/notes/**")
        ))
        .cors(Customizer.withDefaults())
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(authorize -> authorize.anyRequest().permitAll())
        .build();
}

/**
 * Secured chain: handles writes, token endpoint, and anything else not matched by the public chain.
 */
@Bean
@Order(2)
public SecurityFilterChain securedChain(HttpSecurity http) throws Exception {
    return http
        .cors(Customizer.withDefaults())
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(authorize -> authorize
            .requestMatchers("/token").authenticated()
            .requestMatchers(HttpMethod.POST, "/notes/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.PUT, "/notes/**").authenticated()
            .requestMatchers(HttpMethod.DELETE, "/notes/**").authenticated()
            .anyRequest().authenticated()
        )
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
        .httpBasic(Customizer.withDefaults())
        .build();
}
```

### Extrait 3.4 — Configuration ESLint (règles d'accessibilité)

Fichier : `front/eslint.config.js` (le bloc `**/*.html` active `templateAccessibility` — la porte a11y en CI)

```javascript
// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
    },
  },
  {
    // Les fichiers de test utilisent légitimement `any` et des mocks vides.
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);
```

---

## Tâche 4 — Les 3 captures à insérer

Lancer l'app (`./start.sh`, front sur `http://localhost:4200`) puis capturer :

| # | Écran | URL | Ce qui doit être visible | Placeholder probable |
|---|-------|-----|--------------------------|----------------------|
| **Capture 1** | Écran de connexion | `/login` | Formulaire username/password, bouton « Sign In » | Illustration US-04 / AUTH-01 |
| **Capture 2** | Liste des notes (board) | `/notes` | Grille de cartes « corkboard », notes seedées | Illustration US-01 / NOTE-01 |
| **Capture 3** | Rapport Lighthouse a11y | onglet Lighthouse | Jauge **Accessibility 100** | Preuve C2.2.3 — **déjà archivé** dans `docs/audits/lighthouse-notes-2026-07-20.html` (ouvrir + capturer la jauge) |

> Comptes de démo pour les captures : `admin/password` (ADMIN) ou `user/password` (USER).

---

## Tâche 5 — Éditeur utilisé

**Visual Studio Code.** Preuve dans le dépôt : présence de `.vscode/settings.json` (aucun `.idea/` IntelliJ). Formuler par ex. : « Environnement de développement : **Visual Studio Code** (configuration versionnée dans `.vscode/`), build backend via wrapper Maven `./mvnw`, build frontend via Angular CLI. »

> ⚠️ Si l'un des membres a réellement utilisé un autre éditeur (IntelliJ pour le back), le préciser — sinon VS Code est la seule trace présente dans le dépôt.

---

## Tâche 6 — Recaler la pagination après export PDF

Étape **manuelle post-export**, à faire dans l'outil de génération PDF (pas dans le Markdown) :
- Vérifier qu'aucun bloc de code des extraits 3.1–3.4 n'est coupé en travers d'un saut de page.
- Vérifier que chaque diagramme Mermaid (D.1–D.7) tient sur une page et n'est pas rogné.
- Régénérer la table des matières / numéros de page **après** insertion des 3 captures (elles décalent la pagination).

---

## Rappel — Visuels D.1 à D.7 (déjà faits)

Les 7 visuels sont **déjà présents en Mermaid** dans le dossier (architecture, pipeline CI/CD, séquence d'authentification, MCD, processus de correction de bogues, etc.), chacun accompagné de sa **spécification rédigée pour l'IA graphique** comme demandé au § D. **Aucune action requise** sur ce point — ne pas les régénérer, seulement vérifier leur pagination (voir Tâche 6).

---

### Récapitulatif de cohérence (chiffres à ne pas contredire dans le dossier)

| Élément | Valeur exacte |
|---------|---------------|
| Tests backend (JUnit + intégration) | **31** au vert |
| Couverture backend JaCoCo | **≈ 94 %** instructions (815/868, `mvn clean test`) |
| `SecurityConfig` / `UserInitializator` / `TokenService` | **100 %** |
| Tests frontend Jest | 37 |
| Tests E2E Cypress | 20 |
| Lighthouse — Accessibilité | **100 / 100** (color-contrast : 0 échec) |
| Comptes de démo | `admin/password` (ADMIN), `user/password` (USER) |
| Référentiel a11y | RGAA 4.1 / WCAG 2.1 AA |
