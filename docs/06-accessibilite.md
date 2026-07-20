# Accessibilité

> Répond au critère C2.2.3 : « le référentiel d'accessibilité choisi est présenté et justifié » et « le prototype permet de répondre aux exigences du référentiel ».

## 1. Référentiel choisi et justification

Le référentiel retenu est le **RGAA 4.1** (Référentiel Général d'Amélioration de l'Accessibilité), complété par les bonnes pratiques **OPQUAST** pour la qualité web.

**Justification :**
- Le RGAA est le **référentiel officiel français**, cohérent avec le contexte académique (Ynov) et transposition du WCAG 2.1 niveau AA.
- Il fournit une grille de critères vérifiables (images, formulaires, navigation clavier, contrastes, structure) directement applicable à une SPA.
- Cible visée : **WCAG 2.1 niveau AA**.

## 2. Actions mises en œuvre

| Thème RGAA / WCAG | Action réalisée | Fichier |
|-------------------|-----------------|---------|
| Structure / landmarks | Ajout d'un `<main id="main-content">` et d'un `<header>`/`<nav aria-label>` | `front/src/app/app.html` |
| Navigation clavier | **Lien d'évitement** (« Skip to content ») masqué puis visible au focus | `front/src/app/app.html` + `styles.scss` |
| Focus visible | Style **`:focus-visible`** global sur tous les éléments interactifs | `front/src/styles.scss` |
| Liens vs boutons | Carte de note rendue **navigable au clavier** via un vrai `<a>` (au lieu d'un `<div>` cliquable) | `front/src/app/note/note.component.html` |
| Nom accessible | `aria-label` dynamique sur le bouton de suppression (« Supprimer la note … ») | `front/src/app/note/note.component.html` |
| Contrôle visible au clavier | Bouton supprimer révélé au **focus** (plus seulement au survol) | `front/src/app/note/note.component.scss` |
| Messages d'erreur | `role="alert"` sur les messages d'erreur (login, création, backend) | `login.component.html`, `note-list.component.html` |
| Formulaires | `<label for>` associés + `autocomplete` (username / current-password) | `login.component.html` |
| Langue | `lang="en"` cohérent avec la langue de l'interface (microcopie en anglais) | `front/src/index.html` |

## 3. Contrôle automatisé (continu)

Le lint frontend intègre les règles **`angular-eslint` template-accessibility** (`eslint.config.js`), exécutées **à chaque build CI** (`npm run lint`, bloquant). Elles couvrent notamment :
- `click-events-have-key-events` / `interactive-supports-focus` (clavier),
- `label-has-associated-control` (formulaires),
- `alt-text` (images),
- `valid-aria` / `role-has-required-aria`.

État actuel : **tous les templates passent le lint d'accessibilité** (0 violation).

## 4. Audit manuel recommandé (procédure)

Pour compléter le contrôle automatique, réaliser un audit **Lighthouse** (onglet *Accessibility* de Chrome DevTools) ou **axe DevTools** sur les 3 écrans (`/login`, `/notes`, `/notes/:id`) :

```bash
./start.sh                 # app sur http://localhost:4200
# Chrome DevTools → Lighthouse → catégorie Accessibility → Analyze
```

Points de vigilance restants à vérifier lors de l'audit :
- **Contrastes** de la palette « corkboard » (encre brune sur post-it clair) — viser un ratio ≥ 4.5:1 pour le texte courant.
- Ordre de tabulation logique sur la grille de notes.
- Annonce du chargement (`aria-live`) sur l'état « Loading… ».
