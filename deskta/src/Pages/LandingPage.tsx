import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoSchool from '../assets/Icon/logo smk.png';
import Inorasi from '../assets/Icon/INORASI2.png';
import HalamanUtama from '../assets/Icon/HalamanUtama.png';

// Komponen: Interface untuk props LandingPage
interface LandingPageProps {
  onRoleSelect: (role: string) => void;
}

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'waka', label: 'Waka Staff' },
  { value: 'pengurus_kelas', label: 'Pengurus Kelas' },
  { value: 'siswa', label: 'Siswa' },
  { value: 'wakel', label: 'Wali Kelas' },
  { value: 'guru', label: 'Guru' },
];

// Komponen: LandingPage - Halaman utama untuk pemilihan role
export default function LandingPage({ onRoleSelect }: LandingPageProps) {
  const [selectedRole, setSelectedRole] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Fungsi: Navigasi ke halaman login setelah memilih role
  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
      navigate('/login');
    }
  };

  // Variabel: Mendapatkan label role yang dipilih, atau teks default
  const selectedRoleLabel =
    selectedRole
      ? ROLES.find(role => role.value === selectedRole)?.label
      : 'Masuk sebagai';

  return (
    <>
      {/* SECTION: Background Halaman Utama */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${HalamanUtama})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* SECTION: Konten Utama */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        {/* Logo Sekolah */}
        <img
          src={LogoSchool}
          alt="Logo SMK"
          style={{
            position: 'absolute',
            top: '20px',
            right: '40px',
            width: '90px',
            height: 'auto',
            zIndex: 2,
          }}
        />


        {/* Container > judul, logo Inorasi, dan form pemilihan role */}
        <div
          style={{
            width: '100%',
            maxWidth: '560px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Komponen: Judul Utama */}
          <h1
            style={{
              fontSize: 'clamp(35px, 4vw, 40px)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '2px',
              margin: 0,
              textShadow: '0 3px 8px rgba(0,0,0,0.3)',
            }}
          >
            PRESENSI PEMBELAJARAN DIGITAL
          </h1>

          {/* Komponen: Subjudul (Nama Sekolah) */}
          <p
            style={{
              fontSize: 'clamp(16px, 3vw, 24px)',
              fontWeight: 700,
              color: '#ffffff',
              margin: '8px 0 12px',
              letterSpacing: '1px',
            }}
          >
            SMKN 2 SINGOSARI
          </p>

          {/* Komponen: Logo Inorasi */}
          <img
            src={Inorasi}
            alt="Inorasi"
            style={{
              width: '100%',
              maxWidth: '400px',
              height: 'auto',
              marginBottom: '32px',
            }}
          />

          {/* SECTION: Form Pemilihan Role */}
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <div ref={dropdownRef} style={{ marginBottom: '24px', position: 'relative' }}>
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  border: '2px solid rgba(30, 58, 138, 0.8)',
                  backgroundColor: '#001F3F',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                <span>{selectedRoleLabel}</span>
                <span style={{ marginLeft: '10px' }}>{isDropdownOpen ? '▲' : '▼'}</span>
              </button>

              {/* Komponen: Dropdown Content (Daftar Role) */}
              {isDropdownOpen && (
                <div
                  ref={dropdownContentRef}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    border: '2px solid rgba(30, 58, 138, 0.6)',
                    borderRadius: '12px',
                    marginTop: '8px',
                    backgroundColor: '#ffffff',
                    zIndex: 1000,
                    maxHeight: 'calc(100vh - 300px)',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {/* Loop: Menampilkan semua role dari array ROLES */}
                  {ROLES.map(role => (
                    <button
                      key={role.value}
                      onClick={() => {
                        setSelectedRole(role.value);
                        setIsDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 20px',
                        border: 'none',
                        borderBottom: '1px solid #f1f1f1',
                        backgroundColor: selectedRole === role.value ? '#1D4ED8' : '#ffffff',
                        color: selectedRole === role.value ? '#ffffff' : '#0F172A',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        fontSize: '15px',
                      }}
                      // Efek hover untuk item dropdown
                      onMouseEnter={(e) => {
                        if (selectedRole !== role.value) {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedRole !== role.value) {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                        }
                      }}
                    >
                      {/* Label role */}
                      {role.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Komponen: Button Lanjutkan */}
            {/* Tampil hanya jika role telah dipilih */}
            {selectedRole && (
              <button
                onClick={handleContinue}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#ffffff',
                  backgroundColor: '#001F3F', // Warna navy
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginTop: '8px',
                  boxShadow: '0 4px 12px rgba(0, 31, 63, 0.3)',
                }}
                // Efek hover untuk button lanjutkan
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#002952';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 31, 63, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#001F3F';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 31, 63, 0.3)';
                }}
                // Efek tekan untuk button lanjutkan
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
              >
                Lanjutkan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION: Styling Custom Scrollbar untuk Dropdown */}
      {/* CSS inline untuk styling scrollbar pada dropdown */}
      <style>{`
        /* Styling untuk scrollbar dropdown */
        div[style*="maxHeight: calc(100vh - 300px)"] {
          scrollbar-width: thin;
          scrollbar-color: #001F3F #f1f1f1;
        }
        
        /* Webkit browsers (Chrome, Safari, Edge) */
        div[style*="maxHeight: calc(100vh - 300px)"]::-webkit-scrollbar {
          width: 8px;
        }
        
        div[style*="maxHeight: calc(100vh - 300px)"]::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 0 10px 10px 0;
        }
        
        div[style*="maxHeight: calc(100vh - 300px)"]::-webkit-scrollbar-thumb {
          background: #001F3F;
          border-radius: 4px;
        }
        
        div[style*="maxHeight: calc(100vh - 300px)"]::-webkit-scrollbar-thumb:hover {
          background: #002952;
        }
        
        /* Firefox */
        div[style*="maxHeight: calc(100vh - 300px)"] {
          scrollbar-width: thin;
          scrollbar-color: #001F3F #f1f1f1;
        }
      `}</style>
    </>
  );
}