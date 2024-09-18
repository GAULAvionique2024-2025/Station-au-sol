# Station au sol

La station au sol peut être séparé en sa partie logiciel et sa partie physique. Le logiciel suit une architecture client-serveur.

## Backend du logiciel

<img src="./software/nodejs.png" alt="Station au sol vue normale" width=20%><br>

Le serveur en backend utilise [_node.js_](https://nodejs.org/) pour exécuter du code Javascript directement sur le Raspberry Pi de la station au sol.

Le paradigme de programmation événementielle est abondamment utilisé dans le backend de la station au sol pour faciliter la gestion des flux de données asynchrones à travers les différents modules.

Le code est séparé en plusieurs modules qui ont des rôles spécifiques et distincts :

-   `server.mjs` : Point d'entrée; initialise les modules du backend, puis s'occupe de transférer les données de vol et les events entre les différents modules.

-   `src/webserver.mjs` : Utilise le framework [_Express.js_](https://expressjs.com/) pour fournir les fichiers statiques aux clients quand ils font une requête à l'adresse `http://gaul-sas.local:8080`.

-   `src/storage.mjs` : Utilise l'[_API de node.js_](https://nodejs.org/api/fs.html#file-system) pour créer des fichiers journaux (log files) contenant les erreurs rencontrées et les données de vol de la fusée.

-   `src/socket.mjs` : Utilise le framwork [_socket.io_](https://socket.io/) pour communiquer de manière bidirectionnelle avec les clients connectés. Principalement utilisé pour envoyer les erreurs et les données de vol aux clients en temps réel.

-   `src/serial.mjs` : Utilise le framwork [_Node SerialPort_](https://serialport.io/) pour recevoir les données brutes provenant de la fusée. Le Raspberry Pi reçoit les données du module d'antenne [RFD900x](https://rfdesign.com.au/modems/) par [communication serial](https://learn.sparkfun.com/tutorials/serial-communication/all).

-   `src/data.mjs` : Module qui nettoie, formate et standardise les données brutes provenant de la fusée.

Voici un diagramme qui résume les flux de données entre les différents modules :

<img src="./software/diagram_backend.drawio.png" alt="Diagramme du backend">

## Frontend (client) du logiciel

Vue.js

L'interface est séparé en components.

Leaflet est utilisé pour la carte.

Three pour afficher la fusée en 3d.

Chart.js pour afficher l'altitude, la vitesse et l'accélération sur un graphique.

Socket.io pour recevoir les données de la station au sol.

Les components ont accès aux données via des data store géré par pinia.

Le store `data` stocke principalement les `n` dernières données reçues.

Le store `console` stocke les messages à afficher dans la console et quelques méthodes pour intéragir avec la console.

Le store `settings` stocke les paramètres de l'interface et les méthodes pour les modifier. Il est donc principalement utilisé par le composant du même nom.

Le store `ui` stocke les états de l'interface, ainsi que les méthodes pour modifier ces états.

<img src="./software/diagram_frontend.drawio.png" alt="Diagramme du frontend" width=60%>

## Physique

Vue normale du modèle 3d de la station au sol disponible sur onshape.

<img src="./hardware/normal.png" alt="Station au sol vue normale" width=60%>

Vue éclaté du modèle 3d de la station au sol disponible sur onshape.

<img src="./hardware/explode.png" alt="Station au sol vue normale" width=60%><br>

La mallette contenant la station au sol, l'écran tactile et les batteries ont été achetés sur Amazon pour le projet.

Des supports pour l'écran, le Raspberry Pi et le RFD900x (antennes) ont ensuite été conçus et imprimés avec une imprimante 3D.

Tout a été fixé avec des vis et des bandes de velcro pour garder une modularité des composants.

Les modèles des pièces imprimées en 3D sont disponibles dans le dossier `step`.

La dernière version du modèle se trouve sur le [onshape du GAUL](https://gaulfsg.onshape.com/).

### Références pour les pièces Amazon:

**Mallette style Pelican case:** \
Mayouko Portable Tool Box with Shock- Proof Sponge, Water Proof Grade IP67, Waterproof Hard Case with Foam Insert, Shockproof Carrying Case, Explosion Proof Box, 11.6 inch x 8.3 inch x 3.9 inch (https://a.co/d/38A1IkM)

<img src="./hardware/mallette_amazon.jpg" alt="Mallette Amazon" width=20%><br>

**Écran tactile:** \
SunFounder 7 Inch HDMI 1024×600 USB IPS LCD Touchscreen Display Monitor for Raspberry Pi 5 400 4 3 Model B, 2 Model B, and 1 Model B+, Windows Capacitive Touch Screen (https://a.co/d/ih0YAgL)

<img src="./hardware/écran_amazon.jpg" alt="Écran tactile Amazon" width=20%><br>

**Batteries:** \
Portable Charger 36800mAh,4 Outputs Power Bank, Dual Input 5V/3A External Battery Pack,USB-C in&Out High-Speed Charging Backup Charger Compatible with iPhone 15/14/13,Samsung S23 Android Phone etc (https://a.co/d/5cQlJPz)

<img src="./hardware/batt1_amazon.jpg" alt="Batterie 1 Amazon" width=20%><br>

INIU Power Bank, 20000mAh Portable Charger USB C in&out, 22.5W PD3.0 QC4.0 Fast Charge External Battery Pack, LED Display Phone Charger for iPhone 15 14 13 12 Pro X 8 Samsung S22 Google LG iPad Tablet (https://a.co/d/h5Kwnph)

<img src="./hardware/batt2_amazon.jpg" alt="Batterie 2 Amazon" width=20%><br>

**Velcro:** \
EOTW 18 Pack Hook Loop Tape Heavy Duty, 1" x 4" Strong Tape Double Sided Adhesive Sticky Reusable Hook and Loop Interlocking Mounting Tape (https://a.co/d/1i7lMyj)

<img src="./hardware/velcro_amazon.jpg" alt="Velcro Amazon" width=20%>

---

Retour à la [page principale](../README.md)
