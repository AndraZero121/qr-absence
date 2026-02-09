# Whatekster (WhatsApp Gateway)

Whatekster is a high-performance WhatsApp gateway service built with **Node.js** and **Baileys**. it provides a stateless REST API for the Laravel backend to send automated notifications.

## 🚀 Key Features
- **Stateless Messaging**: Send text or media via simple HTTP POST requests.
- **Session Stability**: Handles auto-reconnect and session persistence in the `auth/` directory.
- **Fast Setup**: Optimized for `bun` or `npm`.

## ⚙️ Installation

1.  **Setup**:
    ```bash
    cd whatekster
    ./setup.sh
    ```
2.  **Run**:
    ```bash
    node server.js
    ```
    *Default URL: `http://localhost:3050`*

## 📲 Connection Flow
1.  Launch the service.
2.  Look for the **QR Code** in your terminal.
3.  Open WhatsApp on your phone -> **Settings** -> **Linked Devices**.
4.  Scan the terminal QR code.
5.  System is now ready to relay messages from the Backend.

## 📡 API Reference

### Send Text Message
`POST /api/send-message`
- **Payload**:
```json
{
  "to": "6281234567890",
  "message": "Student John Doe has arrived at school."
}
```

### Check Health
`GET /api/status`
- Returns connection status and QR data if unlinked.
