## Backend

- &#9744; SQLITE pour stocker les données plus efficacement

### Done

- &#9745; module data pour convertir les données de la fusée

## Frontend

- &#9744; &#128293; Optimiser le site

- &#9744; Ajouter l'option de fetch les données du backend/Fetch x dernières données quand un client se connecte

- &#9744; Ajouter un logo `Fusée --- Antenna --- RPI --- APP` avec les tirets en couleur selon l'état de la connexion. (`Fusée --- Antenna` si on reçoit des données, `Antenna --- RPI` si le serial fonctionne, et `RPI --- APP` si le socket.io fonctionne)

- &#9744; &#128293; Permettre l'update de l'affichage même s'il manque des données (rendre les components indépendants)

- &#9744; Page avec une interface plus simple où on peut choisir quelles données à afficher, et si on veut les afficher dans un graphique

### Done

- &#9745; &#128293; Slider dans les settings pour limiter le nombre de données dans le graphique (réduire le minimum pour éviter le lag sur le raspberry pi)

- &#9745; &#128293; Slider dans les settings pour ajuster la fréquence d'update (le serveur envoie à 100ms minimum, mettre 300ms par défaut sur client pour éviter le lag sur le raspberry pi)

- &#9745; &#128293; "Toggle Fullscreen" button dans les settings

- &#9745; &#128293; Bug à corriger quand on essaye de cacher une valeur dans le graphique

---

&#128293; : plus important
