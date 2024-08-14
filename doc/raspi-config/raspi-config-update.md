# Comment mettre à jour la station au sol à partir du GitHub

Retour aux [guides pour configurer le Raspberry Pi](./raspi-config.md)

---

Lorsque des modifications sont apportées au code de la station, il faut construire l'interface (voir [developpement#comment-construire](../guide/developpement.md#comment-construire-lapplication-pour-le-mode-production)), puis mettre à jour les fichiers du Raspberry Pi à partir de GitHub _(Git Pull)_.

## Accès à distance au Raspberry Pi en SSH

Se connecter au Wi-Fi du Raspberry Pi (`gaul-sas`) avec un ordinateur. Le mot de passe est `saspassword`. Puis accéder au Raspberry Pi en SSH avec:

```bash
ssh gaul@gaul-sas.local
```

_Are you sure you want to continue connecting (yes/no/\[fingerprint\])?_ \
\> yes

_password:_ sas

(Voir la [documentation officielle](https://www.raspberrypi.com/documentation/computers/remote-access.html) en cas de problème)

## Connecter la station au sol à internet

S'assurer qu'un réseau Wi-Fi avec internet est disponible et accessible par le Raspberry Pi. Je conseille de créer un hotspot avec un téléphone ou un ordinateur pour faciliter le processus.

**Pour ajouter une connexion Wi-Fi au Raspberry Pi à partir du terminal:**

Scanner les réseaux Wi-Fi disponibles:

```bash
sudo nmcli device wifi list
```

Puis se connecter au réseau désiré avec:

```bash
nmcli device wifi connect <Nom Wi-FI> password <Mot de passe Wi-Fi>
```

**Si le réseau a déjà été configuré, on peut simplement enlever le hotspot, et le Raspberry Pi devrait se reconnecter automatiquement**

```bash
sudo nmcli con delete gaul-sas
```

## Mettre à jour la station à partir du GitHub

<!-- Il y a deux options pour mettre à jour la station au sol:

**Option 1:**

Utiliser le script:

```bash
cd ~/Station-au-sol/scripts/
chmod +x raspi_update.sh
./raspi_update.sh
```

**Option 2:** -->

Fermer le backend de la station avec:

```bash
sudo killall node
```

Aller dans le répertoire qui contient le repo GitHub:

```bash
cd ~/Station-au-sol/
```

Récupérer les fichiers à partir du GitHub (se connecter avec un token GitHub au besoin):

```bash
git pull
```

Installer les nouvelles dépendances du projet:

```bash
cd backend/
npm install
```

Puis redémarrer:

```bash
sudo reboot
```

## Note pour Spaceport America Cup

Le code pour la station au sol se trouve sur la branche `sac24`, donc il faut probablement retourner sur la branche main si on veut utiliser la station après SAC.

Pour changer de branche:

```bash
git switch <BRANCH NAME>
```

---

Retour aux [guides pour configurer le Raspberry Pi](./raspi-config.md)
