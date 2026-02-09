import React from 'react';
import Navbar from '../Common/Navbar';

function NavbarGuru() {
  const links = [
    { to: "/guru/dashboard", label: "Beranda" },
    { to: "/guru/jadwal", label: "Jadwal" },
    { to: "/guru/presensi", label: "Kehadiran Siswa" },
    { to: "/guru/izin", label: "Lapor Izin Mengajar" }, // New Link
  ];

  return (
    <Navbar links={links} showLogout={true} />
  );
}

export default NavbarGuru;