# Enable I2C

sudo raspi-config

3 - Interface

I4 - I2C

Enable I2C `yes`

# BMP280

Voir le fichier `~/test_gpio/bmp280.py`

```python
import smbus2
import time

# Adresse I2C du BMP280 (0x76 ou 0x77 selon le câblage)
BMP280_I2C_ADDR = 0x76

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

## En utilisant une librairie externe

Voici un exemple de script Python pour tester un capteur BMP280 (capteur de température et de pression) en utilisant un microcontrôleur ou un Raspberry Pi via le bus I2C, avec la bibliothèque `Adafruit_BMP.BMP280`.

### Pré-requis

Assure-toi d’installer la bibliothèque nécessaire :

```bash
pip install adafruit-circuitpython-bmp280
```

Et aussi les dépendances pour I2C (si tu es sur un Raspberry Pi par exemple) :

```bash
sudo apt-get install python3-pip python3-smbus i2c-tools
```

---

### Code Python pour tester le BMP280

```python
import time
import board
import busio
import adafruit_bmp280

# Initialisation du bus I2C
i2c = busio.I2C(board.SCL, board.SDA)

# Initialisation du capteur BMP280
bmp280 = adafruit_bmp280.Adafruit_BMP280_I2C(i2c)

# Configuration optionnelle
bmp280.sea_level_pressure = 1013.25  # pression au niveau de la mer en hPa

# Boucle de test
print("Lecture du capteur BMP280 :")
while True:
    temperature = bmp280.temperature
    pressure = bmp280.pressure
    altitude = bmp280.altitude

    print(f"Température : {temperature:.2f} °C")
    print(f"Pression : {pressure:.2f} hPa")
    print(f"Altitude estimée : {altitude:.2f} m")
    print("-----------------------------")

    time.sleep(2)
```

# UART pour GPS

sudo raspi-config

3 - Interface

I5 - Serial port

Sélectionner `No` pour désactiver le shell

Sélectionner `yes` pour activer le UART

# GPS

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
                    # ser.write(b"OK\n")  # Envoie un accusé de réception
    except serial.SerialException as e:
        print(f"Erreur série : {e}")
    except KeyboardInterrupt:
        print("\nArrêt manuel.")

if __name__ == "__main__":
    lire_et_ecrire_serial_ascii()
```

Voir le fichier `~/test_gpio/gps_raw.py`

```python
def lire_serial_brut(device="/dev/serial0"):
    try:
        with open(device, 'rb') as ser:  # mode binaire
            print(f"Lecture brute depuis {device}... (Ctrl+C pour arrêter)")
            while True:
                byte_data = ser.read(64)  # lit jusqu'à 64 octets
                if not byte_data:
                    continue

                # Affichage hexadécimal
                hex_output = ' '.join(f"{b:02X}" for b in byte_data)
                print(f"[HEX]   {hex_output}")

                # Tentative de décodage ASCII, remplacement des erreurs
                ascii_output = byte_data.decode('ascii', errors='replace')
                print(f"[ASCII] {ascii_output.strip()}")

    except FileNotFoundError:
        print(f"Périphérique {device} introuvable.")
    except PermissionError:
        print(f"Permission refusée. Utilise sudo ou ajoute ton utilisateur au groupe dialout.")
    except KeyboardInterrupt:
        print("\nArrêt manuel.")

if __name__ == "__main__":
    lire_serial_brut()
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

# LCD

```python
import fcntl
import time
import os

I2C_SLAVE = 0x0703
LCD_ADDR = 0x27
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
        lcd.write_line("Bonjour, Mathias!", 0)
        lcd.write_line("LCD2004 I2C test", 1)
        lcd.write_line("Sans librairies", 2)
        lcd.write_line("Externe :) ", 3)
    finally:
        time.sleep(10)
        lcd.clear()
        lcd.close()

```
