# Desmos: https://www.desmos.com/calculator/8iy3mnkjzw
import math
import random


# Main function to create a log file
# Each column is generated with a function, which take at least the time as parameter
def main():
    with open("new_log.txt", "w") as file:
        file.write(
            "time,altitude,pitch,roll,yaw,lat,lon,speed,acceleration,vibrations,landing_force,temperature,batt_check,igniter_check,gps_check\n"
        )
        # Peak at 25 seconds
        for i in range(60):
            time = i
            altitude = altitude_function(i)
            pitch = pitch_function(i)
            roll = roll_function(i, altitude)
            lat = lat_function(i, 46.789488, 46.789694, 60)
            lon = lon_function(i, -71.477467, -71.472164, 60)
            speed = speed_function(i, altitude)
            acceleration = acceleration_function(i, altitude)
            file.write(
                f"{time},{altitude},{pitch},{roll},0,{lat},{lon},{speed},{acceleration}\n"
            )


# Parabolic function: y = 10000 - 20(x - 25)^2
# (Peak at 25)
# 10000-20\left(x-25\right)^{2}
def altitude_function(x):
    y = 10000 - 20 * (x - 25) ** 2
    # 0 if negative
    return y if y > 0 else 0


# Angle from derivative of altitude_function: y = -40(x - 25)
# -40\left(x-25\right)
def pitch_function(x):
    a = -40 * (x - 25)
    pitch = round(math.atan(a/100) * 180 / math.pi, 1)
    return pitch


# \left(\frac{x-25}{3}\right)^{3}+500
def roll_function(x, altitude):
    roll = ((x - 25)/3) ** 3 + 500
    roll += random.randint(-10, 10)
    roll = round(roll, 1)
    # No roll if on the ground (altitude = 0)
    return roll if altitude > 0 else 0


# From lat_min to lat_max with random noise
def lat_function(x, lat_min, lat_max, count):
    step = (lat_max - lat_min) / count
    lat = lat_min + step * x
    lat += random.randint(-2, 2) * 0.0001
    return round(lat, 6)


# From lon_min to lon_max with random noise
def lon_function(x, lon_min, lon_max, count):
    step = (lon_max - lon_min) / count
    lon = lon_min + step * x
    lon += random.randint(-2, 2) * 0.0001
    return round(lon, 6)


# Derivative of altitude_function: y = -40(x - 25)
# -40\left(x-25\right)
def speed_function(x, altitude):
    speed = -40 * (x - 25)
    speed += random.randint(-2, 2)
    return speed if altitude > 0 else 0


# Derivative of speed_function: y = -40 + 1000
# -40\left(x-25\right)
def acceleration_function(x, altitude):
    acceleration = -40
    acceleration += random.randint(-2, 2)
    return acceleration if altitude > 0 else 0


if __name__ == "__main__":
    main()
