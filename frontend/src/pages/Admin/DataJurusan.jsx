import React, { useState, useEffect } from 'react';
import { 
  FaShapes, 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrashAlt,
  FaArrowLeft
} from 'react-icons/fa';
import TambahJurusan from '../../components/Admin/TambahJurusan';
import CustomAlert from '../../components/Common/CustomAlert';
import PageWrapper from '../../components/ui/PageWrapper';

function DataJurusan() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [jurusans, setJurusans] = useState([
    { id: 1, kodeJurusan: 'RPL', namaJurusan: 'Rekayasa Perangkat Lunak' },
    { id: 2, kodeJurusan: 'TKJ', namaJurusan: 'Teknik Komputer dan Jaringan' },
    { id: 3, kodeJurusan: 'DKV', namaJurusan: 'Desain Komunikasi Visual' },
  ]);
  const [editData, setEditData] = useState(null);
  const [alertState, setAlertState] = useState({ show: false, type: 'confirm', title: '', message: '' });

  const handleAddJurusan = (formData) => {
    setJurusans([...jurusans, { ...formData, id: Date.now() }]);
    setIsModalOpen(false);
  };

  const handleEditJurusan = (formData) => {
    setJurusans(jurusans.map(j => j.id === editData.id ? { ...formData, id: j.id } : j));
    setEditData(null);
    setIsModalOpen(false);
  };

  const handleDeleteJurusan = (id) => {
    if (window.confirm('Hapus konsentrasi keahlian ini?')) {
      setJurusans(jurusans.filter(j => j.id !== id));
    }
  };

  const filteredJurusans = jurusans.filter(j => 
    j.namaJurusan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.kodeJurusan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageWrapper className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-2xl shadow-xl shadow-blue-200">
            <FaShapes />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-none">Konsentrasi Keahlian</h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-3">Data Kompetensi & Program Keahlian</p>
          </div>
        </div>

        <button onClick={() => { setEditData(null); setIsModalOpen(true); }} className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3">
            <FaPlus /> TAMBAHKAN
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        
        {/* FILTER BAR */}
        <div className="p-8 border-b border-gray-50 bg-gray-50/30">
            <div className="relative max-w-xl group">
                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Cari nama atau kode konsentrasi keahlian..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 shadow-sm"
                />
            </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-white border-b border-gray-100">
                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-24">No</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-48">Kode Identitas</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nama Konsentrasi Keahlian</th>
                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-40">Opsi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredJurusans.map((j, i) => (
                        <tr key={j.id} className="hover:bg-blue-50/30 transition-all duration-300 group">
                            <td className="px-10 py-6 text-sm font-black text-gray-300 text-center group-hover:text-blue-400 transition-colors">{i + 1}</td>
                            <td className="px-8 py-6">
                                <span className="px-5 py-2 bg-white border border-gray-200 text-blue-600 font-black text-xs uppercase tracking-widest rounded-xl shadow-sm group-hover:border-blue-200 transition-all">
                                    {j.kodeJurusan}
                                </span>
                            </td>
                            <td className="px-8 py-6">
                                <span className="text-sm font-black text-gray-800 group-hover:text-blue-700 transition-colors uppercase tracking-tight italic">
                                    {j.namaJurusan}
                                </span>
                            </td>
                            <td className="px-10 py-6">
                                <div className="flex justify-center gap-3">
                                    <button onClick={() => { setEditData(j); setIsModalOpen(true); }} className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90">
                                        <FaEdit size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteJurusan(j.id)} className="w-11 h-11 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90">
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
        {filteredJurusans.length === 0 && (
            <div className="py-24 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-200">
                    <FaShapes size={48} />
                </div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Data tidak ditemukan</p>
            </div>
        )}
      </div>

      <TambahJurusan isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditData(null); }} onSubmit={editData ? handleEditJurusan : handleAddJurusan} editData={editData} />
    </PageWrapper>
  );
}

export default DataJurusan;