---
{
  "title": "Secure embedded systems at INL",
  "summary": "I worked on secure boot, multicore firmware, and UDP configuration for TI AM64x systems.",
  "organization": "Idaho National Laboratory",
  "role": "Embedded Systems Engineer Intern",
  "start": "2026-06",
  "end": "2026-09",
  "status": "completed",
  "location": "Idaho Falls, ID",
  "tags": [
    "embedded-systems",
    "security"
  ],
  "relatedProjects": []
}
---

I worked on embedded firmware at Idaho National Laboratory’s Cybercore Integration Center.

## Secure boot and memory
I automated AM64x secure-boot provisioning with Bash, Python, and gmake, cutting provisioning time by about 80%.

I also reduced the lwIP firmware size by 54%, from 1,221 KB to 559 KB, to help fit a six-core application into a 1.5 MB MSRAM budget.

## Multicore firmware
I worked on configuration handoff between the A53-0 core and four R5 cores using shared memory, TI IPC notifications, and ISRs. To fix coherency issues, I used cache maintenance, DMB and DSB instructions, and compiler barriers.

## UDP configuration
I built a bidirectional configuration service with lwIP and FreeRTOS. It validates packets, returns field-level errors, and saves verified settings to EEPROM.
