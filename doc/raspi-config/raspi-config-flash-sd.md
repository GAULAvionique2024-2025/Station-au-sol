# Configuration de la carte SD

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
_SSID :_ \<Nom du hotspot Wi-FI\> \
_Mot de passe :_ \<Mot de passe du hotspot Wi-Fi\>

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

Attendre que le Raspberry Pi ouvre (quand la DEL verte arrête de clignoter), puis entrer dans le terminal d'un ordinateur connecté sur le même hotspot Wi-Fi que le Raspberry Pi:

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