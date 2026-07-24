# Manuel d'utilisation

> Répond au critère C2.4.1. Guide de l'utilisateur final de l'application **Sticky Notes**.

## 1. Accès

Ouvrir **http://localhost:4200** (ou l'URL de l'environnement déployé).

## 2. Comptes de démonstration

| Rôle           | Identifiant | Mot de passe | Droits                                        |
| -------------- | ----------- | ------------ | --------------------------------------------- |
| Administrateur | `admin`     | `password`   | Lecture + **création** + suppression de notes |
| Utilisateur    | `user`      | `password`   | Lecture (création réservée à l'admin)         |

## 3. Fonctionnalités

### Consulter les notes (public)

La page d'accueil (`/notes`) affiche toutes les notes sous forme de cartes « post-it ». La consultation ne nécessite **pas** de connexion.

- Cliquer une carte (souris **ou** clavier via `Tab` + `Entrée`) ouvre le **détail** de la note.
- Depuis le détail, le lien « ← Back to board » ramène à la liste.

### Se connecter

1. Cliquer « Sign in » (en-tête) → page `/login`.
2. Saisir identifiant et mot de passe (astuce : les comptes de test sont cliquables pour pré-remplir le formulaire).
3. Le bouton « Sign In » s'active une fois les deux champs remplis.
4. En cas d'échec, un message « Invalid credentials » s'affiche.

### Créer une note (administrateur)

1. Connecté en tant qu'`admin`, sur `/notes`, cliquer « + New note ».
2. Renseigner le **titre** et le **contenu**.
3. Cliquer « Add note » : la note apparaît dans la liste.

### Supprimer une note

Survoler (ou naviguer au clavier vers) une carte fait apparaître la croix **✕** en bas à droite. La cliquer supprime la note.

### Se déconnecter

Cliquer « Sign out » dans l'en-tête. Le jeton est effacé et l'accès aux actions protégées est retiré.

## 4. Accessibilité

- Navigation complète au **clavier** (lien d'évitement « Skip to content », focus visible).
- Messages d'erreur annoncés aux lecteurs d'écran (`role="alert"`).
- Voir [06-accessibilite.md](06-accessibilite.md).

## 5. Bon à savoir

- La session expire après **1 heure** (reconnexion nécessaire).
- Les données sont en mémoire : un redémarrage du serveur **réinitialise** les notes aux valeurs de démonstration.
