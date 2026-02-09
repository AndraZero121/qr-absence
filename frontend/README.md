# QR Absence Frontend (Web Portal)

A minimalist modern React application providing the user interface for the QR Attendance System. It serves Administrators, Teachers, Students, and Staff with role-specific dashboards.

## 🛠 Tech Stack
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4 (Utility-first, CSS-first config)
- **HTTP Client**: Axios
- **Real-Time**: Laravel Echo + Pusher JS (Reverb)
- **QR Scanner**: html5-qrcode
- **Charts**: Chart.js 4

## ✨ Features

### 👨‍💼 Admin
- **Master Data**: Manage Students, Teachers, Classes, and Majors.
- **Data Operations**: Bulk Import/Export via Excel and PDF.
- **Global Stats**: Real-time server status and attendance summaries.

### 🏫 Waka (Vice Principal)
- **Analytics**: Dashboard with Daily/Monthly Attendance Trends.
- **Monitoring**: Live overview of all classes and teacher presence.
- **Recaps**: Aggregated monthly reports per class.

### 👨‍🏫 Teacher (Guru)
- **Dashboard**: View daily teaching schedule with status indicators.
- **Classroom**: Scan student QR codes or manage manual attendance.
- **Homeroom**: Full dashboard for managing your own class students.

### 👨‍🎓 Student (Siswa) & Pengurus Kelas
- **Activity Feed**: Modern history log of all attendance records.
- **QR Operations**: Specialized tools for class officers to manage classroom sessions.
- **Mascots**: Integrated "Ino" and "Rasi" school mascots for a friendly UX.

## ⚙️ Setup

### Prerequisites
- Node.js (v20+)
- NPM or Bun

### Installation
1.  **Navigate to directory**:
    ```bash
    cd frontend
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    - File `.env` is automatically synchronized by the root `./setup-all.sh`.
    - Key variables: `VITE_API_URL`, `VITE_REVERB_APP_KEY`.

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Access at `http://localhost:5173`.

## 📦 Build for Production
```bash
npm run build
```
The output will be in `dist/`.

## 📁 Project Structure
- `src/components`: Reusable UI components powered by Tailwind 4.
- `src/pages`: Page views organized by Role (Admin, Guru, Siswa, Waka).
- `src/services`: Centralized API integration (`api.js`, `attendance.js`, `auth.js`).
- `src/utils`: Real-time listeners and constants.
