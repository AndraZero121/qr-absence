import React, { useState, useEffect } from 'react';
import { 
  FaLayerGroup, 
  FaPlus, 
  FaFilter, 
  FaEdit, 
  FaTrashAlt, 
  FaImage, 
  FaCloudUploadAlt,
  FaChevronRight,
  FaArrowLeft
} from 'react-icons/fa';
import TambahKelas from '../../components/Admin/TambahKelas';
import CustomAlert from '../../components/Common/CustomAlert';
import apiClient from '../../services/api';
import DummyJadwal from '../../assets/images/DummyJadwal.png';
import PageWrapper from '../../components/ui/PageWrapper';

function DataKelas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchKelas, setSearchKelas] = useState('');
  const [searchJurusan, setSearchJurusan] = useState('');
  const [kelasData, setKelasData] = useState([
    { id: 1, namaKelas: 'XI RPL 1', jurusan: 'RPL', waliKelas: 'Budi Santoso' },
    { id: 2, namaKelas: 'XI RPL 2', jurusan: 'RPL', waliKelas: 'Siti Aminah' },
  ]);
  const [alertState, setAlertState] = useState({ show: false, type: 'confirm', title: '', message: '' });
  const [viewJadwalClass, setViewJadwalClass] = useState(null);

  const handleAddKelas = (formData) => {
    setKelasData([...kelasData, { ...formData, id: Date.now() }]);
    setIsModalOpen(false);
  };

  const handleEditKelas = (formData) => {
    setKelasData(kelasData.map(k => k.id === editData.id ? { ...formData, id: k.id } : k));
    setEditData(null);
    setIsModalOpen(false);
  };

  const handleDeleteKelas = (id) => {
    if (window.confirm('Hapus rombel ini?')) {
      setKelasData(kelasData.filter(k => k.id !== id));
    }
  };

  const filteredKelas = kelasData.filter(k => {
    const matchKelas = searchKelas === '' || k.namaKelas.startsWith(searchKelas);
    const matchJurusan = searchJurusan === '' || k.jurusan === searchJurusan;
    return matchKelas && matchJurusan;
  });

  return (
    <PageWrapper className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-2xl shadow-xl shadow-blue-200">
            <FaLayerGroup />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-tight">Data Rombel</h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-1">Manajemen Kelas & Penjadwalan</p>
          </div>
        </div>

        <button onClick={() => { setEditData(null); setIsModalOpen(true); }} className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3">
            <FaPlus /> TAMBAHKAN KELAS
        </button>
      </div>

      {/* FILTER & CONTENT GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
        
        {/* SIDEBAR FILTER */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-8">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <FaFilter className="text-blue-500" /> Filter Data
            </h3>
            
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tingkat Kelas</label>
                    <select value={searchKelas} onChange={(e) => setSearchKelas(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-gray-700 appearance-none cursor-pointer">
                        <option value="">Semua Tingkat</option>
                        <option value="X">Kelas X</option>
                        <option value="XI">Kelas XI</option>
                        <option value="XII">Kelas XII</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Konsentrasi Keahlian</label>
                    <select value={searchJurusan} onChange={(e) => setSearchJurusan(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-gray-700 appearance-none cursor-pointer">
                        <option value="">Semua Jurusan</option>
                        <option value="RPL">RPL</option>
                        <option value="TKJ">TKJ</option>
                        <option value="DKV">DKV</option>
                    </select>
                </div>
            </div>

            <div className="pt-4">
                <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Ditemukan</p>
                    <p className="text-3xl font-black text-blue-700">{filteredKelas.length} <span className="text-sm font-bold opacity-60">Kelas</span></p>
                </div>
            </div>
        </div>

        {/* CLASS GRID */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredKelas.map((k) => (
                <div key={k.id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all group">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                                <FaLayerGroup />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditData(k); setIsModalOpen(true); }} className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90">
                                    <FaEdit size={14} />
                                </button>
                                <button onClick={() => handleDeleteKelas(k.id)} className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90">
                                    <FaTrashAlt size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1 mb-8">
                            <h3 className="text-2xl font-black text-gray-800 leading-tight group-hover:text-blue-700 transition-colors uppercase tracking-tight">{k.namaKelas}</h3>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 italic">
                                <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                                Wali Kelas: {k.waliKelas}
                            </p>
                        </div>

                        <button onClick={() => setViewJadwalClass(k)} className="w-full py-4 bg-gray-50 group-hover:bg-indigo-600 group-hover:text-white text-gray-600 rounded-[1.25rem] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                            <FaImage /> LIHAT JADWAL BELAJAR <FaChevronRight size={10} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            ))}

            {filteredKelas.length === 0 && (
                <div className="col-span-full py-32 text-center bg-white/50 backdrop-blur rounded-[3rem] border-2 border-dashed border-gray-200">
                    <div className="text-gray-300 mb-4 flex justify-center"><FaLayerGroup size={60} /></div>
                    <p className="text-gray-500 font-black uppercase tracking-widest text-sm italic">Kelas tidak ditemukan</p>
                </div>
            )}
        </div>
      </div>

      {/* JADWAL MODAL */}
      {viewJadwalClass && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => setViewJadwalClass(null)}>
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight leading-none uppercase italic">Jadwal Kelas {viewJadwalClass.namaKelas}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Visual Penjadwalan Mingguan</p>
              </div>
              <button className="text-gray-400 hover:text-red-500 text-4xl leading-none transition-colors" onClick={() => setViewJadwalClass(null)}>&times;</button>
            </div>
            <div className="p-10 bg-gray-100 flex flex-col items-center gap-10 max-h-[75vh] overflow-auto">
              <img
                src={viewJadwalClass.jadwalImage ? `http://127.0.0.1:8000/storage/${viewJadwalClass.jadwalImage}` : DummyJadwal}
                alt="Jadwal"
                className="max-w-full h-auto rounded-[2rem] shadow-2xl border-[12px] border-white"
                onError={(e) => { e.target.src = DummyJadwal; }}
              />
              
              <div className="w-full max-w-md pt-8 border-t border-gray-200 flex flex-col gap-4">
                <input type="file" accept="image/*" className="hidden" id="jadwal-upload" />
                <label htmlFor="jadwal-upload" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest cursor-pointer transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3">
                  <FaCloudUploadAlt size={20} /> UNGGAH JADWAL BARU
                </label>
                <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">Format: JPG, PNG • Max: 5MB</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <TambahKelas isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditData(null); }} onSubmit={editData ? handleEditKelas : handleAddKelas} editData={editData} />
    </PageWrapper>
  );
}

export default DataKelas;