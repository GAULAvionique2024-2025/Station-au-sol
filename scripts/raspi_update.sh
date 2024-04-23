sudo killall node

sudo nmcli connection delete gaul-sas

cd ~/Station-au-sol/

git pull

cd backend/

npm install

sudo nmcli device wifi hotspot con-name gaul-sas ssid gaul-sas password saspassword