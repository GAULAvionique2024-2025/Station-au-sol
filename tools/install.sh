#!/bin/bash

set -e

echo "=== Installation de Node.js ==="
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs npm
else
    echo "Node.js est déjà installé."
fi

echo "=== Clonage du dépôt Station-au-sol ==="
if [ ! -d "$HOME/Station-au-sol" ]; then
    git clone https://github.com/GAULAvionique2024-2025/Station-au-sol.git ~/Station-au-sol
else
    echo "Le dossier Station-au-sol existe déjà."
fi

echo "=== Installation des dépendances backend ==="
cd ~/Station-au-sol/backend
npm install

echo "=== Configuration du mode kiosque (chromium) ==="
mkdir -p ~/.config
if [ ! -f ~/.config/wayfire.ini ]; then
    touch ~/.config/wayfire.ini
fi

if ! grep -q "\[autostart\]" ~/.config/wayfire.ini; then
    cat <<EOL >> ~/.config/wayfire.ini

[autostart]
chromium = chromium-browser --app=http://localhost:8080 --noerrdialogs --no-first-run --enable-features=OverlayScrollbar
screensaver = false
EOL
    echo "Ajout de la configuration autostart dans wayfire.ini"
else
    echo "Section [autostart] déjà présente dans wayfire.ini"
fi

echo "=== Configuration du hotspot Wi-Fi ==="
sudo nmcli device wifi hotspot con-name gaul-sas ssid gaul-sas password saspassword

echo "=== Configuration du démarrage automatique du backend et du hotspot ==="
RCLOCAL="/etc/rc.local"
BACKEND_CMD="sudo node /home/gaul/Station-au-sol/backend/server.mjs &"
HOTSPOT_CMD="sudo nmcli device wifi hotspot con-name gaul-sas ssid gaul-sas password saspassword &"

if ! grep -q "Station-au-sol/backend/server.mjs" $RCLOCAL; then
    sudo sed -i "/^exit 0/i $BACKEND_CMD\n$HOTSPOT_CMD" $RCLOCAL
    echo "Ajout des commandes dans /etc/rc.local"
else
    echo "Les commandes sont déjà présentes dans /etc/rc.local"
fi

echo "=== Installation terminée ==="
echo "Redémarrage recommandé : sudo reboot"