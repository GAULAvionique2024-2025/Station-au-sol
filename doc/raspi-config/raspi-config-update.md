# Comment mettre à jour la station au sol à partir du GitHub

Retour aux [guides pour configurer le Raspberry Pi](./raspi-config.md)

---

Lorsque des modifications sont apportées au code de la station, il faut construire l'interface (voir [developpement](../guide/developpement.md)), puis mettre à jour les fichiers du Raspberry Pi à partir de GitHub.

## Connecter la station au sol à internet

Se connecter au Wi-Fi du Raspberry Pi (`gaul-sas`) avec un ordinateur. Le mot de passe est `saspassword`. Puis entrer:

```bash
ssh gaul@gaul-sas.local
```

_Are you sure you want to continue connecting (yes/no/\[fingerprint\])?_ \
\> yes

_password:_ sas

(Voir la [documentation officielle](https://www.raspberrypi.com/documentation/computers/remote-access.html) en cas de problème)

---

S'assurer qu'un réseau Wi-Fi avec internet est disponible et accessible par le Raspberry Pi. Je conseille de créer un hotspot avec son téléphone ou son ordinateur pour faciliter le processus.

**Pour ajouter une connexion Wi-Fi au Raspberry Pi à partir du terminal:**

```bash
sudo nmcli device wifi connect <AP NAME> password <PASSWORD>
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

Récupérer les fichiers à partir du GitHub:

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

---

Retour aux [guides pour configurer le Raspberry Pi](./raspi-config.md)
