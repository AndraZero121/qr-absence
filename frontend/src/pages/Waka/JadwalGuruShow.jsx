import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CustomAlert from '../../components/Common/CustomAlert';
import PageWrapper from '../../components/ui/PageWrapper';
import apiClient from '../../services/api';
import { STORAGE_BASE_URL } from '../../utils/constants';
import {
  FaArrowLeft,
  FaChalkboardTeacher,
  FaChevronRight,
  FaDownload,
  FaImage,
  FaSpinner,
  FaTimes,
  FaTrash
} from 'react-icons/fa';

function JadwalGuruShow() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jadwal, setJadwal] = useState(null);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch teacher data from API
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/teachers/${id}`);
        setJadwal(response.data);
      } catch (error) {
        console.error("Error fetching teacher details:", error);
        showAlert('error', 'Gagal', 'Data guru tidak ditemukan atau terjadi kesalahan koneksi.');
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [id]);

  // Custom Alert State
  const [alertState, setAlertState] = useState({
    show: false,
    type: 'info',
    title: '',
    message: '',
    action: null,
    data: null
  });

  const showAlert = (type, title, message, action = null, data = null) => {
    setAlertState({
      show: true,
      type,
      title,
      message,
      action,
      data
    });
  };

  const closeAlert = () => {
    setAlertState(prev => ({ ...prev, show: false }));
  };

  const handleConfirmAction = async () => {
    if (alertState.action === 'delete_schedule') {
      try {
        setLoading(true);
        await apiClient.delete(`/teachers/${id}/schedule-image`);
        
        setJadwal(prev => ({
          ...prev,
          schedule_image_path: null
        }));

        showAlert('success', 'Berhasil', 'Jadwal berhasil dihapus!');
      } catch (error) {
        console.error("Error deleting schedule image:", error);
        showAlert('error', 'Gagal', 'Terjadi kesalahan saat menghapus jadwal.');
      } finally {
        setLoading(false);
      }
      return;
    }
    closeAlert();
  };


  const handleDeleteImage = () => {
    showAlert('confirm', 'Konfirmasi Hapus', 'Yakin ingin menghapus jadwal ini?', 'delete_schedule');
  };

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setShowFullscreen(false);
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, []);

  if (!jadwal && loading) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
      </PageWrapper>
    );
  }

  if (!jadwal) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-gray-100 text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FaTimes size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tight">Data Tidak Ditemukan</h2>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">Profil guru yang Anda cari tidak tersedia dalam sistem atau telah dihapus.</p>
          <Link 
            to={window.location.pathname.includes('/admin/') ? '/admin/jadwal-guru' : '/waka/jadwal-guru'} 
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 transition-all inline-block"
          >
            KEMBALI KE DAFTAR
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const parentPath = window.location.pathname.includes('/admin/') ? '/admin/jadwal-guru' : '/waka/jadwal-guru';

  return (
    <PageWrapper className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-8 font-sans">
      <CustomAlert
        isOpen={alertState.show}
        onClose={closeAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onConfirm={handleConfirmAction}
        confirmLabel="Ya"
        cancelLabel="Batal"
      />
      
      {/* ================= BREADCRUMB ================= */}
      <div className="flex items-center gap-3 text-sm font-bold text-gray-500 mb-8 overflow-hidden whitespace-nowrap">
        <Link to={parentPath} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest text-[11px] font-black">
          <FaChalkboardTeacher />
          <span>Jadwal Guru</span>
        </Link>
        <FaChevronRight className="text-[10px] text-gray-300" />
        <span className="text-gray-400 uppercase tracking-widest text-[11px] font-black truncate">{jadwal?.user?.name || 'Detail Guru'}</span>
      </div>

      {/* ================= HEADER CARD ================= */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-indigo-100">
            <FaChalkboardTeacher />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-none italic uppercase">Jadwal Mengajar</h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-3">{jadwal?.user?.name}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            to={parentPath}
            className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-black active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-gray-200"
          >
            <FaArrowLeft />
            <span>Kembali</span>
          </Link>
        </div>
      </div>

      {/* INFO GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoItem label="NIP" value={jadwal?.nip} color="emerald" />
        <InfoItem label="MATA PELAJARAN" value={jadwal?.subject} color="amber" />
        <InfoItem label="EMAIL" value={jadwal?.user?.email} color="violet" />
        <InfoItem label="NO. HP" value={jadwal?.user?.phone} color="orange" />
      </div>

      {/* ================= JADWAL CARD ================= */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-3 uppercase tracking-tight">
                <FaImage className="text-indigo-600" /> Jadwal Mengajar Guru
            </h3>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Preview Berkas</span>
        </div>

        <div className="p-10">
          {jadwal?.schedule_image_path ? (
            <div className="space-y-8">
              <div
                className="rounded-[2.5rem] overflow-hidden border-4 border-gray-50 shadow-inner bg-gray-50 group cursor-zoom-in relative"
                onClick={() => setShowFullscreen(true)}
              >
                <img
                  src={`${STORAGE_BASE_URL}/${jadwal.schedule_image_path}`}
                  alt={`Jadwal ${jadwal.user?.name}`}
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl">Klik Untuk Memperbesar</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDeleteImage}
                  disabled={loading}
                  className="flex-1 bg-red-50 text-red-600 border border-red-100 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all hover:bg-red-100 active:scale-95 flex items-center justify-center gap-3"
                >
                  <FaTrash />
                  <span>Hapus Jadwal</span>
                </button>

                <a
                  href={`${STORAGE_BASE_URL}/${jadwal.schedule_image_path}`}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-gray-900 text-white py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all hover:bg-black active:scale-95 flex items-center justify-center gap-3"
                >
                  <FaDownload />
                  <span>Download Berkas</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="py-32 text-center bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
              <div className="text-gray-200 mb-6 flex justify-center"><FaImage size={64} /></div>
              <h3 className="text-xl font-black text-gray-400 uppercase tracking-tight mb-2 italic">Belum Ada Jadwal</h3>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Berkas jadwal mengajar belum tersedia di database</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= FULLSCREEN ================= */}
      {showFullscreen && (
        <div
          className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8 transition-all animate-in fade-in duration-500"
          onClick={() => setShowFullscreen(false)}
        >
          <button className="absolute top-8 right-8 w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/10 shadow-2xl">
            <FaTimes size={24} />
          </button>
          <img
            src={`${STORAGE_BASE_URL}/${jadwal.schedule_image_path}`}
            alt="Jadwal Fullscreen"
            className="max-w-full max-h-full object-contain shadow-[0_0_100px_rgba(255,255,255,0.1)] rounded-lg animate-in zoom-in-95 duration-500"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </PageWrapper>
  );
}

function InfoItem({ label, value, color }) {
    const configs = {
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
        violet: "text-violet-600 bg-violet-50 border-violet-100",
        orange: "text-orange-600 bg-orange-50 border-orange-100",
    };
    const style = configs[color] || configs.emerald;

    return (
        <div className={`p-6 rounded-[2rem] border shadow-sm flex flex-col items-center justify-center group hover:scale-105 transition-all ${style}`}>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] mb-2 opacity-50">{label}</span>
            <span className="text-sm font-black tracking-tight text-center truncate w-full italic">{value || '-'}</span>
        </div>
    );
}

export default JadwalGuruShow;