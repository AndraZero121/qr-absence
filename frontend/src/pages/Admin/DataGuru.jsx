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
  FaFilter
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PageWrapper from '../../components/ui/PageWrapper';

function DataGuru() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [teachers, setTeachers] = useState([
    { id: 1, kodeGuru: 'GR001', namaGuru: 'Budi Santoso', jabatan: 'Guru', mataPelajaran: 'Informatika' },
    { id: 2, kodeGuru: 'GR002', namaGuru: 'Siti Aminah', jabatan: 'Waka', bidangWaka: 'Kesiswaan' },
  ]);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJabatan, setFilterJabatan] = useState('');
  
  const [formData, setFormData] = useState({
    kodeGuru: '', namaGuru: '', jabatan: 'Guru', mataPelajaran: '', bidangWaka: '', konsentrasiKeahlian: '', kelas: '', jurusan: ''
  });

  const fileInputRef = useRef(null);

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({ ...teacher });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
    setFormData({ kodeGuru: '', namaGuru: '', jabatan: 'Guru', mataPelajaran: '', bidangWaka: '', konsentrasiKeahlian: '', kelas: '', jurusan: '' });
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (editingTeacher) {
      setTeachers(teachers.map(t => t.id === editingTeacher.id ? { ...formData, id: t.id } : t));
    } else {
      setTeachers([...teachers, { ...formData, id: Date.now() }]);
    }
    handleCloseModal();
  };

  const handleDeleteTeacher = (id) => {
    if (window.confirm('Hapus data guru ini?')) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.namaGuru.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterJabatan === '' || t.jabatan === filterJabatan)
  );

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
                    placeholder="Cari nama atau kode guru..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700"
                />
            </div>
            <div className="relative">
                <select 
                    value={filterJabatan} 
                    onChange={(e) => setFilterJabatan(e.target.value)}
                    className="appearance-none pl-6 pr-12 py-4 bg-white border border-gray-200 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-gray-600 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer min-w-[200px]"
                >
                    <option value="">Semua Jabatan</option>
                    <option value="Guru">Guru</option>
                    <option value="Waka">Waka</option>
                    <option value="Kapro">Kapro</option>
                    <option value="Wali Kelas">Wali Kelas</option>
                </select>
                <FaFilter className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={10} />
            </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-white border-b border-gray-100">
                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-24">No</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-32">Kode</th>
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
                            <td className="px-8 py-6 font-mono text-xs font-bold text-indigo-600 bg-indigo-50/50 rounded-xl my-2 inline-block border border-indigo-100 uppercase tracking-widest">{t.kodeGuru}</td>
                            <td className="px-8 py-6">
                                <span className="text-sm font-black text-gray-800 group-hover:text-indigo-700 transition-colors uppercase tracking-tight">{t.namaGuru}</span>
                            </td>
                            <td className="px-8 py-6">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    t.jabatan === 'Guru' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    t.jabatan === 'Waka' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                    'bg-emerald-50 text-emerald-700 border-emerald-100'
                                }`}>
                                    {t.jabatan}
                                </span>
                            </td>
                            <td className="px-8 py-6 text-sm font-bold text-gray-500">{t.mataPelajaran || t.bidangWaka || t.konsentrasiKeahlian || '-'}</td>
                            <td className="px-10 py-6">
                                <div className="flex justify-center gap-3">
                                    <button onClick={() => handleEditTeacher(t)} className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm group/btn active:scale-90">
                                        <FaEdit size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteTeacher(t.id)} className="w-11 h-11 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm group/btn active:scale-90">
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
        {filteredTeachers.length === 0 && (
            <div className="py-24 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-200">
                    <FaChalkboardTeacher size={48} />
                </div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Data guru tidak ditemukan</p>
            </div>
        )}
      </div>

      {/* MINIMALIST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white relative">
              <h2 className="text-2xl font-black tracking-tight">{editingTeacher ? 'Ubah Data Guru' : 'Tambah Guru Baru'}</h2>
              <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest mt-1 opacity-80">Lengkapi formulir di bawah ini</p>
              <button className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors text-3xl leading-none font-light" onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleAddTeacher} className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kode & Nama Lengkap</label>
                    <div className="flex gap-3">
                        <input type="text" placeholder="KODE" value={formData.kodeGuru} onChange={(e) => setFormData({...formData, kodeGuru: e.target.value})} className="w-24 px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-black text-center uppercase" required />
                        <input type="text" placeholder="Nama Lengkap Guru" value={formData.namaGuru} onChange={(e) => setFormData({...formData, namaGuru: e.target.value})} className="flex-1 px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold" required />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Jabatan Fungsional</label>
                    <select value={formData.jabatan} onChange={(e) => setFormData({...formData, jabatan: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-black uppercase text-xs tracking-widest cursor-pointer appearance-none">
                        <option value="Guru">Guru</option>
                        <option value="Waka">Waka</option>
                        <option value="Kapro">Kapro</option>
                        <option value="Wali Kelas">Wali Kelas</option>
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