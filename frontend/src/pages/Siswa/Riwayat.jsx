import React, { useState, useEffect } from 'react';
import { 
  FaHistory, 
  FaCalendarAlt, 
  FaSearch, 
  FaFilter, 
  FaChevronDown,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaProcedures,
  FaExclamationTriangle,
  FaClock,
  FaFileAlt
} from 'react-icons/fa';
import PageWrapper from '../../components/ui/PageWrapper';
import { getMyAttendanceHistory } from '../../services/attendance';

function Riwayat() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await getMyAttendanceHistory();
        setHistory(response.data || []);
      } catch (error) {
        console.error("Error fetching history:", error);
        // Fallback for UI testing
        setHistory([
            { id: 1, date: '2025-02-08', subject_name: 'Pemrograman Web', start_time: '07:00', status: 'present' },
            { id: 2, date: '2025-02-07', subject_name: 'Basis Data', start_time: '09:00', status: 'late', check_in_time: '09:15' },
            { id: 3, date: '2025-02-06', subject_name: 'Matematika', start_time: '07:00', status: 'sick', reason: 'Demam tinggi' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusBadge = (status) => {
    const configs = {
      present: { label: 'Hadir', class: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <FaCheckCircle /> },
      late: { label: 'Terlambat', class: 'bg-amber-100 text-amber-700 border-amber-200', icon: <FaExclamationTriangle /> },
      sick: { label: 'Sakit', class: 'bg-violet-100 text-violet-700 border-violet-200', icon: <FaProcedures /> },
      excused: { label: 'Izin', class: 'bg-blue-100 text-blue-700 border-blue-200', icon: <FaInfoCircle /> },
      absent: { label: 'Alpha', class: 'bg-red-100 text-red-700 border-red-200', icon: <FaTimesCircle /> },
    };
    const config = configs[status] || configs.absent;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.class}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const filteredHistory = history.filter(item => {
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchSearch = item.subject_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <PageWrapper className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-10 font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-indigo-200">
            <FaHistory />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-none uppercase italic">Riwayat Kehadiran</h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-3">Log aktivitas presensi digital Anda</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-inner">
            <div className="px-6 py-3 bg-white text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm border border-gray-100 flex items-center gap-2">
                <FaCalendarAlt size={12} /> FEBRUARI 2025
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* SIDEBAR FILTER */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-8 h-fit lg:sticky lg:top-28">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cari Mata Pelajaran</label>
                    <div className="relative group">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Ketik nama mapel..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status Kehadiran</label>
                    <div className="grid grid-cols-1 gap-2">
                        {['all', 'present', 'late', 'sick', 'excused', 'absent'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-left transition-all
                                    ${filterStatus === status 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-[1.02]' 
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'}`}
                            >
                                {status === 'all' ? 'SEMUA DATA' : status === 'excused' ? 'IZIN' : status === 'present' ? 'HADIR' : status.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 text-center">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Record</p>
                    <p className="text-3xl font-black text-indigo-700">{filteredHistory.length}</p>
                </div>
            </div>
        </div>

        {/* LOG LIST AREA */}
        <div className="xl:col-span-3 space-y-4">
            {filteredHistory.map((item) => (
                <div key={item.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl transition-all group overflow-hidden relative">
                    <div className="flex items-center gap-6 w-full md:w-auto relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex flex-col items-center justify-center text-center shadow-inner group-hover:scale-110 transition-transform">
                            <span className="text-[10px] font-black text-gray-400 uppercase leading-none">{new Date(item.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                            <span className="text-2xl font-black text-gray-800 leading-none">{new Date(item.date).getDate()}</span>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xl font-black text-gray-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{item.subject_name}</h4>
                            <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><FaClock className="text-indigo-300" /> {item.start_time} WIB</span>
                                {item.check_in_time && (
                                    <>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="text-emerald-500">Scan: {item.check_in_time}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto relative z-10">
                        {item.reason && (
                            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 italic text-xs text-gray-500 max-w-[200px] truncate">
                                <FaFileAlt /> {item.reason}
                            </div>
                        )}
                        <div className="ml-auto md:ml-0">{getStatusBadge(item.status)}</div>
                    </div>
                    
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[6rem] -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
            ))}

            {filteredHistory.length === 0 && !loading && (
                <div className="py-32 text-center bg-white/50 backdrop-blur rounded-[3rem] border-2 border-dashed border-gray-200 shadow-inner">
                    <div className="text-gray-200 mb-4 flex justify-center"><FaFileAlt size={60} /></div>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Belum ada riwayat aktivitas</p>
                </div>
            )}

            {loading && (
                <div className="space-y-4">
                    {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-[2rem] animate-pulse"></div>)}
                </div>
            )}
        </div>

      </div>
    </PageWrapper>
  );
}

export default Riwayat;