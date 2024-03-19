# Guide pour configurer le Raspberry Pi de la station

## Installation de Raspberry Pi OS

Lancer [Raspberry Pi Imager](https://www.raspberrypi.com/software/) v1.8.4

_Modèle :_ Raspberry Pi 4 \
_Système d'exploitation :_ Raspberry Pi OS (32-bit) \
_Stockage :_ SD CARD

_Would you like to apply OS customization settings?_ \
\> Modifier réglages

**Général**

_Nom d'hôte :_ gaul-sas

**\[X\] Définir nom d'utilisateur et mot de passe** \
_Nom d'utilisateur :_ gaul \
_Mot de passe :_ sas

**\[X] Configurer le Wi-Fi** \
_SSID :_ \<Nom du réseau Wi-FI\> \
_Mot de passe :_ \<Mot de passe du réseau Wi-Fi\>

(Je conseille de faire un hotspot avec son téléphone pour connecter le Raspberry Pi et son ordinateur plus facilement)

_Pays Wi-fi :_ CA

_Fuseau horaire :_ America/Toronto \
_Type de clavier :_ ca

**Services**

\[x\] Activer SSH \
(x) Utiliser un mot de passe pour l'authentification

\> Enregistrer

\> Oui

_Toutes les données sur le périphérique de stockage vont être supprimées._ \
_Voulez-vous vraiment continuer ?_ \
\> Oui

## Mettre la carte SD dans le Raspberry Pi et l'allumer

Attendre que le Raspberry Pi ouvre (quand la DEL verte arrête de clignoter), puis entrer dans le terminal d'un ordinateur connecté sur le même réseau Wi-Fi que le Raspberry Pi:

```bash
ssh gaul@gaul-sas.local
```

_Are you sure you want to continue connecting (yes/no/\[fingerprint\])?_ \
\> yes

_password:_ sas

Pour télécharger et installer les dernières listes de packages:

```bash
sudo apt update && sudo apt full-upgrade -y
```

Redémarrer le Raspberry Pi:

```bash
sudo reboot
```

## Setup de la station au sol

Se reconnecter en SSH à partir d'un ordinateur sur le même Wi-Fi que le Raspberry Pi:

```bash
ssh gaul@gaul-sas.local
```

### Installer Node.js

Ajouter la source:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x
```

Installer Node.js et npm:

```bash
sudo apt install -y nodejs npm
```

### Cloner le repo GitHub

Entrer la commande pour cloner le repo

```bash
git clone https://github.com/mathouqc/Station-au-sol.git
```

Ensuite, changer de répertoire:

```bash
cd Station-au-sol/backend
```

Puis installer les dépendances du projet:

```bash
npm install
```

## Configuration du mode Kiosque (démarrer le Raspberry Pi sur l'interface Web)

[Tutoriel - How to use Raspberry Pi in kiosk mode](https://www.raspberrypi.com/tutorials/how-to-use-a-raspberry-pi-in-kiosk-mode/)

Configurer Wayfire, qui est utilisé pour afficher le bureau du Raspberry Pi:

```bash
sudo nano .config/wayfire.ini
```

Ajouter les lignes:

```
[autostart]
chromium = chromium-browser --app=http://localhost --start-maximized --start-fullscreen --noerrdialogs --no-first-run --enable-features=OverlayScrollbar

screensaver = false
```

## Configuration du mode point d'accès (Hotspot) Wi-Fi

[Tutoriel - Setup wifi hotspot](https://www.baeldung.com/linux/setup-wifi-hotspot) \
[Documentation nmcli](https://developer-old.gnome.org/NetworkManager/stable/nmcli.html)

```bash
sudo nmcli device wifi hotspot con-name gaul-sas ssid gaul-sas password saspassword
```

_nmcli:_ Network Manager Command Line Interface \
_device wifi:_ Pour gérer le Wi-Fi \
_hotspot:_ Pour créer un hotspot \
_con-name gaul-sas:_ Le nom de la configuration \
_ssid gaul-sas:_ Le nom du réseau \
_password saspassword:_ Le mot de passe du réseau

Pour fermer le hotspot au besoin (car la connection internet ne fonctionne pas en même temps que le hotspot):

```bash
sudo nmcli connection delete gaul-sas
```

---

S'il y a l'erreur `Error: NetworkManager is not running`, entrer:

```bash
sudo raspi-config
```

Aller dans `Advanced Options` \
Puis dans `Network Config` \
Puis choisir `NetworkManager`

Et relancer le Raspberry Pi:

```bash
sudo reboot
```

_Un écran, clavier et souris est peut-être nécessaire pour reconfigurer le réseau Wi-Fi_

## Lancer le serveur Node.js et mettre le mode point d'accès au lancement du Raspberry Pi

[Tutoriel - How to run a program on your Raspberry Pi at startup](https://www.dexterindustries.com/howto/run-a-program-on-your-raspberry-pi-at-startup/)

Exécuter la commande:

```bash
sudo nano /etc/rc.local
```

Ajouter les lignes avant `exit 0`:

```bash
# Start node.js
sudo node /home/gaul/Station-au-sol/server/index.js &
# Set hotspot
sudo nmcli device wifi hotspot con-name gaul-sas ssid gaul-sas password saspassword &
```

\* _le '&' est important à la fin pour indiquer que les commandes sont à exécuter en arrière plan._

Ensuite `ctrl` + `x`, `y`, puis \<Enter\> pour sauvegarder le fichier

Pour tester si tout fonctionne:

```bash
sudo reboot
```

On peut ensuite se connecter au Raspberry Pi sur le Wi-Fi _'**gaul-sas**'_ avec le mot de passe _'**saspassword**'_, puis accéder au site web de l'interface sur [http://gaul-sas.local](http://gaul-sas.local)

\* _Sur Android, il faut entrer l'adresse IP du Raspberry Pi pour accéder à l'interface. Donc il suffit d'exécuter `ping gaul-sas.local` sur une machine Windows pour récupérer l'adresse IP du Raspberry Pi._

---

### _Comment mettre à jour le site à partir du GitHub_

Se connecter au hotspot du Raspberry Pi avec un ordinateur avec:

```bash
ssh gaul@gaul-sas.local
```

Afficher le Process ID (PID) du serveur Node.js:

```bash
ps aux | grep node
```

Exécuter la commande avec les PID pour les deux processus node:

```bash
sudo kill -9 <PID>
sudo kill -9 <PID>
```

Désactiver le hotspot pour pouvoir accéder à GitHub:

```bash
sudo nmcli connection delete gaul-sas
```

Aller dans le répertoire qui contient le repo GitHub:

```bash
cd Station-au-sol/
```

Mettre à jour les fichiers:

```bash
git pull
```

Puis relancer le hotspot:

```bash
sudo nmcli device wifi hotspot con-name gaul-sas ssid gaul-sas password saspassword
```
