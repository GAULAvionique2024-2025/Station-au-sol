import csv
import os
import random
import math


# IL FAUT SUPPRIMER LES FICHIER new_log.txt AVANT DE LANCER CE SCRIPT


# Change to the directory of this file
os.chdir(os.path.dirname(__file__))


# Ajoute l'entete
with open('new_log.txt', 'a') as file:
    file.write(
        "time,altitude,pitch,roll,yaw,lat,lon,speed,acceleration,temperature,vibrations,landing_force,batt_check,igniter_check,gps_check\n"
    )


start_lat = 46.752349
start_lon = -72.337684
offset = 10
# Ajoute des valeurs de départ
with open('new_log.txt', 'a') as file:
    for i in range(offset):
        if i <= 2:
            file.write(
                f"{i},0,0,0,0,{start_lat},{start_lon},0,0,0,0,0,1,0,0\n")
        if i > 2 and i <= 5:
            file.write(
                f"{i},0,0,0,0,{start_lat},{start_lon},0,0,0,0,0,1,1,0\n")
        if i > 5:
            file.write(
                f"{i},0,0,0,0,{start_lat},{start_lon},0,0,0,0,0,1,1,1\n")


last_time = 0
pitch = 0
pitch_from_excel = {
    23.315: 59.649299,
    23.651: 68.104739,
    23.988: 76.585344,
    24.430: 87.708274,
    24.922: 100.089454,
    25.422: 112.671954,
    25.913: 125.027969,
    26.402: 137.333654,
    26.902: 149.916154,
    27.402: 162.498654,
    27.902: 175.081154,
    28.402: 180.663654,
}
roll = 0
last_yaw = 0
yaw = 0
R_terre = 6371000
with open('nebula_2023.csv', 'r') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        if len(row) == 10:
            # print(row)
            try:
                time = float(row[0]) + offset
                altitude = float(row[1])
                speed = float(row[2])
                acceleration = float(row[3])
                distance = float(row[4])
                temperature = float(row[9])

                delta_time = time - last_time

                # Gère le roll
                roll_rate = float(row[6])
                # Génère une valeur si elle est manquante
                if math.isnan(roll_rate):
                    # - 0.4 pour avoir des valeurs négatives
                    roll_rate = (random.random() - 0.4) * 1e-5
                roll += roll_rate * delta_time * 1e6

                # Gère le pitch
                pitch_rate = float(row[7])
                # Génère une valeur si elle est manquante avec Excel
                if math.isnan(pitch_rate) and time in pitch_from_excel:
                    pitch = pitch_from_excel[time]
                # Génère une valeur si elle est manquante
                elif math.isnan(pitch_rate):
                    pitch_rate = random.random() - 0.5
                    pitch += pitch_rate * delta_time
                # Sinon, calcule le pitch
                else:
                    pitch += pitch_rate * delta_time

                # Gère le yaw
                yaw_rate = float(row[8])
                # Génère une valeur si elle est manquante
                if math.isnan(yaw_rate):
                    yaw_rate = -1 * random.random() * last_yaw * 1e-3
                yaw += yaw_rate * delta_time * 100
                last_yaw = yaw

                # Gère la longitude
                position_est = float(row[4])
                deg_est = position_est / R_terre * 180 / math.pi
                lon = start_lon + deg_est

                # Gère la latitude
                position_nord = float(row[5])
                deg_nord = position_nord / R_terre * 180 / math.pi
                lat = start_lat + deg_nord

                vibrations = random.random() * 100

                # Écrit dans le fichier
                # Filtre pour ne pas garder toutes les données
                if delta_time >= 0.5:
                    last_time = time
                    with open('new_log.txt', 'a') as file:
                        file.write(
                            f"{time},{altitude},{round(pitch, 3)},{round(roll, 3)},{round(yaw, 3)},{round(lat, 8)},{round(lon, 8)},{speed},{acceleration},{temperature},{round(vibrations, 3)},20.3,1,1,1\n"
                        )
            except ValueError:
                # Ignore les lignes sans valeurs numériques
                pass
