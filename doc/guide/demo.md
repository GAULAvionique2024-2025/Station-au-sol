# Démarrer le mode démo

Le mode démo crée un faux port serial qui envoie des données générées à partir d'une simulation OpenRocket au frontend.

Pour activer le mode démo, installer les dépendances du projet dans le dossier `/backend` avec:

```bash
npm install
```

puis lancer le backend en mode démo avec:

```bash
npm run mock
```

l'application est ensuite disponible à l'adresse http://localhost:8080

# Pour déployer le mode démo avec docker

Installer [Docker](https://www.docker.com)

Aller dans le dossier `/backend` et entrer:

```bash
docker compose up
```

puis l'application en mode démo est disponible à l'adresse http://localhost:8080

---

Retour à la [page principale](../../README.md)
