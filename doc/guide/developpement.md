# Guide pour développer la station au sol

Voir les [explications plus détaillées](../explications.md) pour mieux comprendre la structure et le fonctionnement du projet.

---

### Logiciel nécessaire

- [NodeJS](https://nodejs.org/en/) (v20.11.1 lors de la création du projet)

### Application de développement recommandée

- [Vscode](https://code.visualstudio.com) avec les extensions: `Javascript`, `Vue`

## Lancer le mode développement

Le projet est composé d'un backend et d'un frontend, donc il faut lancer les deux en mode développement pour pouvoir tester l'interface en temps réel.

### Lancer le backend en mode développement:

Dans le dossier `/backend`, installer les dépendances du projet avec:

```bash
npm install
```

Puis lancer le backend avec nodemon:

```bash
npm run dev
```

Cela permet d'actualiser le backend automatiquement quand un fichier est modifié.

### Lancer le frontend en mode développement:

Dans un autre terminal, dans le dossier `/frontend`, installer les dépendancces du projet avec:

```bash
npm install
```

Puis lancer le frontend avec Vite:

```bash
npm run dev
```

Cela permet de modifier les fichiers du frontend et de voir les modifications en temps réel à l'adresse http://localhost:5173/.

## Comment construire l'application pour le mode production

Lorsque des modifications sont appliquées au frontend, il faut reconstruire l'application pour la rendre accessible par le Raspberry Pi. **Si cette étape est sautée, les modifications au frontend ne seront pas disponibles sur la station au sol.**

Dans le dossier `/frontend`, pour construire l'application, entrer:

```bash
npm run build
```

Cela combine tous les fichiers du frontend et les met dans le dossier `/backend/dist`.

Une fois l'application construite et les modifications push sur GitHub, on peut [mettre à jour les fichiers sur la station au sol](../raspi-config/raspi-config-update.md).

---

Pour tester le mode production, dans le dossier `/backend`, entrer:

```bash
npm start
```

L'application devrait alors disponible à l'adresse http://localhost:8080/ ou à l'adresse de l'ordinateur (probablement http://HOSTNAME.local:8080 ou http://192.168.100.XXX:8080/).
