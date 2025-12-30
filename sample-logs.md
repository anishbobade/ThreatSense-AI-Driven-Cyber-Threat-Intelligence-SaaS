# Sample Log Formats

This document provides sample log formats for the different data sources collected by ThreatSense.

## Firewall Log (example: iptables)

`Dec 10 08:32:10 myfirewall kernel: [4521.222333] [UFW BLOCK] IN=eth0 OUT= MAC=01:02:03:04:05:06:07:08:09:0a:0b:0c SRC=192.168.1.10 DST=192.168.1.1 LEN=40 TOS=0x00 PREC=0x00 TTL=64 ID=12345 DF PROTO=TCP SPT=12345 DPT=80 WINDOW=14600 RES=0x00 SYN URGP=0`

## OS Event Log (example: Windows Security Event Log)

`2025-12-31T10:00:00Z,Microsoft-Windows-Security-Auditing,4624,Logon,An account was successfully logged on.,S-1-5-21-3623811015-3361044348-30300820-1013,testuser,DOMAIN,0x3e7`

## Server Access Log (example: Apache)

`127.0.0.1 - - [31/Dec/2025:12:34:56 +0000] "GET /api/v1/users HTTP/1.1" 200 1234 "https://example.com/dashboard" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"`

## API Request Log (example: custom JSON format)

`{"timestamp": "2025-12-31T12:35:00.000Z", "source_ip": "10.0.0.5", "destination_ip": "10.0.0.1", "port": 443, "protocol": "HTTPS", "event_type": "api_request", "status_code": 201, "device_id": "api-gateway-1", "request_path": "/api/v2/orders", "method": "POST"}`

## Authentication Log (example: SSH)

`Dec 31 12:36:00 sshd[12345]: Accepted password for user123 from 203.0.113.12 port 54321 ssh2`
