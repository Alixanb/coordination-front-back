# Manuel de mise à jour

> Répond au critère C2.4.1. Décrit la procédure de montée de version du logiciel.

## 1. Récupérer une nouvelle version

```bash
git pull origin main
git tag --list            # versions disponibles (ex. v1.0.0)
```

## 2. Mettre à jour les dépendances

**Backend** — les versions sont gérées par Maven (`demo/pom.xml`). Après un pull :

```bash
cd demo && ./mvnw clean verify   # recompile, teste, vérifie le style
```

**Frontend** — après modification de `package.json` :

```bash
cd front && npm ci               # installe exactement le package-lock.json
```

> Utiliser `npm ci` (et non `npm install`) pour rester aligné sur le `package-lock.json` versionné.

## 3. Rejouer la non-régression

Avant tout redéploiement, valider la chaîne de tests :

```bash
cd demo && ./mvnw test           # 31 tests backend
cd front && npm run lint         # lint (incl. accessibilité)
cd front && npm test             # 37 tests Jest
cd front && npm run e2e          # 20 tests Cypress
```

Se référer au [cahier de recettes](07-cahier-de-recettes.md) : tous les scénarios doivent rester au vert.

## 4. Reconstruire et redéployer

```bash
cd demo && ./mvnw package -DskipTests    # nouveau JAR
cd front && npm run build                # nouveau bundle
```

Puis reconstruire l'image Docker (voir [09-manuel-deploiement.md](09-manuel-deploiement.md)). En production, redéployer l'image en la taguant avec la nouvelle version pour permettre un **rollback** vers la précédente en cas de problème.

## 5. Gestion des changements cassants (breaking changes)

- Consulter le [CHANGELOG.md](../CHANGELOG.md) : la section de la version cible liste les changements notables.
- Les changements de configuration (nouvelles clés `application.properties`, variables d'environnement) y sont signalés.
- Les clés RSA étant régénérées à chaque redémarrage, **tous les jetons émis sont invalidés** après une mise à jour du backend : les utilisateurs devront se reconnecter (comportement attendu).

## 6. Versionnement

Le projet suit le **versionnement sémantique** (`MAJEUR.MINEUR.CORRECTIF`). Poser un tag Git à chaque livraison :

```bash
git tag -a v1.1.0 -m "Description de la version"
git push origin v1.1.0
```
