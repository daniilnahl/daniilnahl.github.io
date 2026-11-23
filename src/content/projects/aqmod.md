---
{
  "title": "AQMod",
  "summary": "An ESP32-S3 air-quality monitor with FreeRTOS, BLE, and an on-device ML model.",
  "featured": true,
  "placeholder": false,
  "tags": [
    "embedded-systems",
    "tinyml"
  ],
  "role": "Developer",
  "technologies": [
    "ESP32-S3",
    "FreeRTOS",
    "Edge Impulse",
    "I2C",
    "ADC",
    "BLE",
    "C++"
  ],
  "repository": "https://github.com/daniilnahl/AQMod",
  "dates": "Jun – Dec 2025",
  "chaos": {
    "geometry": "block",
    "palette": "electric-blue",
    "scale": "large"
  },
  "demo": "https://www.youtube.com/watch?v=QCavVsFAdSI"
}
---

I built AQMod to measure and classify air quality on an ESP32-S3. It uses BMP280, MQ-9, and SEN54 sensors. FreeRTOS manages four services handling ten air-quality parameters.

## Hardware and firmware
The firmware reads sensors over I2C and ADC, runs an Edge Impulse model on the board, and sends readings over BLE. I used KiCad for the schematic and connected four peripherals.

The repo has the firmware, data-collection scripts, model files, and schematic.

## Results
- Reduced per-cycle stack usage by 60%, from 7 KB to 2.8 KB, by optimizing the FreeRTOS tasks.
- Reached 89.9% accuracy in air-quality classification with the on-device model.
- Added BLE broadcasts so a client device can monitor readings in real time.

[Code and schematic](https://github.com/daniilnahl/AQMod)
