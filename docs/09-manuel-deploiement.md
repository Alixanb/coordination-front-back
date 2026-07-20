# Manuel de déploiement

> Répond au critère C2.4.1. Décrit le déploiement du logiciel sur les différents environnements.

## 1. Prérequis

| Environnement | Outils requis |
|---------------|---------------|
| Développement / local | Java 17+, Node.js 20+, npm 11+ |
| Conteneur | Docker 24+ |

## 2. Déploiement local (développement)

```bash
git clone https://github.com/Alixanb/coordination-front-back.git
cd coordination-front-back
./start.sh          # backend :9090 + frontend :4200
```

Puis ouvrir **http://localhost:4200**. Logs dans `backend.log` / `frontend.log`.

## 3. Build de production

**Backend (JAR)**
```bash
cd demo && ./mvnw package -DskipTests   # → demo/target/*.jar
```

**Frontend (bundle statique)**
```bash
cd front && npm ci && npm run build     # → front/dist/note/browser
```

## 4. Déploiement par conteneur Docker

### Backend (image publiée par la CI)

```bash
docker pull alixanb/coordination-front-back:latest
docker run -p 9090:9090 alixanb/coordination-front-back:latest
```

> ⚠️ **Port** : l'application écoute sur **9090** (`server.port=9090`). Utiliser `-p 9090:9090`.
> La ligne `EXPOSE 8080` de `demo/Dockerfile.prod` est indicative et ne reflète pas le port réel ;
> elle peut être corrigée en `EXPOSE 9090` sans impact fonctionnel.

### Frontend (image nginx)

Le `front/Dockerfile.prod` sert le bundle via nginx. **Correctifs nécessaires avant build** (bogues connus, cf. [08-plan-correction-bogues.md](08-plan-correction-bogues.md)) :
- `RUN rm-rf` → `RUN rm -rf`
- `COPY dist/note/browser usr/share/nginx/html/` → `COPY dist/note/browser /usr/share/nginx/html/`

```bash
cd front
npm run build
docker build -f Dockerfile.prod -t sticky-notes-front .
docker run -p 8080:80 sticky-notes-front
```

## 5. Configuration par environnement

Variables clés (via `application.properties` ou variables d'environnement Spring) :

| Clé | Défaut | Rôle |
|-----|--------|------|
| `server.port` | `9090` | Port de l'API |
| `app.cors.allowed-origins` | `http://localhost:4200,http://127.0.0.1:4200` | Origines CORS autorisées |
| `spring.h2.console.enabled` | `true` | Console H2 (**à désactiver en prod**) |

En production : restreindre `app.cors.allowed-origins` au domaine réel du frontend et désactiver la console H2.

## 6. Déploiement continu

Le push sur `main` déclenche la CI qui publie l'image backend (voir [03-protocole-cd.md](03-protocole-cd.md)).
