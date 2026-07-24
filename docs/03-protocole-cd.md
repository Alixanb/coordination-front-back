# Protocole de déploiement continu (CD)

> Répond au critère C2.2.4 : « déployer le logiciel à chaque modification de code et de façon progressive ». Défini dans le job `docker-delivery` de `.github/workflows/ci.yml`.

## 1. Principe

À chaque push sur `main` réussissant l'intégration continue (tests + builds), une **image Docker** de l'application est construite et publiée automatiquement sur Docker Hub. Le déploiement est ainsi déclenché **à chaque modification de code** validée.

## 2. Séquences de déploiement

| Étape | Action                                                         | Outil                                                              |
| ----- | -------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1     | Récupération de l'artefact `backend.jar` (job `backend-build`) | `download-artifact`                                                |
| 2     | Authentification Docker Hub                                    | `docker/login-action` (secrets `DOCKER_USERNAME` / `DOCKER_TOKEN`) |
| 3     | Build de l'image à partir de `demo/Dockerfile.prod`            | `docker/build-push-action`                                         |
| 4     | Push de l'image `alixanb/coordination-front-back:latest`       | Docker Hub                                                         |

L'image backend est une image `eclipse-temurin:17-jre` embarquant le JAR (`app.jar`).

## 3. Séquence de mise en service (cible)

```
GitHub (push main) ──► CI verte ──► image Docker publiée ──► pull + run sur l'environnement cible
```

Exécution de l'image publiée :

```bash
docker pull alixanb/coordination-front-back:latest
docker run -p 9090:9090 alixanb/coordination-front-back:latest
```

> **Port** : l'application écoute sur **9090** (`server.port=9090`). Mapper `-p 9090:9090`. La directive `EXPOSE 8080` du `Dockerfile.prod` est purement indicative et ne correspond pas au port réel — voir [09-manuel-deploiement.md](09-manuel-deploiement.md).

## 4. Progressivité et rollback

- **Progressivité** : chaque commit validé produit une image ; le déploiement peut être fait image par image.
- **Versionnement** : taguer les images (`:x.y.z`) en complément de `:latest` permet un **rollback** en redéployant une image antérieure.
- **Traçabilité** : le tag Git (ex. `v1.0.0`) et le `CHANGELOG.md` référencent la version livrée.

## 5. Limites connues (démo)

- Seule l'**image backend** est publiée automatiquement ; le frontend est buildé (`front-dist`) mais son image (`front/Dockerfile.prod`) n'est pas encore branchée dans le pipeline et nécessite une correction (voir [09-manuel-deploiement.md](09-manuel-deploiement.md)).
- Pas d'environnement de staging distinct : `main` → livraison directe.
