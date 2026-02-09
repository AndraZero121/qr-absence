import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PageWrapper from '../../components/ui/PageWrapper';
import apiClient from '../../services/api';
import { STORAGE_BASE_URL } from '../../utils/constants';
import { FaEdit, FaArrowLeft, FaCloudUploadAlt, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';

function JadwalSiswaEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    grade: '',
    label: '',
    major_id: '',
    file: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [majors, setMajors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [classRes, majorsRes] = await Promise.all([
          apiClient.get(`/classes/${id}`),
          apiClient.get('/majors', { params: { per_page: -1 } })
        ]);

        const cls = classRes.data;
        setFormData({
          grade: cls.grade || '',
          label: cls.label || '',
          major_id: cls.major_id || '',
          file: null
        });
        setMajors(majorsRes.data || []);
        
        if (cls.schedule_image_path) {
          setPreviewImage(`${STORAGE_BASE_URL}/${cls.schedule_image_path}`);
        }
      } catch (error) {
        console.error("Error fetching class details for edit:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setErrors({ file: 'Format file harus JPG, PNG, atau GIF' });
      return;
    }

    if (file.size > maxSize) {
      setErrors({ file: 'Ukuran file maksimal 5MB' });
      return;
    }

    const reader = new FileReader();
    reader.onload = e => setPreviewImage(e.target.result);
    reader.readAsDataURL(file);

    setFormData(prev => ({ ...prev, file: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Update class info
      await apiClient.put(`/classes/${id}`, {
        grade: formData.grade,
        label: formData.label,
        major_id: formData.major_id
      });

      // 2. Upload image if selected
      if (formData.file) {
        const uploadData = new FormData();
        uploadData.append('file', formData.file);
        await apiClient.post(`/classes/${id}/schedule-image`, uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      const parentPath = window.location.pathname.includes('/admin/') ? '/admin/kelas' : '/waka/jadwal-siswa';
      navigate(parentPath);
    } catch (error) {
      console.error("Error saving class data:", error);
      const backendErrors = error.response?.data?.errors || {};
      setErrors(backendErrors);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      </PageWrapper>
    );
  }

  const parentPath = window.location.pathname.includes('/admin/') ? '/admin/kelas' : '/waka/jadwal-siswa';

  return (
    <PageWrapper className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-10 font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 flex flex-col sm:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-blue-100">
            <FaEdit />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-none italic uppercase">Ubah Jadwal</h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-3">Perbarui Jadwal Kelas Siswa</p>
          </div>
        </div>

        <Link to={parentPath} className="px-8 py-4 bg-gray-50 text-gray-400 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white hover:text-gray-900 active:scale-95 flex items-center gap-3 shadow-sm group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali
        </Link>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-10 lg:p-14 space-y-12">
          
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-start gap-4">
              <FaTimes className="text-red-500 mt-1" />
              <div>
                <h4 className="text-red-800 font-black text-xs uppercase tracking-widest mb-2">Terjadi Kesalahan</h4>
                <ul className="text-red-600/80 text-xs font-bold space-y-1">
                  {Object.entries(errors).map(([key, e], i) => (
                    <li key={i}>• {Array.isArray(e) ? e[0] : e}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-8">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8 pb-4 border-b border-gray-50">Informasi Kelas</h3>
              
              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tingkat (Grade)</label>
                <input
                  type="text"
                  name="grade"
                  placeholder="Contoh: X, XI, XII"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 shadow-inner"
                />
              </div>

              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Label / Nama</label>
                <input
                  type="text"
                  name="label"
                  placeholder="Contoh: RPL 1, TKJ 2"
                  value={formData.label}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 shadow-inner"
                />
              </div>

              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Konsentrasi Keahlian</label>
                <select
                  name="major_id"
                  value={formData.major_id}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 shadow-inner appearance-none cursor-pointer"
                >
                  <option value="">Pilih Jurusan...</option>
                  {majors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8 pb-4 border-b border-gray-50">Berkas Jadwal</h3>
              
              <div className="relative group">
                <input
                  type="file"
                  id="gambar_jadwal"
                  hidden
                  onChange={handleFileChange}
                />
                <label 
                    htmlFor="gambar_jadwal"
                    className="block w-full cursor-pointer group"
                >
                  {previewImage ? (
                    <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-gray-50 shadow-2xl transition-all group-hover:scale-[1.02]">
                        <img src={previewImage} alt="Preview" className="w-full h-[450px] object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-2xl border border-white/20">
                                <FaCloudUploadAlt />
                            </div>
                            <span className="text-white font-black text-xs uppercase tracking-widest">Ganti Berkas</span>
                        </div>
                    </div>
                  ) : (
                    <div className="w-full h-[450px] border-4 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 bg-gray-50 group-hover:bg-blue-50/30 group-hover:border-blue-200 transition-all shadow-inner">
                        <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center text-gray-300 text-3xl group-hover:text-blue-500 group-hover:scale-110 transition-all">
                            <FaCloudUploadAlt />
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 font-black text-xs uppercase tracking-widest mb-1">Unggah Jadwal</p>
                            <p className="text-gray-300 font-bold text-[10px]">JPG, PNG atau GIF (Maks. 5MB)</p>
                        </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-gray-50 flex flex-col sm:flex-row gap-4">
            <button 
                type="submit" 
                disabled={isSaving}
                className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all hover:bg-blue-700 active:scale-[0.98] shadow-2xl shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSaving ? (
                <><FaSpinnerIcon className="animate-spin" /> MENYIMPAN...</>
              ) : (
                <><FaSave /> SIMPAN PERUBAHAN</>
              )}
            </button>

            <Link 
                to={parentPath} 
                className="flex-1 bg-gray-50 text-gray-400 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-gray-800 text-center border border-gray-100 active:scale-[0.98]"
            >
              BATALKAN
            </Link>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}

const FaSpinnerIcon = ({ className }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default JadwalSiswaEdit;