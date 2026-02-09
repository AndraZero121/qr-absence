import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';

import { 
  FaHome, 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaSchool, 
  FaBook, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaFileAlt, 
  FaHistory,
  FaShieldAlt,
  FaUserShield,
  FaUsers
} from 'react-icons/fa';

// Pages
const adminLinks = [
  { to: "/admin/dashboard", label: "Beranda", icon: <FaHome /> },
  { to: "/admin/siswa", label: "Data Siswa", icon: <FaUserGraduate /> },
  { to: "/admin/guru", label: "Data Guru", icon: <FaChalkboardTeacher /> },
  { to: "/admin/jadwal-guru", label: "Jadwal Guru", icon: <FaCalendarAlt /> },
  { to: "/admin/jadwal-siswa", label: "Jadwal Siswa", icon: <FaCalendarAlt /> },
  { to: "/admin/kelas", label: "Data Kelas", icon: <FaSchool /> },
  { to: "/admin/jurusan", label: "Data Konsentrasi Keahlian", icon: <FaBook /> },
];

const guruLinks = [
  { to: "/guru/dashboard", label: "Beranda", icon: <FaHome /> },
  { to: "/guru/jadwal", label: "Jadwal", icon: <FaCalendarAlt /> },
  { to: "/guru/presensi", label: "Kehadiran Siswa", icon: <FaClipboardList /> },
  { to: "/guru/izin", label: "Lapor Izin Mengajar", icon: <FaFileAlt /> },
];

const siswaLinks = [
  { to: "/siswa/dashboard", label: "Beranda", icon: <FaHome /> },
  { to: "/siswa/riwayat", label: "Riwayat Kehadiran", icon: <FaHistory /> },
];

const pengurusLinks = [
  { to: "/pengurus-kelas/dashboard", label: "Beranda", icon: <FaHome /> },
  { to: "/pengurus-kelas/riwayat", label: "Riwayat Kehadiran", icon: <FaHistory /> },
  { to: "/pengurus-kelas/presensi", label: "Presensi", icon: <FaClipboardList /> },
];

const wakelLinks = [
  { to: "/walikelas/dashboard", label: "Beranda", icon: <FaHome /> },
  { to: "/walikelas/datasiswa", label: "Data Siswa", icon: <FaUsers /> },
  { to: "/walikelas/riwayatkehadiran", label: "Riwayat Kehadiran", icon: <FaHistory /> },
  { to: "/walikelas/jadwalwakel", label: "Jadwal", icon: <FaCalendarAlt /> },
];

const wakaLinks = [
  { to: "/waka/dashboard", label: "Dashboard", icon: <FaHome /> },
  { to: "/waka/jadwal-guru", label: "Jadwal Guru", icon: <FaChalkboardTeacher /> },
  { to: "/waka/jadwal-siswa", label: "Jadwal Siswa", icon: <FaUserGraduate /> },
  { to: "/waka/kehadiran-siswa", label: "Presensi Siswa", icon: <FaClipboardList /> },
  { to: "/waka/kehadiran-guru", label: "Presensi Guru", icon: <FaUserShield /> },
];

// Pages
import LandingPage from './pages/Auth/LandingPage';
import LoginPage from './pages/Auth/LoginPage';

// Admin Pages
import Dashboard from './pages/Admin/Dashboard';
import DataSiswa from './pages/Admin/DataSiswa';
import DataGuru from './pages/Admin/DataGuru';
import DataKelas from './pages/Admin/DataKelas';
import DataJurusan from './pages/Admin/DataJurusan';

// Guru Pages
import DashboardGuru from './pages/Guru/DashboardGuru';
import Jadwal from './pages/Guru/Jadwal';
import PresensiSiswa from './pages/Guru/PresensiSiswa';

// Siswa Pages
import DashboardSiswa from './pages/Siswa/DashboardSiswa';
import Riwayat from './pages/Siswa/Riwayat';

// Pengurus Kelas Pages
import DashboardKelas from './pages/PengurusKelas/DashboardKelas';
import RiwayatKelas from './pages/PengurusKelas/RiwayatKelas';
import PresensiKelas from './pages/PengurusKelas/PresensiKelas';

// Wali Kelas Pages
import DashboardWakel from './pages/WaliKelas/DashboardWakel';
import Data from './pages/WaliKelas/Data';
import RiwayatKehadiran from './pages/WaliKelas/RiwayatKehadiran';
import JadwalWakel from './pages/WaliKelas/JadwalWakel'; 
import Presensi from './pages/WaliKelas/Presensi';

// Waka Pages
import DashboardWaka from './pages/Waka/DashboardWaka';
import JadwalGuruIndex from './pages/Waka/JadwalGuruIndex';
import JadwalGuruShow from './pages/Waka/JadwalGuruShow';
import JadwalGuruEdit from './pages/Waka/JadwalGuruEdit';
import JadwalSiswaIndex from './pages/Waka/JadwalSiswaIndex';
import JadwalSiswaShow from './pages/Waka/JadwalSiswaShow';
import JadwalSiswaEdit from './pages/Waka/JadwalSiswaEdit';
import KehadiranSiswaIndex from './pages/Waka/KehadiranSiswaIndex';
import KehadiranSiswaShow from './pages/Waka/KehadiranSiswaShow';
import KehadiranSiswaRekap from './pages/Waka/KehadiranSiswaRekap';
import KehadiranGuruIndex from './pages/Waka/KehadiranGuruIndex';
import KehadiranGuruShow from './pages/Waka/KehadiranGuruShow';

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login/:role" element={<LoginPage />} />
      <Route path="/login" element={<Navigate to="/" replace />} />

      {/* Admin Routes */}
      <Route element={<Layout links={adminLinks} />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/siswa" element={<DataSiswa />} />
        <Route path="/admin/guru" element={<DataGuru />} />
        <Route path="/admin/jadwal-guru" element={<JadwalGuruIndex />} />
        <Route path="/admin/jadwal-guru/:id" element={<JadwalGuruShow />} />
        <Route path="/admin/jadwal-guru/:id/edit" element={<JadwalGuruEdit />} />
        <Route path="/admin/jadwal-siswa" element={<JadwalSiswaIndex />} />
        <Route path="/admin/jadwal-siswa/:id" element={<JadwalSiswaShow />} />
        <Route path="/admin/jadwal-siswa/:id/edit" element={<JadwalSiswaEdit />} />
        <Route path="/admin/kelas" element={<DataKelas />} />
        <Route path="/admin/jurusan" element={<DataJurusan />} />
      </Route>

      {/* Guru Routes */}
      <Route element={<Layout links={guruLinks} />}>
        <Route path="/guru/dashboard" element={<DashboardGuru />} />
        <Route path="/guru/jadwal" element={<Jadwal />} />
        <Route path="/guru/presensi" element={<PresensiSiswa />} />
      </Route>

      {/* Siswa Routes */}
      <Route element={<Layout links={siswaLinks} />}>
        <Route path="/siswa/dashboard" element={<DashboardSiswa />} />
        <Route path="/siswa/riwayat" element={<Riwayat />} />
      </Route>
      
      {/* Pengurus Kelas Routes */}
      <Route element={<Layout links={pengurusLinks} />}>
        <Route path="/pengurus-kelas/dashboard" element={<DashboardKelas />} />
        <Route path="/pengurus-kelas/riwayat" element={<RiwayatKelas />} />
        <Route path="/pengurus-kelas/presensi" element={<PresensiKelas />} />
      </Route>

      {/* Wali Kelas Routes */}
      <Route element={<Layout links={wakelLinks} />}>
        <Route path="/walikelas/dashboard" element={<DashboardWakel />} />
        <Route path="/walikelas/datasiswa" element={<Data />} />
        <Route path="/walikelas/riwayatkehadiran" element={<RiwayatKehadiran />} />
        <Route path="/walikelas/jadwalwakel" element={<JadwalWakel />} />
        <Route path="/walikelas/presensi" element={<Presensi />} />
      </Route>

      {/* Waka Routes */}
      <Route element={<Layout links={wakaLinks} />}>
        <Route path="/waka/dashboard" element={<DashboardWaka />} />
        <Route path="/waka/jadwal-guru" element={<JadwalGuruIndex />} />
        <Route path="/waka/jadwal-guru/:id" element={<JadwalGuruShow />} />
        <Route path="/waka/jadwal-guru/:id/edit" element={<JadwalGuruEdit />} />
        <Route path="/waka/jadwal-siswa" element={<JadwalSiswaIndex />} />
        <Route path="/waka/jadwal-siswa/:id" element={<JadwalSiswaShow />} />
        <Route path="/waka/jadwal-siswa/:id/edit" element={<JadwalSiswaEdit />} />
        <Route path="/waka/kehadiran-siswa" element={<KehadiranSiswaIndex />} />
        <Route path="/waka/kehadiran-siswa/rekap" element={<KehadiranSiswaRekap />} />
        <Route path="/waka/kehadiran-siswa/:id" element={<KehadiranSiswaShow />} />
        <Route path="/waka/kehadiran-guru" element={<KehadiranGuruIndex />} />
        <Route path="/waka/kehadiran-guru/:id" element={<KehadiranGuruShow />} />
      </Route>

      {/* Route Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;