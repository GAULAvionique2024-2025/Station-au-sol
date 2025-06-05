# Enable I2C

```bash
sudo raspi-config
```

-   3 - Interface
-   I4 - I2C
-   Enable I2C `yes`

## BMP280

Voir le fichier `~/test_gpio/bmp280.py`

Changer `BMP280_I2C_ADDR` au besoin

```python
import smbus2
import time

# Adresse I2C du BMP280 (0x76 ou 0x77 selon le câblage)
BMP280_I2C_ADDR = 0x77

# Registres
REG_ID = 0xD0
REG_RESET = 0xE0
REG_CTRL_MEAS = 0xF4
REG_CONFIG = 0xF5
REG_PRESS_MSB = 0xF7

# Initialisation du bus I2C
bus = smbus2.SMBus(1)

# Lire ID du capteur pour vérification
chip_id = bus.read_byte_data(BMP280_I2C_ADDR, REG_ID)
if chip_id != 0x58:
    print("Erreur : capteur BMP280 non détecté.")
    exit()

# Configurer le capteur : mode normal, oversampling x1 pour T et P
bus.write_byte_data(BMP280_I2C_ADDR, REG_CTRL_MEAS, 0x27)
bus.write_byte_data(BMP280_I2C_ADDR, REG_CONFIG, 0xA0)

# Lire les coefficients de calibration
def read_calibration_params():
    calib = []
    for i in range(0x88, 0x88+24):
        calib.append(bus.read_byte_data(BMP280_I2C_ADDR, i))
    # Conversion des données (petit endian)
    dig_T1 = calib[1] << 8 | calib[0]
    dig_T2 = (calib[3] << 8 | calib[2])
    dig_T3 = (calib[5] << 8 | calib[4])
    dig_P1 = calib[7] << 8 | calib[6]
    dig_P2 = (calib[9] << 8 | calib[8])
    dig_P3 = (calib[11] << 8 | calib[10])
    dig_P4 = (calib[13] << 8 | calib[12])
    dig_P5 = (calib[15] << 8 | calib[14])
    dig_P6 = (calib[17] << 8 | calib[16])
    dig_P7 = (calib[19] << 8 | calib[18])
    dig_P8 = (calib[21] << 8 | calib[20])
    dig_P9 = (calib[23] << 8 | calib[22])

    def signed(val):  # helper pour signed short
        return val - 65536 if val > 32767 else val

    return {
        "T1": dig_T1,
        "T2": signed(dig_T2),
        "T3": signed(dig_T3),
        "P1": dig_P1,
        "P2": signed(dig_P2),
        "P3": signed(dig_P3),
        "P4": signed(dig_P4),
        "P5": signed(dig_P5),
        "P6": signed(dig_P6),
        "P7": signed(dig_P7),
        "P8": signed(dig_P8),
        "P9": signed(dig_P9),
    }

calib = read_calibration_params()

# Algorithme de compensation selon datasheet
def compensate_temp_press(adc_T, adc_P, calib):
    # Température
    var1 = (((adc_T >> 3) - (calib["T1"] << 1)) * calib["T2"]) >> 11
    var2 = (((((adc_T >> 4) - calib["T1"]) * ((adc_T >> 4) - calib["T1"])) >> 12) * calib["T3"]) >> 14
    t_fine = var1 + var2
    T = (t_fine * 5 + 128) >> 8

    # Pression
    var1 = t_fine - 128000
    var2 = var1 * var1 * calib["P6"]
    var2 = var2 + ((var1 * calib["P5"]) << 17)
    var2 = var2 + (calib["P4"] << 35)
    var1 = ((var1 * var1 * calib["P3"]) >> 8) + ((var1 * calib["P2"]) << 12)
    var1 = (((1 << 47) + var1) * calib["P1"]) >> 33

    if var1 == 0:
        return T / 100.0, 0  # Évite division par zéro

    p = 1048576 - adc_P
    p = (((p << 31) - var2) * 3125) // var1
    var1 = (calib["P9"] * (p >> 13) * (p >> 13)) >> 25
    var2 = (calib["P8"] * p) >> 19
    p = ((p + var1 + var2) >> 8) + (calib["P7"] << 4)

    return T / 100.0, p / 256.0

# Boucle de lecture
while True:
    data = bus.read_i2c_block_data(BMP280_I2C_ADDR, REG_PRESS_MSB, 6)
    adc_P = (data[0] << 12) | (data[1] << 4) | (data[2] >> 4)
    adc_T = (data[3] << 12) | (data[4] << 4) | (data[5] >> 4)

    temp, press = compensate_temp_press(adc_T, adc_P, calib)

    print(f"Température : {temp:.2f} °C")
    print(f"Pression : {press:.2f} Pa")
    print("-----------------------------")

    time.sleep(1)
```

## LCD

Changer `LCD_ADDR` pour sélectionner le bon écran.

```python
import fcntl
import time
import os

I2C_SLAVE = 0x0703
LCD_ADDR = 0x27 # 0x26 Pour l'autre LCD
I2C_DEV = "/dev/i2c-1"

# Commandes LCD
LCD_CHR = 1  # Mode caractère
LCD_CMD = 0  # Mode commande

# Flags
LCD_BACKLIGHT = 0x08  # On
ENABLE = 0b00000100   # Bit Enable

# Instructions LCD
LCD_LINE = [0x80, 0xC0, 0x94, 0xD4]  # Adresses des lignes 1-4

class I2CLcd:
    def __init__(self, i2c_addr=LCD_ADDR):
        self.fd = os.open(I2C_DEV, os.O_RDWR)
        fcntl.ioctl(self.fd, I2C_SLAVE, i2c_addr)
        self.init_lcd()

    def write_byte(self, data):
        os.write(self.fd, bytes([data]))

    def toggle_enable(self, bits):
        self.write_byte(bits | ENABLE)
        time.sleep(0.0005)
        self.write_byte(bits & ~ENABLE)
        time.sleep(0.0001)

    def send_byte(self, bits, mode):
        high = mode | (bits & 0xF0) | LCD_BACKLIGHT
        low = mode | ((bits << 4) & 0xF0) | LCD_BACKLIGHT
        self.write_byte(high)
        self.toggle_enable(high)
        self.write_byte(low)
        self.toggle_enable(low)

    def command(self, cmd):
        self.send_byte(cmd, LCD_CMD)

    def write_char(self, char):
        self.send_byte(ord(char), LCD_CHR)

    def init_lcd(self):
        self.command(0x33)
        self.command(0x32)
        self.command(0x28)  # 4 bits, 2 lignes, 5x8 dots
        self.command(0x0C)  # Affichage on, curseur off
        self.command(0x06)  # Auto-incrément
        self.command(0x01)  # Efface écran
        time.sleep(0.005)

    def write_line(self, text, line):
        if 0 <= line < 4:
            self.command(LCD_LINE[line])
            for char in text.ljust(20):  # LCD2004 = 20 colonnes
                self.write_char(char)

    def clear(self):
        self.command(0x01)
        time.sleep(0.002)

    def close(self):
        os.close(self.fd)

# === Utilisation ===
if __name__ == "__main__":
    lcd = I2CLcd()
    try:
        lcd.write_line("A_LAT:  00.00000", 0)
        lcd.write_line("A_LON: 000.00000", 1)
        lcd.write_line("B_LAT:  00.00000", 2)
        lcd.write_line("B_LON: 000.00000", 3)
        # lcd.write_line("A_ALT", 0)
        # lcd.write_line("A_SPD", 1)
        # lcd.write_line("B_ALT", 2)
        # lcd.write_line("B_SPD", 3)

    finally:
        # time.sleep(10)
        # lcd.clear()
        lcd.close()

```

# Enable UART for GPS

```
sudo raspi-config
```

-   3 - Interface
-   I5 - Serial port
-   Sélectionner `No` pour désactiver le shell
-   Sélectionner `yes` pour activer le UART

## GPS

Voir le fichier `~/test_gpio/serial_test.py`

```python
import serial

def lire_et_ecrire_serial_ascii(device="/dev/serial0", baudrate=9600):
    try:
        with serial.Serial(device, baudrate, timeout=1) as ser:
            print(f"Connexion ouverte sur {device} (lecture/écriture)... (Ctrl+C pour arrêter)")
            while True:
                if ser.in_waiting:
                    line = ser.readline().decode('ascii', errors='replace').strip()
                    print(line)
    except serial.SerialException as e:
        print(f"Erreur série : {e}")
    except KeyboardInterrupt:
        print("\nArrêt manuel.")

if __name__ == "__main__":
    lire_et_ecrire_serial_ascii()
```

Voir le fichier `~/test_gpio/gps.py`

```python
def parse_gpgga(nmea_sentence):
    parts = nmea_sentence.strip().split(',')
    if len(parts) < 15:
        return None  # Trame incomplète

    try:
        time_str = parts[1]
        lat_str = parts[2]
        lat_dir = parts[3]
        lon_str = parts[4]
        lon_dir = parts[5]
        fix_quality = parts[6]
        num_satellites = parts[7]

        # Conversion latitude
        lat_deg = float(lat_str[:2])
        lat_min = float(lat_str[2:])
        latitude = lat_deg + lat_min / 60
        if lat_dir == 'S':
            latitude *= -1

        # Conversion longitude
        lon_deg = float(lon_str[:3])
        lon_min = float(lon_str[3:])
        longitude = lon_deg + lon_min / 60
        if lon_dir == 'W':
            longitude *= -1

        return {
            "time": time_str,
            "latitude": latitude,
            "longitude": longitude,
            "fix_quality": fix_quality,
            "satellites": num_satellites
        }
    except (ValueError, IndexError):
        return None


def test_gps(device="/dev/serial0"):
    try:
        with open(device, 'r') as serial:
            print(f"Lecture GPS sur {device}...")
            while True:
                line = serial.readline()
                if line.startswith('$GPGGA'):
                    data = parse_gpgga(line)
                    if data:
                        print("=== Données GPS ===")
                        print(f"Heure (UTC)   : {data['time']}")
                        print(f"Latitude      : {data['latitude']}")
                        print(f"Longitude     : {data['longitude']}")
                        print(f"Qualité Fix   : {data['fix_quality']}")
                        print(f"Satellites    : {data['satellites']}")
                        print("====================")
    except FileNotFoundError:
        print(f"Le périphérique {device} est introuvable.")
    except PermissionError:
        print(f"Permission refusée pour lire {device}. Utilisez sudo ?")
    except KeyboardInterrupt:
        print("Arrêt manuel.")

if __name__ == "__main__":
    test_gps()

```

# GPIO

[Using a push button with Raspberry Pi GPIO](https://raspberrypihq.com/use-a-push-button-with-raspberry-pi-gpio/)

```python
import RPi.GPIO as GPIO # Import Raspberry Pi GPIO library

GPIO.setwarnings(False) # Ignore warning for now
GPIO.setmode(GPIO.BOARD) # Use physical pin numbering
GPIO.setup(11, GPIO.IN, pull_up_down=GPIO.PUD_DOWN) # Set pin 10 to be an input pin and set initial value to be pulled low (off)

while True: # Run forever
    if GPIO.input(10) == GPIO.HIGH:
        print("Button was pushed!")
```

# PWM Ventilateurs

```python
import RPi.GPIO as GPIO
import time

FAN_PIN = 33  # FAN2
FREQ = 20000

GPIO.setmode(GPIO.BOARD)
GPIO.setup(FAN_PIN, GPIO.OUT)

# Création du PWM
pwm = GPIO.PWM(FAN_PIN, FREQ)
pwm.start(0)  # Démarre à 0% duty cycle (fan éteint)

pwm.ChangeDutyCycle(10)
print(f"Vitesse du ventilateur : 10%")

# pwm.stop()
GPIO.cleanup()
```
