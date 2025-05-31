#!/bin/bash

# TODO: make better script

sudo killall node

sudo nmcli connection delete gaul-sas

sleep 5

cd ~/Station-au-sol/

git pull

cd backend/

npm install

sudo reboot