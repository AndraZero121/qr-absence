import React, { useState, useRef } from 'react';
import { 
  FaUserGraduate, 
  FaSearch, 
  FaPlus, 
  FaFileExport, 
  FaFileImport, 
  FaDownload, 
  FaEdit, 
  FaTrashAlt,
  FaChevronDown,
  FaFilter
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import TambahSiswa from '../../components/Admin/TambahSiswa';
import PageWrapper from '../../components/ui/PageWrapper';

function DataSiswa() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [students, setStudents] = useState([
    { id: 1, nama: 'Andi Pratama', nisn: '1234567890', jurusan: 'RPL', kelas: 'XI' },
    { id: 2, nama: 'Siti Aulia', nisn: '2345678901', jurusan: 'DKV', kelas: 'X' },
    { id: 3, nama: 'Budi Santoso', nisn: '3456789012', jurusan: 'TKJ', kelas: 'XII' },
  ]);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  
  const fileInputRef = useRef(null);

  const handleAddOrUpdate = (formData) => {
    if (editData) {
      setStudents(students.map((s) => s.id === editData.id ? { ...s, nama: formData.namaSiswa, nisn: formData.nisn, jurusan: formData.jurusan, kelas: formData.kelas } : s));
      setEditData(null);
    } else {
      setStudents([...students, { id: Date.now(), nama: formData.namaSiswa, nisn: formData.nisn, jurusan: formData.jurusan, kelas: formData.kelas }]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('Hapus data siswa ini?')) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students.map((s, i) => ({ 'No': i + 1, 'Nama': s.nama, 'NISN': s.nisn, 'Jurusan': s.jurusan, 'Kelas': s.kelas })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');
    XLSX.writeFile(workbook, `Data_Siswa.xlsx`);
    setShowExportMenu(false);
  };

  /* handleExportToPDF removed */

  const filteredStudents = students.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterJurusan === '' || s.jurusan === filterJurusan) &&
    (filterKelas === '' || s.kelas === filterKelas)
  );

  return (
    <PageWrapper className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-2xl shadow-xl shadow-blue-200">
            <FaUserGraduate />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-tight">Data Siswa</h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-1">Manajemen Database Peserta Didik</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 w-full lg:w-auto">
            <button onClick={() => { setEditData(null); setIsModalOpen(true); }} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3">
                <FaPlus /> TAMBAHKAN
            </button>
            <div className="relative">
                <button onClick={() => setShowExportMenu(!showExportMenu)} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3">
                    <FaFileExport /> EKSPOR <FaChevronDown size={10} />
                </button>
                {showExportMenu && (
                    <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <button onClick={handleExportToExcel} className="w-full text-left px-6 py-4 hover:bg-gray-50 rounded-2xl transition-colors font-bold text-gray-700 flex items-center gap-3 text-sm">
                            <span className="text-emerald-500"><FaFileExport /></span> Excel (.xlsx)
                        </button>
                        {/* PDF Export removed */}
                    </div>
                )}
            </div>
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
                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Cari nama atau NISN siswa..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700"
                />
            </div>
            <div className="flex gap-4">
                <div className="relative">
                    <select 
                        value={filterJurusan} 
                        onChange={(e) => setFilterJurusan(e.target.value)}
                        className="appearance-none pl-6 pr-12 py-4 bg-white border border-gray-200 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-gray-600 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                    >
                        <option value="">Semua Jurusan</option>
                        <option value="RPL">RPL</option>
                        <option value="TKJ">TKJ</option>
                        <option value="DKV">DKV</option>
                    </select>
                    <FaFilter className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={10} />
                </div>
                <div className="relative">
                    <select 
                        value={filterKelas} 
                        onChange={(e) => setFilterKelas(e.target.value)}
                        className="appearance-none pl-6 pr-12 py-4 bg-white border border-gray-200 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-gray-600 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                    >
                        <option value="">Semua Kelas</option>
                        <option value="X">X</option>
                        <option value="XI">XI</option>
                        <option value="XII">XII</option>
                    </select>
                    <FaChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={10} />
                </div>
            </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-white border-b border-gray-100">
                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-24">No</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Peserta Didik</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Identitas (NISN)</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Konsentrasi Keahlian</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kelas</th>
                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredStudents.map((s, i) => (
                        <tr key={s.id} className="hover:bg-blue-50/30 transition-all duration-300 group">
                            <td className="px-10 py-6 text-sm font-black text-gray-300 text-center group-hover:text-blue-400 transition-colors">{i + 1}</td>
                            <td className="px-8 py-6">
                                <span className="text-sm font-black text-gray-800 group-hover:text-blue-700 transition-colors uppercase tracking-tight">{s.nama}</span>
                            </td>
                            <td className="px-8 py-6 font-mono text-xs font-bold text-gray-500 tracking-wider bg-gray-50/50 rounded-xl my-2 inline-block border border-gray-100">
                                {s.nisn}
                            </td>
                            <td className="px-8 py-6">
                                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                    {s.jurusan}
                                </span>
                            </td>
                            <td className="px-8 py-6">
                                <span className="text-sm font-black text-gray-700">Tingkat {s.kelas}</span>
                            </td>
                            <td className="px-10 py-6">
                                <div className="flex justify-center gap-3">
                                    <button onClick={() => { setEditData(s); setIsModalOpen(true); }} className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm group/btn active:scale-90">
                                        <FaEdit size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteStudent(s.id)} className="w-11 h-11 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm group/btn active:scale-90">
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
        {filteredStudents.length === 0 && (
            <div className="py-24 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-200">
                    <FaUserGraduate size={48} />
                </div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Data siswa tidak ditemukan</p>
            </div>
        )}
      </div>

      <TambahSiswa isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditData(null); }} onSubmit={handleAddOrUpdate} editData={editData} />
    </PageWrapper>
  );
}

export default DataSiswa;