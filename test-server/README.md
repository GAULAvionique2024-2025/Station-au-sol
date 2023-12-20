# Test-server

Outils pour démarrer un serveur websocket pour tester l'interface web.


## Création des logs

Il faut générer des données fictives de vol. Ces données sont en format csv, une ligne représente un envoi fictif de donnée de la fusée vers la station au sol.


### Première façon pour générer log.txt

1. `create_log.py`: Crée le fichier `new_log.txt` en utilisant des fonctions mathématiques

2. Renommer `new_log.txt` en `log.txt` et le placer dans le même dossier que `main.py`


### Deuxième façon pour générer log.txt

1. `Nebula.ork`: Fichier OpenRocket de Nebula pour effectuer la simulation

2. `nebula_2023.csv`: Données générées par OpenRocket pour la simulation "5km/h"

3. `create_log_from_nebula.py`: Crée le fichier `new_log.txt` en utilisant `nebula_2023.csv`

4. Renommer `new_log.txt` en `log.txt` et le placer dans le même dossier que `main.py`


## Ouvrir le serveur

Lorsque le fichier `log.txt` se trouve dans le même dossier que `main.py`, il suffit de lancer `main.py` pour démarrer le serveur websocket.

Le client peut alors se connecter sur `ws://localhost:8000/`