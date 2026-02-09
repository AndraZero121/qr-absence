import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaSpinner, 
  FaCalendarAlt, 
  FaChevronRight, 
  FaUserGraduate, 
  FaArrowLeft, 
  FaImage, 
  FaTrash, 
  FaDownload, 
  FaTimes,
  FaChalkboardTeacher
} from 'react-icons/fa';
import CustomAlert from '../../components/Common/CustomAlert';
import PageWrapper from '../../components/ui/PageWrapper';
import apiClient from '../../services/api';
import { STORAGE_BASE_URL } from '../../utils/constants';

function JadwalSiswaShow() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jadwal, setJadwal] = useState(null);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchClass = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/classes/${id}`);
        setJadwal(response.data);
      } catch (error) {
        console.error("Error fetching class details:", error);
        showAlert('error', 'Gagal', 'Data kelas tidak ditemukan.');
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [id]);

  const handleConfirmAction = async () => {
    if (alertState.action === 'delete_schedule') {
      try {
        setLoading(true);
        await apiClient.delete(`/classes/${id}/schedule-image`);
        
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
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      </PageWrapper>
    );
  }

  const parentPath = window.location.pathname.includes('/admin/') ? '/admin/kelas' : '/waka/jadwal-siswa';

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
        <Link to={parentPath} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest text-[11px] font-black">
          <FaCalendarAlt />
          <span>Jadwal Siswa</span>
        </Link>
        <FaChevronRight className="text-[10px] text-gray-300" />
        <span className="text-gray-400 uppercase tracking-widest text-[11px] font-black truncate">{jadwal?.name || 'Detail Kelas'}</span>
      </div>

      {/* ================= HEADER CARD ================= */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-blue-100">
            <FaUserGraduate />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-none italic uppercase">Jadwal Kelas</h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-3">{jadwal?.major?.name || 'Umum'}</p>
          </div>
        </div>

        <Link
          to={parentPath}
          className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-black active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-gray-200"
        >
          <FaArrowLeft />
          <span>Kembali</span>
        </Link>
      </div>

      {/* INFO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-8 rounded-[2rem] border border-blue-100 bg-blue-50/50 shadow-sm flex flex-col items-center justify-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Wali Kelas</span>
            <span className="text-lg font-black tracking-tight text-blue-900 italic">{jadwal?.homeroom_teacher?.user?.name || '-'}</span>
        </div>
        <div className="p-8 rounded-[2rem] border border-indigo-100 bg-indigo-50/50 shadow-sm flex flex-col items-center justify-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Kelas</span>
            <span className="text-lg font-black tracking-tight text-indigo-900 italic">{jadwal?.name}</span>
        </div>
      </div>

      {/* ================= JADWAL CARD ================= */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-3 uppercase tracking-tight">
                <FaImage className="text-blue-600" /> Jadwal Pembelajaran Siswa
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
                  alt={`Jadwal ${jadwal.name}`}
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full font-black text-[10px] text-gray-900 uppercase tracking-widest shadow-2xl">Klik Untuk Memperbesar</div>
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
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Berkas jadwal kelas ini belum tersedia</p>
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

export default JadwalSiswaShow;