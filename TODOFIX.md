# TODOFIX.md

Daftar fitur yang tidak berjalan, alur berantakan, race condition, dan ketidakkonsistenan CSS.

## 🏁 Masalah Utama (Critical)
- [x] **KERAWANAN KEAMANAN: IDOR di getDocument**: Method `AttendanceController@getDocument` tidak mengecek otorisasi. User manapun bisa melihat dokumen absen (surat sakit/izin) milik orang lain hanya dengan menebak ID.
- [x] **Race Condition Attendance Scan**: Method `AttendanceController@scan` tidak menggunakan `DB::transaction` saat mengecek dan membuat data. Ini berisiko membuat data ganda jika student melakukan scan dua kali dalam waktu bersamaan.
- [x] **KEBOCORAN PRIVASI Log: PII di WhatsApp Service**: Log WhatsApp mencatat nomor telepon dan 50 karakter pertama pesan secara plain-text. Seharusnya di-masking.
- [x] **KEBOCORAN PRIVASI: External QR API**: Deskta menggunakan API pihak ketiga (`qrserver.com`) untuk membuat QR Code. Data internal sekolah (Subject ID, Date) dikirim ke server luar via URL.
- [x] ~~**KERAWANAN KEAMANAN: Broken Authentication**: `AuthController.php` memperbolehkan siswa login hanya dengan NISN/NIS tanpa password (`isStudentNisnLogin`).~~ **DIAKTIFKAN KEMBALI sesuai permintaan user - fitur login NISN tanpa password untuk siswa**
    - [x] **BUG SINKRONISASI DESKTA**: Deskta mengecek field `role` di response login untuk validasi session, tapi Backend cuma kirim `user_type`. Mengakibatkan session sering dianggap tidak valid/mental.
    - [x] **INKONSISTENSI LABEL**: Label input adalah "NISN", tapi di `CREDENTIALS.md` tertulis NISN belum ada. User bingung harus input apa padahal backend dukung NIS & NISN.
    - [x] **DIVERGENSI NAMA ROLE**: "Peserta Didik" (Web) vs "Siswa" (Deskta).
- [x] **KERAWANAN KEAMANAN: Hardcoded Credentials**: `AdminSeeder.php` dan `CREDENTIALS.md` menyimpan password admin secara plain-text (`password123`).
- [ ] **DATA INTEGRITY: Demo Fallbacks**: Dashboard Waka, Guru, dan Wali Kelas (Web) memiliki data hardcoded dalam blok `catch`. Jika API error/mati, UI tetap menampilkan data "bohong" daripada pesan error, yang bisa menyesatkan user (e.g. menampilkan 'Budi Santoso' saat API mati).
- [ ] **Deskta Session Mismatch**: Role "Peserta Didik" (Backend) vs "Siswa" (Deskta) causes session validation failure.
- [ ] **Deskta Gaps**: `KehadiranSiswa` (None fetch), `KehadiranGuru` (Dummy), `RekapKehadiranSiswa` (None fetch).
- [ ] **DataSiswa (Web)**: Missing `handleViewSurat` function; broken "Download" button in preview modal.
- [ ] **RiwayatKehadiran (Web)**: Export Excel/PDF buttons have no onClick handlers.
- [ ] **DashboardSiswa (Web)**: Real-time attendance chart uses `Math.random()` instead of actual monthly data.
- [x] **DashboardWaka (Web)**: Variable bug (`pulangData` vs `terlambatData`).
- [ ] **Backend Hardcoding**: `DashboardController@wakaDashboard` hardcodes `pulang => 0`.
- [ ] **PII Leakage risk**: `signedUrl` falls back to public URLs if temporary URLs aren't supported.

## 🛠️ Backend (Laravel)
- [ ] **Gap Proses: Pengajuan Izin Siswa**: Siswa biasa tidak bisa mengajukan surat sakit/izin sendiri di `AbsenceRequestController`. Harus dilakukan oleh Pengurus Kelas (Class Officer).
- [ ] **Inefisiensi Notifikasi Mobile**: `MobileNotificationController` men-generate notifikasi "on-the-fly" dengan query DB yang berat setiap kali aplikasi dibuka. Belum ada sistem caching.
- [ ] **Missing Database Indices**: Kolom `date` pada tabel `attendances` tidak memiliki index. Query filtering harian/bulanan akan melambat drastis seiring bertambahnya data.
- [ ] **Incomplete Day Normalization**: `ScheduleController@normalizeDay` tidak memiliki mapping untuk hari Sabtu/Minggu. Jika ada ekskul atau jadwal di akhir pekan, sistem akan gagal memetakan hari ke standar Carbon.
- [ ] **Unused Retry Config**: Konfigurasi retry WhatsApp ada di `config/whatsapp.php` tapi tidak pernah diimplementasikan di `WhatsAppService`.
- [ ] **Status Mapping Conflict**: Backend maps `pulang` to `excused`, while frontend expects distinct `pulang`/`return` counts, causing zero results in charts.

## 🎨 Frontend & UI/UX Gaps
- [ ] **Data Mock di Grafik**: `DashboardSiswa.jsx` (Web) menggunakan `Math.random()` untuk men-generate persentase tren bulanan. Visual terlihat bagus tapi data tidak valid.
- [ ] **BUG LOGIK Dashboard Waka**: `DashboardWaka.jsx` mencoba mengakses `pulangData` yang tidak pernah didefinisikan (seharusnya `terlambatData`). Grafik "Terlambat" kemungkinan crash atau kosong.
- [ ] **Echo Placeholder**: Library `echo` (Real-time) diimpor di `PresensiSiswa.jsx` tapi tidak digunakan untuk fungsionalitas apapun (Dead code).
- [ ] **Hardcoded Dashboard URL**: Deskta masih menggunakan `http://localhost:8000` secara hardcoded di `KehadiranSiswaGuru.tsx`, bukan menggunakan base URL dari config.
- [ ] **Inkonsistensi Logout & Storage**: 
    - Web menggunakan `window.location.href = '/'`, Deskta menggunakan `navigate`.
    - Key storage bercampur: `userData`, `user`, `currentUser`, `selectedRole`. Berisiko tidak sinkron.
- [x] **KRISIS CSS & KONTRAS (Waka Pages)**: 
    - File CSS pendukung seperti `JadwalSiswaShow.css` dan `DashboardWaka.css` bersifat kosong (0 byte).
    - Mengakibatkan teks tidak terlihat (low contrast) karena menempel langsung di background gelap tanpa container/glassmorphism yang proper.
- [x] **STANDARDISASI PAGE WRAPPER**: Halaman `JadwalSiswaShow.jsx` dan beberapa halaman Waka lainnya tidak dibungkus `PageWrapper`, merusak konsistensi layout dan transisi animasi.
- [ ] **Status Mapping Divergence**: Logika pemetaan warna/label status diduplikasi di banyak file (`KehadiranSiswaGuru.tsx`, `PresensiSiswa.jsx`, `KehadiranGuruIndex.jsx`) daripada menggunakan utility terpusat.
- [ ] **Missing Loading/Error States**: Banyak halaman (seperti `PresensiSiswa.jsx`) akan "crash" atau blank jika `location.state` kosong, bukan menunjukkan error yang user-friendly.

## 🚀 Fitur & Fungsionalitas (Gaps)
- [ ] **Fitur Impor Belum Connect**: Tombol "Impor" di `SiswaAdmin.tsx` (Deskta) hanya memicu popup TODO, belum terhubung ke API backend.
- [ ] **Laporan Export Terbatas**: Export PDF di beberapa halaman menggunakan `window.print()` mentah yang layoutnya tidak rapi, bukan men-generate PDF yang profesional dari server atau library client-side yang teratur.
- [ ] **Coming Soon Features**: Fitur "Guru Pengganti" di Dashboard Staff masih bersifat placeholder (Coming Soon).
- [ ] **Real-time Echo Gaps**: Library `echo` diimpor di `PresensiSiswa.jsx` tapi belum benar-benar digunakan untuk update data secara real-time (hanya fetch manual).
- [ ] **Weekend Scheduling**: Sistem akan error jika guru mencoba memasukkan jadwal/presensi di hari Sabtu/Minggu karena mapping hari yang terbatas di backend & frontend.

## 🔄 Race Conditions Specifics
- [ ] `DashboardSiswa.jsx`: `fetchAttendanceSummary` dipanggil tanpa penanganan unmount.
- [ ] `KehadiranSiswaGuru.tsx`: `fetchData` di dalam `useMemo` (seharusnya `useEffect`) tanpa penanganan race condition.
- [ ] `KehadiranGuruIndex.jsx`: `fetchAttendance` dipanggil setiap kali `date` berubah tanpa membatalkan request sebelumnya.
- [ ] `DashboardWalliKelas.tsx`: `fetchHomeroomData` berpotensi menyebabkan memory leak karena tidak ada cleanup.

## 📋 List File yang Perlu Dicek/Refactor Segera
- `frontend/src/pages/Waka/KehadiranGuruIndex.jsx`
- `frontend/src/pages/Siswa/DashboardSiswa.jsx`
- `deskta/src/Pages/WaliKelas/DashboardWalliKelas.tsx` (Major Refactor for CSS & Clean Context)
- `deskta/src/Pages/Admin/GuruAdmin.tsx`
- `backend/app/Http/Controllers/AbsenceRequestController.php`
- `backend/app/Http/Controllers/StudentController.php` (Add API Resources)
- `backend/app/Http/Controllers/DashboardController.php` (Waka Dashboard Logic optimization)

## � Dummy Data & Unfinished Placeholders

### �️ Desktop (Deskta)
- [ ] **Ketergantungan DummyJadwal.png**: Hampir semua halaman yang menampilkan jadwal (`JadwalSiswa.tsx`, `LihatKelas.tsx`, `DetailJadwalGuru.tsx`, dll) menggunakan `DummyJadwal.png` sebagai fallback utama atau bahkan hardcoded source. Menunjukkan modul upload gambar jadwal belum stabil/terintegrasi sepenuhnya.
- [ ] **SiswaAdmin.tsx (Import)**: Tombol "Impor" di Admin Siswa masih berupa popup placeholder ("Fitur Import sedang dalam pengembangan integrasi"), belum terhubung ke CSV Parser maupun API.
- [ ] **DashboardStaff.tsx (Guru Pengganti)**: Halaman "Daftar Guru Pengganti" masih menggunakan komponen `ComingSoon`.
- [ ] **KehadiranSiswaWakel.tsx**: Penggunaan `Math.random()` untuk men-generate ID sementara (`temp-ID`) yang bisa menyebabkan duplikasi atau gagal simpan saat dikirim ke backend.
- [ ] **Tombak Kosong / Coming Soon**: Banyak tombol aksi di Dashboard Guru dan Staff yang hanya menampilkan log "Coming Soon" di console atau UI statis tanpa fungsi.

### 🌐 Web Frontend
- [ ] **Sistem "Demo Fallbacks"**:
    - `DashboardWaka.jsx`: Menggunakan data hardcoded (Line 50 & 56-60) jika API gagal.
    - `DashboardGuru.jsx`: Menggunakan data hardcoded (Line 61-64) jika API gagal.
    - `DashboardWakel.jsx`: Menggunakan data hardcoded (Line 65-70) jika API gagal.
- [ ] **DashboardSiswa.jsx (Trend Grafik)**: Persentase tren kehadiran bulanan di-generate menggunakan `Math.random()`. Visual terlihat meyakinkan tapi data tidak valid (Line 283).
- [ ] **KehadiranGuruShow.jsx**: Daftar kehadiran per sesi untuk guru masih menggunakan data `mock` hardcoded yang disimpan di `sessionStorage`, belum terhubung ke `TeacherController`.
- [ ] **Report Layout**: Banyak fitur "Cetak PDF" masih menggunakan `window.print()` mentah yang berisiko layout berantakan jika dicetak di perangkat berbeda atau browser berbeda.
- [ ] **TambahKelas.jsx & TambahGuru.jsx**: Dropdown atau filter yang bersifat dependen masih sering menggunakan data statis yang mungkin tidak sinkron dengan Database asli.

## 📝 Detil Teknis Tambahan

### 🛡️ Keamanan & Otorisasi
- [ ] **Bypass Otorisasi Manual**: Logika izin akses di manual attendance dilakukan melalui mapping manual yang kompleks, berpotensi ada celah role yang terlewat.
- [ ] **Data Disclosure**: `StudentController` tidak menggunakan Eloquent Resource, sehingga mengekspos field database internal secara langsung.

### ⚙️ Konfigurasi & Arsitektur
- [ ] **Hardcoded Configuration**: Grace period (15 menit) dan URL API di-hardcode di banyak tempat. Seharusnya terpusat di file config atau Database.
- [ ] **Inkonsistensi Teknis**: Perbedaan cara Logout dan manajemen `localStorage` antara versi Web dan Deskta yang berisiko konflik state (Double Login/Race Session).

### ⚡ Performa
- [ ] **Performance Sink (Waka Dashboard)**: `DashboardController@wakaDashboard` memiliki logika looping harian dalam sebulan penuh di tingkat Database/Backend. Ini akan menjadi bottleneck saat data bertambah ribuan row.
- [ ] **API Client Bypass**: Beberapa file seperti `KehadiranSiswaGuru.tsx` menembak API langsung dengan `fetch`, mengabaikan interceptor keamanan yang ada di `apiClient` pusat.