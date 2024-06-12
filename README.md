# Station-au-sol

![GAUL Banner](doc/logo-full.webp)

Repo qui contient le code pour la station au sol du GAUL

Le projet fonctionne avec un serveur node.js qui roule sur un Raspberry Pi. Ce serveur reçoit les données de la fusée, puis les envoie aux clients connectés pour mettre à jour leur interface.

## Images de l'interface

[Showcase](doc/showcase/showcase.md)

![Interface 1](doc/showcase/interface-1.png)

## Guide de développement

### Téléchargements et installations nécessaires

- NodeJS: https://nodejs.org/en/ (v20.11.1 lors de la création du projet)

### Lancer le backend en mode développement:

Dans le dossier `/backend`, entrer:

```shell
npm install
```

pour installer les dépendances du projet, puis:

```shell
npm run dev
```

pour lancer le serveur qui lit un port serial (`COM3` par défaut) et transmet les données avec Socket.IO à l'adresse http://localhost:8080/.

Le mode développement active le cross-origin resource sharing (CORS) pour permettre au frontend (Vite) de se connecter au backend.

### Lancer le frontend en mode développement:

Dans un autre terminal, dans le dossier `/frontend`, entrer:

```shell
npm install
```

pour installer les dépendances du projet, puis:

```shell
npm run dev
```

pour lancer Vite, qui permet de modifier les fichiers du frontend et de voir les modifications directement à l'adresse http://localhost:5173/.

## Guide pour construire l'application

Lorsque les modifications au frontend sont finies, dans un terminal, dans le dossier `/frontend`, entrer:

```shell
npm run build
```

pour construire le site web, ce qui combine tous les fichiers du frontend et les met dans le dossier `/backend/dist`.

On peut ensuite lancer le serveur en mode production avec un terminal dans le dossier `/backend` en entrant:

```shell
npm start
```

L'application est alors disponible à l'adresse http://localhost:8080/ ou à l'adresse de l'ordinateur (probablement http://HOSTNAME.local:8080 ou http://192.168.100.XXX:8080/).

## Déployer sur le Raspberry Pi de la station

Envoyer l'application modifiée sur github avec :

```shell
git push
```

et le distribuer sur le Raspberry Pi : [Guide](doc/raspi-config/raspberrypi-config.md)

## Déployer le mode démo

Le mode démo crée un faux port serial qui envoie des données issues d'une simulation OpenRocket.

Pour activer le mode démo, installer les dépendances du projet dans le dossier `/backend` avec:

```shell
npm install
```

puis lancer l'application avec:

```shell
npm run mock
```

l'application est ensuite disponible à l'adresse http://localhost:8080

### Avec docker

Aller dans le dossier `/backend` et entrer:

```shell
docker compose up
```

puis l'application en mode démo est disponible à l'adresse http://localhost:8080
