# Deskta Login Credentials

## Test Accounts untuk Deskta Application

### 🔐 Admin Account
```
Username: admin
Email: admin@example.com
Password: password123
Role: Admin
```

**Akses:**
- Dashboard statistik sekolah
- Management siswa, guru, kelas, jurusan (Phase 4 - belum diimplementasi)
- Lihat semua data

---

### 🎓 Waka (Wakil Kepala Sekolah)  
```
Username: waka1
Email: waka@example.com
Password: password123
Role: Waka (Admin type)
```

**Akses:**
- Dashboard Waka
- Monitoring kehadiran guru dan siswa
- Laporan statistik

---

### 👨‍🏫 Guru Account
```
Username: guru1
Email: guru1@example.com
Password: password123
Role: Guru (Teacher)
NIP: NIP-0001
Mata Pelajaran: Matematika
```

**Akses:**
- Dashboard jadwal mengajar
- Lihat jadwal hari ini
- Absensi siswa (QR scan - belum diimplementasi)
- Input manual kehadiran

---

### 👨‍🏫 Wali Kelas Account
```
Username: walikelas1
Email: walikelas1@example.com
Password: password123
Role: Wali Kelas (Teacher)
NIP: NIP-WALI-001
Kelas: XII TKJ 1
```

**Akses:**
- Dashboard kelas wali
- Data siswa kelas
- Jadwal kelas
- Rekap kehadiran kelas

---

### 👨‍🎓 Siswa Accounts

**Siswa 1:**
```
Username: siswa1
Email: siswa1@example.com
Password: password123
NISN: 0024001
NIS: 2024001
Nama: Ahmad Rizki
Kelas: XII TKJ 1
```

**Siswa 2:**
```
Username: siswa2
Email: siswa2@example.com
Password: password123
NISN: 0024002
NIS: 2024002
Nama: Siti Nurhaliza
Kelas: XII TKJ 1
```

**Siswa 3:**
```
Username: siswa3
Email: siswa3@example.com
Password: password123
NISN: 0024003
NIS: 2024003
Nama: Budi Santoso
Kelas: XII TKJ 1
```

**Akses:**
- Dashboard siswa
- Jadwal kelas hari ini
- Statistik kehadiran pribadi
- Chart kehadiran bulanan

**Login Options:**
1. **NISN saja** (tanpa password) - Masukkan: `0024001`, `0024002`, atau `0024003`
2. **Username + Password** - Masukkan: `siswa1` + `password123`

---

### 📝 Pengurus Kelas Account
```
Username: pengurus1
Email: pengurus1@example.com
Password: password123
NISN: 0024999
NIS: 2024999
Nama: Ketua Kelas TKJ 1
Kelas: XII TKJ 1
```

**Akses:**
- Dashboard pengurus kelas
- Generate QR untuk absensi
- Lihat jadwal kelas
- Rekap kehadiran kelas

**Login Options:**
1. **NISN saja** (tanpa password) - Masukkan: `0024999`
2. **Username + Password** - Masukkan: `pengurus1` + `password123`

---

### 📝 Notes

**Database Status:**
- ✅ Admin account: Seeded
- ✅ Waka account: Seeded
- ✅ Guru account: Seeded  
- ✅ Wali Kelas account: Seeded
- ✅ Siswa accounts (3): Seeded
- ✅ Pengurus Kelas account: Seeded

**Untuk reset database dengan semua seeder:**
```bash
php artisan migrate:fresh --seed
```

---

## 🧪 Testing URLs

**Frontend (Deskta):**
```
http://localhost:5173
```

**Backend API:**
```
http://127.0.0.1:8001
```

**Test Login API:**
```bash
curl -X POST http://127.0.0.1:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","password":"password123"}'
```

---

## 📊 Dashboard Features by Role

### Admin
- ✅ Total Rombel, Siswa, Guru, Lab (dari API)
- ⏳ CRUD Siswa, Guru, Kelas, Jurusan (Phase 4)

### Guru
- ✅ Jadwal mengajar hari ini (dari API)
- ⏳ QR Scan untuk absensi (Phase 4)
- ⏳ Input manual kehadiran (Phase 4)

### Siswa
- ✅ Jadwal kelas hari ini (dari API)
- ✅ Statistik kehadiran (dari API)
- ✅ Chart kehadiran bulanan

### Wali Kelas
- ✅ Info kelas wali (dari API)
- ✅ Total siswa (dari API)
- ✅ Jadwal kelas (dari API)

### Waka & Pengurus Kelas
- ✅ UI Dashboard (dummy data)
- ⏳ API Integration (optional)

---

## 🔧 Troubleshooting

**Login gagal?**
1. Cek backend running: `http://127.0.0.1:8001`
2. Cek database connection
3. Cek credentials benar
4. Lihat console browser untuk error

**Data tidak muncul?**
1. Cek Network tab di DevTools
2. Verify API response
3. Cek token tersimpan di localStorage
4. Restart backend jika perlu

---

**Last Updated:** 2026-02-05
**Status:** Ready for Testing ✅
