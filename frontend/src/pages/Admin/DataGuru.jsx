import React, { useState, useRef, useEffect } from 'react';
import { 
  FaChalkboardTeacher, 
  FaSearch, 
  FaPlus, 
  FaFileExport, 
  FaFileImport, 
  FaEdit, 
  FaTrashAlt,
  FaChevronDown,
  FaUserTie,
  FaFilter,
  FaCalendarAlt,
  FaEye
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import PageWrapper from '../../components/ui/PageWrapper';
import apiClient from '../../services/api';

function DataGuru() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', password: '', nip: '', phone: '', contact: '', subject: '', homeroom_class_id: ''
  });

  const [classes, setClasses] = useState([]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/teachers', { params: { per_page: -1 } });
      const data = res.data?.data || res.data || [];
      setTeachers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await apiClient.get('/classes', { params: { per_page: -1 } });
      setClasses(res.data || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
  }, []);

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.user?.name || '',
      username: teacher.user?.username || '',
      email: teacher.user?.email || '',
      password: '', // Don't show password
      nip: teacher.nip || '',
      phone: teacher.user?.phone || '',
      contact: teacher.user?.contact || '',
      subject: teacher.subject || '',
      homeroom_class_id: teacher.homeroom_class_id || ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
    setFormData({
      name: '', username: '', email: '', password: '', nip: '', phone: '', contact: '', subject: '', homeroom_class_id: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await apiClient.put(`/teachers/${editingTeacher.id}`, formData);
      } else {
        await apiClient.post('/teachers', formData);
      }
      handleCloseModal();
      fetchTeachers();
    } catch (err) {
      console.error("Error saving teacher:", err);
      alert(err.response?.data?.message || "Terjadi kesalahan saat menyimpan data.");
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (window.confirm('Hapus data guru ini?')) {
      try {
        await apiClient.delete(`/teachers/${id}`);
        fetchTeachers();
      } catch (err) {
        console.error("Error deleting teacher:", err);
      }
    }
  };

  const filteredTeachers = teachers.filter(t => 
    (t.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     t.nip?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const fileInputRef = useRef(null);

  return (
    <PageWrapper className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center text-2xl shadow-xl shadow-indigo-200">
            <FaChalkboardTeacher />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-tight">Data Tenaga Pendidik</h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-1">Sistem Administrasi Guru & Staf</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 w-full lg:w-auto">
            <button onClick={() => { setEditingTeacher(null); setIsModalOpen(true); }} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3">
                <FaPlus /> TAMBAHKAN
            </button>
            <button onClick={() => setShowExportMenu(!showExportMenu)} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3">
                <FaFileExport /> EKSPOR
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-100 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3">
                <FaFileImport /> IMPOR
            </button>
            <input type="file" ref={fileInputRef} className="hidden" />
        </div>
      </div>

      {/* FILTER & TABLE SECTION */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        
        {/* FILTER BAR */}
        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row gap-6">
            <div className="relative flex-1 group">
                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Cari nama atau NIP guru..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700"
                />
            </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-white border-b border-gray-100">
                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-24">No</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-32">Identitas (NIP)</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nama Tenaga Pendidik</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Jabatan</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Detail Penugasan</th>
                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredTeachers.map((t, i) => (
                        <tr key={t.id} className="hover:bg-indigo-50/30 transition-all duration-300 group">
                            <td className="px-10 py-6 text-sm font-black text-gray-300 text-center group-hover:text-indigo-400 transition-colors">{i + 1}</td>
                            <td className="px-8 py-6 font-mono text-xs font-bold text-indigo-600 bg-indigo-50/50 rounded-xl my-2 inline-block border border-indigo-100 uppercase tracking-widest">{t.nip || '-'}</td>
                            <td className="px-8 py-6">
                                <span className="text-sm font-black text-gray-800 group-hover:text-indigo-700 transition-colors uppercase tracking-tight">{t.user?.name}</span>
                            </td>
                            <td className="px-8 py-6">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    t.homeroom_class_id ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                                }`}>
                                    {t.homeroom_class_id ? 'Wali Kelas' : 'Guru Mapel'}
                                </span>
                            </td>
                            <td className="px-8 py-6 text-sm font-bold text-gray-500">{t.subject || t.homeroom_class?.name || '-'}</td>
                            <td className="px-10 py-6">
                                <div className="flex justify-center gap-3">
                                    <button 
                                        onClick={() => navigate(`/admin/jadwal-guru/${t.id}`)} 
                                        className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm group/btn active:scale-90"
                                        title="Lihat Jadwal"
                                    >
                                        <FaCalendarAlt size={16} />
                                    </button>
                                    <button onClick={() => handleEditTeacher(t)} className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all shadow-sm group/btn active:scale-90" title="Edit Data">
                                        <FaEdit size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteTeacher(t.id)} className="w-11 h-11 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm group/btn active:scale-90" title="Hapus Guru">
                                        <FaTrashAlt size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* EMPTY STATE */}
        {filteredTeachers.length === 0 && !loading && (
            <div className="py-24 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-200">
                    <FaChalkboardTeacher size={48} />
                </div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Data guru tidak ditemukan</p>
            </div>
        )}
        {loading && (
            <div className="py-24 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Memuat Data...</p>
            </div>
        )}
      </div>

      {/* MINIMALIST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white relative">
              <h2 className="text-2xl font-black tracking-tight">{editingTeacher ? 'Ubah Data Guru' : 'Tambah Guru Baru'}</h2>
              <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest mt-1 opacity-80">Lengkapi formulir di bawah ini</p>
              <button className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors text-4xl leading-none font-light" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <input type="text" placeholder="Nama Lengkap Guru" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold" required />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                    <input type="text" placeholder="Username login" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold" required />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                    <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                    <input type="password" placeholder={editingTeacher ? "Kosongkan jika tidak diubah" : "Password"} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold" required={!editingTeacher} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">NIP</label>
                    <input type="text" placeholder="NIP" value={formData.nip} onChange={(e) => setFormData({...formData, nip: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold" required />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Telepon/WhatsApp</label>
                    <input type="text" placeholder="08..." value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mata Pelajaran Utama</label>
                    <input type="text" placeholder="Contoh: Matematika" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Penugasan Wali Kelas</label>
                    <select value={formData.homeroom_class_id} onChange={(e) => setFormData({...formData, homeroom_class_id: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold appearance-none cursor-pointer">
                        <option value="">Bukan Wali Kelas</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Batal</button>
                <button type="submit" className="flex-[2] px-4 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

export default DataGuru;