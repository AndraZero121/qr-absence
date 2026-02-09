import React, { useState, useEffect } from "react";
import { 
  FaSchool, 
  FaSearch, 
  FaEye, 
  FaCalendarAlt, 
  FaEdit,
  FaChevronRight,
  FaSpinner
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/ui/PageWrapper";
import apiClient from "../../services/api";

export default function JadwalSiswaIndex() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/classes', { params: { per_page: -1 } });
        setClasses(res.data || []);
      } catch (err) {
        console.error("Error fetching classes for schedule:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${c.grade} ${c.label}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageWrapper className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-10 font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-blue-200">
            <FaCalendarAlt />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-none italic uppercase">Jadwal Belajar</h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-3">Manajemen Agenda Pembelajaran Siswa</p>
          </div>
        </div>

        <div className="relative group w-full lg:w-[400px]">
            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
                type="text" 
                placeholder="Cari kelas (contoh: X RPL)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 shadow-inner"
            />
        </div>
      </div>

      {/* CLASSES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {loading ? (
            Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-[2.5rem] animate-pulse"></div>
            ))
        ) : filteredClasses.map((item) => (
          <div key={item.id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all group relative">
            <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                        <FaSchool />
                    </div>
                    <span className="px-4 py-1.5 bg-gray-50 text-gray-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-gray-100 shadow-sm">
                        {item.major?.name || 'UMUM'}
                    </span>
                </div>

                <div className="space-y-2 mb-10">
                    <h3 className="text-3xl font-black text-gray-800 leading-tight group-hover:text-blue-700 transition-colors italic uppercase tracking-tight">{item.name}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.students_count || 0} Siswa Terdaftar</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => navigate(`/waka/jadwal-siswa/${item.id}`)}
                        className="flex-1 bg-gray-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-black active:scale-95 flex items-center justify-center gap-2"
                    >
                        <FaEye /> LIHAT
                    </button>
                    <button
                        onClick={() => navigate(`/waka/jadwal-siswa/${item.id}/edit`)}
                        className="flex-1 bg-blue-50 text-blue-700 border border-blue-100 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-blue-100 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <FaEdit /> ATUR ULANG
                    </button>
                </div>
            </div>
            
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[5rem] -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        ))}

        {!loading && filteredClasses.length === 0 && (
            <div className="col-span-full py-32 text-center bg-white/50 backdrop-blur rounded-[3rem] border-2 border-dashed border-gray-200 shadow-inner">
                <div className="text-gray-200 mb-4 flex justify-center"><FaSchool size={64} /></div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Kelas tidak ditemukan</p>
            </div>
        )}
      </div>
    </PageWrapper>
  );
}