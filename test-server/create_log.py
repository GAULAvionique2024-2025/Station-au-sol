# Desmos: https://www.desmos.com/calculator/8iy3mnkjzw?lang=fr
import math
import random


def main():
    with open("new_log.txt", "w") as file:
        file.write("time,alt,pitch,roll,yaw,lat,lon\n")
        for i in range(60):
            time = i
            alt = alt_function(i)
            pitch = pitch_function(i)
            roll = roll_function(i, alt)
            lat = lat_function(i, 46.789488, 46.789694, 60)
            lon = lon_function(i, -71.477467, -71.472164, 60)
            file.write(f"{time},{alt},{pitch},{roll},0,{lat},{lon}\n")


# 10000-20\left(x-25\right)^{2}
def alt_function(x):
    y = 10000 - 20 * (x - 25) ** 2
    return y if y > 0 else 0


# Derivative of alt_function: -40\left(x-25\right)
def pitch_function(x):
    a = -40 * (x - 25)
    pitch = round(math.atan(a/100) * 180 / math.pi, 1)
    return pitch


# \left(\frac{x-25}{3}\right)^{3}+500
def roll_function(x, alt):
    roll = ((x - 25)/3) ** 3 + 500
    roll += random.randint(-10, 10)
    roll = round(roll, 1)
    return roll if alt > 0 else 0


def lat_function(x, lat_min, lat_max, count):
    step = (lat_max - lat_min) / count
    lat = lat_min + step * x
    lat += random.randint(-2, 2) * 0.0001
    return round(lat, 6)


def lon_function(x, lon_min, lon_max, count):
    step = (lon_max - lon_min) / count
    lon = lon_min + step * x
    lon += random.randint(-2, 2) * 0.0001
    return round(lon, 6)


if __name__ == "__main__":
    main()