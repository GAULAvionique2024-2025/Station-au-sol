void setup() {
  Serial.begin(9600);
}

void loop() {
  // PREFLIGHT (240bit)
  //
  // $(char8bit)
  // Stats(8bit)
  // V_Lipo1(mV)(uint16bit)
  // V_Lipo2(mV)(uint16bit)
  // V_Lipo3(mV)(uint16bit)
  // 5V_AN(mV)(uint16bit)
  // Temp(°C)(float32bit)
  // Altitude(m)(float32bit)
  // AngleRoll(°)(float32bit)
  // AnglePitch(°)(float32bit)
  // *(char8bit)
  // CRC(16bit)
  // <LF>(char8bit)

  // FLIGHT (320bit)
  //
  // $(char8bit)
  // Stats(8bit)
  // Altitude(m)(float32bit)
  // Latitude(ddmm.mmmm)(char72bit)
  // Latitude_ind(char8bit)
  // Longitude(dddmm.mmmm)(char80bit)
  // Longitude_ind(char8bit)
  // AccX(m/s²)(float32bit)
  // AccY(m/s²)(float32bit)
  // AccZ(m/s²)(float32bit)
  // AngleRoll(°)(float32bit)
  // AnglePitch(°)(float32bit)
  // KalmanAngleRoll(°)(float32bit)
  // KalmanAnglePitch(°)(float32bit)
  // *(char8bit)
  // CRC(16bit)
  // <LF>(char8bit)

  // POSTFLIGHT (280bit)
  // $(char8bit)
  // Stats(8bit)
  // Latitude(ddmm.mmmm)(char72bit)
  // Latitude_ind(char8bit)
  // Longitude(dddmm.mmmm)(char80bit)
  // Longitude_ind(char8bit)
  // V_Lipo1(mV)(uint16bit)
  // V_Lipo2(mV)(uint16bit)
  // V_Lipo3(mV)(uint16bit)
  // 5V_AN(mV)(uint16bit)
  // *(char8bit)
  // CRC(16bit)
  // <LF>(char8bit)

  // Statut des différents composants
  // Stats(8bit): Mode(2bit)Igniter1(1bit)Igniter2(1bit)Accelerometer(1bit)Barometer(1bit)Gps(1bit)SD(1bit)

  // PREFLIGHT
  uint8_t preflightdata[] = {
    '$', // $
    0b00101111, // Preflight mode, igniter2 bad, everything else good
    0b00010011, 0b01010110, // V_Lipo1 = 4950mV
    0b00010011, 0b00010110, // V_Lipo2 = 4886mV
    0b00010011, 0b10000111, // V_Lipo3 = 4999mV
    0b00010011, 0b10001000, // 5V_AN = 5000mV
    0b01000010, 0b00000000, 0b10101000, 0b00111110, // Temp = 32.1643°C
    0b01000100, 0b10001101, 0b01001010, 0b01001110, // Altitude = 1130.322m
    0b11000010, 0b11100011, 0b00011110, 0b11001000, // AngleRoll = -113.56012°
    0b01000010, 0b00000011, 0b11001000, 0b01010110, // AnglePitch = 32.94564°
    '*', // *
    0x00, 0x00, // CRC (NULL)
    0x0A // <LF>
  };
  for (int i = 0; i < sizeof(preflightdata); i++) {
    Serial.write(preflightdata[i]);
  }
  delay(1000);

  // FLIGHT
  uint8_t flightdata[] = {
    '$', // $
    0b01111111, // Flight mode, all good
    0b01000100, 0b11010110, 0b00111010, 0b01010110, // Altitude = 1713.823m
    '4', '6', '4', '6', '.', '8', '9', '9', '6', // Latitude = "4646.8996" (46.78166)
    'N', // Latitude_ind = "N"
    '0', '7', '1', '1', '6', '.', '6', '0', '2', '6', // Longitude = "07116.6026" (-71.27671)
    'W', // Longitude_ind = "W"
    0b00111110, 0b00101001, 0b11001010, 0b00011001, // AccX = 0.16581m/s²
    0b10111111, 0b01111010, 0b01100101, 0b01101011, // AccY = -0.97811m/s²
    0b00111110, 0b10000000, 0b10010001, 0b10011111, // AccZ = 0.251111m/s²
    0b11000011, 0b01110110, 0b11100100, 0b01000000, // AngleRoll = -246.8916°
    0b01000010, 0b01100000, 0b11000011, 0b00010000, // AnglePitch = 56.19049°
    0b11000011, 0b01110101, 0b10100101, 0b10100000, // KalmanAngleRoll = -245.64698°
    0b01000010, 0b01100011, 0b11001001, 0b10101011, // KalmanAnglePitch = 56.94694°
    '*', // *
    0x00, 0x00, // CRC (NULL)
    0x0A // <LF>
  };
  for (int i = 0; i < sizeof(flightdata); i++) {
    Serial.write(flightdata[i]);
  }
  delay(1000);

  // POSTFLIGHT
  uint8_t postflightdata[] = {
    '$', // $
    0b10111111, // Postflight mode, all good
    '4', '6', '4', '6', '.', '9', '0', '3', '8', // Latitude = "4646.9038" (46.78173)
    'N', // Latitude_ind
    '0', '7', '1', '1', '7', '.', '1', '5', '1', '0', // Longitude = "07117.1510" (-71.28585)
    'W', // Longitude_ind
    0b00010000, 0b01111000, // V_Lipo1 = 4216mV
    0b00010001, 0b00000011, // V_Lipo2 = 4355mV
    0b00010000, 0b10110111, // V_Lipo3 = 4279mV
    0b00010001, 0b11111000, // 5V_AN = 4600mV
    '*', // *
    0x00, 0x00, // CRC (NULL)
    0x0A // <LF>
  };
  for (int i = 0; i < sizeof(postflightdata); i++) {
    Serial.write(postflightdata[i]);
  }
  delay(1000);
}