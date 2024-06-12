### _Comment mettre à jour la station au sol à partir du GitHub_

Se connecter au Wi-Fi du Raspberry Pi (gaul-sas) avec un ordinateur. Le mot de passe du Wi-Fi est `saspassword`.

Puis s'y connecter avec:

```bash
ssh gaul@gaul-sas.local
```

---

S'assurer qu'un réseau Wi-Fi avec internet est disponible et accessible par le Raspberry Pi. Je conseille de créer un hotspot avec son téléphone ou son ordinateur pour faciliter le processus.

**Pour ajouter une connexion Wi-Fi au Raspberry Pi à partir du terminal:**

```bash
sudo raspi-config
```

Sélectionner `System Options` \
Puis `Wireless LAN` \
Ensuite, entrer le nom du réseau Wi-Fi (SSID) et appuyer sur `Enter` \
Entrer le mot de passe du Wi-Fi (passphrase) et appuyer sur `Enter`

---

Il y a deux options pour mettre à jour la station au sol:

**Option 1:**

Utiliser le script:

```bash
cd ~/Station-au-sol/scripts/
chmod +x raspi_update.sh
./raspi_update.sh
```

**Option 2:**

Exécuter la commande pour fermer node:

```bash
sudo killall node
```

Désactiver le hotspot pour pouvoir accéder à GitHub:

```bash
sudo nmcli connection delete gaul-sas
```

Aller dans le répertoire qui contient le repo GitHub:

```bash
cd ~/Station-au-sol/
```

Mettre à jour les fichiers:

```bash
git pull
```

Installer les nouvelles dépendances du projet:

```bash
cd backend/
npm install
```

Puis relancer le hotspot:

```bash
sudo nmcli device wifi hotspot con-name gaul-sas ssid gaul-sas password saspassword
```