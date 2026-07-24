# Accessibilité

> Répond au critère C2.2.3 : « le référentiel d'accessibilité choisi est présenté et justifié » et « le prototype permet de répondre aux exigences du référentiel ».

## 1. Référentiel choisi et justification

Le référentiel retenu est le **RGAA 4.1** (Référentiel Général d'Amélioration de l'Accessibilité), complété par les bonnes pratiques **OPQUAST** pour la qualité web.

**Justification :**

- Le RGAA est le **référentiel officiel français**, cohérent avec le contexte académique (Ynov) et transposition du WCAG 2.1 niveau AA.
- Il fournit une grille de critères vérifiables (images, formulaires, navigation clavier, contrastes, structure) directement applicable à une SPA.
- Cible visée : **WCAG 2.1 niveau AA**.

## 2. Actions mises en œuvre

| Thème RGAA / WCAG           | Action réalisée                                                                                  | Fichier                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| Structure / landmarks       | Ajout d'un `<main id="main-content">` et d'un `<header>`/`<nav aria-label>`                      | `front/src/app/app.html`                           |
| Navigation clavier          | **Lien d'évitement** (« Skip to content ») masqué puis visible au focus                          | `front/src/app/app.html` + `styles.scss`           |
| Focus visible               | Style **`:focus-visible`** global sur tous les éléments interactifs                              | `front/src/styles.scss`                            |
| Liens vs boutons            | Carte de note rendue **navigable au clavier** via un vrai `<a>` (au lieu d'un `<div>` cliquable) | `front/src/app/note/note.component.html`           |
| Nom accessible              | `aria-label` dynamique sur le bouton de suppression (« Supprimer la note … »)                    | `front/src/app/note/note.component.html`           |
| Contrôle visible au clavier | Bouton supprimer révélé au **focus** (plus seulement au survol)                                  | `front/src/app/note/note.component.scss`           |
| Messages d'erreur           | `role="alert"` sur les messages d'erreur (login, création, backend)                              | `login.component.html`, `note-list.component.html` |
| Formulaires                 | `<label for>` associés + `autocomplete` (username / current-password)                            | `login.component.html`                             |
| Langue                      | `lang="en"` cohérent avec la langue de l'interface (microcopie en anglais)                       | `front/src/index.html`                             |

## 3. Contrôle automatisé (continu)

Le lint frontend intègre les règles **`angular-eslint` template-accessibility** (`eslint.config.js`), exécutées **à chaque build CI** (`npm run lint`, bloquant). Elles couvrent notamment :

- `click-events-have-key-events` / `interactive-supports-focus` (clavier),
- `label-has-associated-control` (formulaires),
- `alt-text` (images),
- `valid-aria` / `role-has-required-aria`.

État actuel : **tous les templates passent le lint d'accessibilité** (0 violation).

## 4. Audit Lighthouse réalisé

Un audit **Lighthouse 13.3.0** (moteur **axe-core**, onglet _Accessibility_ de Chrome DevTools) a été exécuté sur l'application lancée localement.

- **Date** : 2026-07-20
- **URL auditée** : `http://localhost:4200/notes` (écran principal, grille de notes)
- **Rapport brut archivé** : [`audits/lighthouse-notes-2026-07-20.html`](audits/lighthouse-notes-2026-07-20.html) (+ export JSON dans le même dossier)

### Résultats

| Catégorie         |                                                     Score |
| ----------------- | --------------------------------------------------------: |
| **Accessibilité** |                                             **100 / 100** |
| Bonnes pratiques  |                                                 100 / 100 |
| SEO               |                                                  90 / 100 |
| Performance       | 55 / 100 _(hors périmètre a11y — dev build non optimisé)_ |

### Détail des critères d'accessibilité vérifiés (tous ✅)

| Critère RGAA / WCAG (audit axe)                        | Résultat                                                                  |
| ------------------------------------------------------ | ------------------------------------------------------------------------- |
| **`color-contrast`** — contrastes texte/fond ≥ 4.5:1   | ✅ **0 élément en échec** — la palette « corkboard » respecte le ratio AA |
| `button-name` / `link-name` — noms accessibles         | ✅                                                                        |
| `aria-*` (valid-attr, allowed-attr, prohibited-attr…)  | ✅                                                                        |
| `label` / formulaires                                  | ✅                                                                        |
| `document-title` / `html-has-lang` / `html-lang-valid` | ✅                                                                        |
| `heading-order` — hiérarchie des titres                | ✅                                                                        |
| `skip-link` — lien d'évitement fonctionnel             | ✅                                                                        |
| `landmark-one-main` — un seul `<main>`                 | ✅                                                                        |
| `target-size` — taille des cibles tactiles             | ✅                                                                        |
| `meta-viewport` — zoom non bloqué                      | ✅                                                                        |

> Le point de vigilance sur les **contrastes de la palette « corkboard »** (encre brune sur post-it clair) est donc **levé** : l'audit `color-contrast` ne remonte aucun élément en échec.

### Vérifications manuelles complémentaires (revue humaine, hors Lighthouse)

Ces critères relèvent d'une revue manuelle (marqués _manual_ par Lighthouse) et ont été contrôlés à la main :

- **Ordre de tabulation** logique sur la grille de notes (`logical-tab-order`) — OK.
- Navigation clavier complète (lien d'évitement → nav → carte de note → bouton supprimer) — OK.

### Reproduire l'audit

```bash
./start.sh                 # app sur http://localhost:4200
# Chrome DevTools → Lighthouse → catégorie Accessibility → Analyze
```
