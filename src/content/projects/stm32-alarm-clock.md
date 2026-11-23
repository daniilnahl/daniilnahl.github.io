---
{
  "title": "STM32 alarm clock",
  "summary": "An STM32 alarm clock with a UART CLI, an LCD, and PWM melodies.",
  "featured": true,
  "placeholder": false,
  "tags": [
    "embedded-systems"
  ],
  "role": "Developer",
  "technologies": [
    "STM32C031C6",
    "C",
    "STM32 HAL",
    "USART",
    "RTC",
    "I2C",
    "PWM"
  ],
  "repository": "https://github.com/daniilnahl/Alarm-Clock-NucleoC031C6",
  "chaos": {
    "geometry": "band",
    "palette": "ice-blue",
    "scale": "large"
  },
  "dates": "Mar – May 2025",
  "demo": "https://www.youtube.com/watch?v=joikh8UFD_I"
}
---

I built this alarm clock on a NUCLEO-C031C6 while learning STM32. You can set the time and alarms from a serial terminal at 115,200 bps.

## How it works
The CLI uses interrupts to keep blocking to a minimum. The RTC handles timekeeping and alarms, and an I2C LCD shows the time and alarm status.

For the buzzer, I used TIM1 PWM and stored tone tables in flash to play custom melodies. When an alarm goes off, the buzzer plays and the LCD shows an alarm message. Dismissing it returns the display to the clock.

I wrote the firmware in C using the STM32Cube tools. The LCD module uses MicroPeta’s library, credited in the repo.

[Code and setup](https://github.com/daniilnahl/Alarm-Clock-NucleoC031C6)
