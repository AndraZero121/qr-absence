import React, { useState, useEffect } from "react";
import { 
  FaSchool, 
  FaArrowLeft, 
  FaCalendar, 
  FaEdit, 
  FaFileExport, 
  FaUser, 
  FaFilePdf, 
  FaFileExcel,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaProcedures,
  FaExclamationTriangle,
  FaChevronDown
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/ui/PageWrapper";
import apiClient from "../../services/api";

export default function KehadiranSiswaRekap() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedScheduleId] = useState('');
  const [recapData, setRecapData] = useState([]);
  const [showExport, setShowExport] = useState(false);
  
  const [tanggalMulai, setTanggalMulai] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [tanggalSampai, setTanggalSampai] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await apiClient.get('/classes', { params: { per_page: -1 } });
        setClasses(res.data || []);
        if (res.data?.length > 0) setSelectedScheduleId(res.data[0].id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClasses();
  }, []);

  const fetchRecap = async () => {
    if (!selectedClassId) return;
    try {
      setLoading(true);
      const res = await apiClient.get(`/classes/${selectedClassId}/students/attendance-summary`, {
        params: { from: tanggalMulai, to: tanggalSampai }
      });
      setRecapData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecap();
  }, [selectedClassId]);

  const handleApplyPeriode = () => {
    fetchRecap();
  };

  const getCount = (totals, status) => totals[status] || 0;

  return (
    <PageWrapper className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/waka/kehadiran-siswa')} className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-all shadow-sm border border-gray-100 group">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-none uppercase italic">Rekap Bulanan</h1>
            <div className="flex items-center gap-3 mt-3">
                <div className="relative">
                    <select 
                        value={selectedClassId} 
                        onChange={(e) => setSelectedScheduleId(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer shadow-sm"
                    >
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" size={8} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 italic">Akumulasi Kehadiran</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-inner w-full md:w-auto">
                <div className="flex items-center gap-2 px-3">
                    <FaCalendar className="text-indigo-400 text-xs" />
                    <input type="date" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} className="bg-transparent border-none text-[10px] font-black uppercase outline-none text-gray-700" />
                </div>
                <span className="text-gray-300 font-bold">/</span>
                <div className="flex items-center gap-2 px-3">
                    <FaCalendar className="text-indigo-400 text-xs" />
                    <input type="date" value={tanggalSampai} onChange={(e) => setTanggalSampai(e.target.value)} className="bg-transparent border-none text-[10px] font-black uppercase outline-none text-gray-700" />
                </div>
                <button onClick={handleApplyPeriode} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">OK</button>
            </div>

            <div className="relative w-full md:w-auto">
              <button
                className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3"
                onClick={() => setShowExport(!showExport)}
              >
                <FaFileExport /> EKSPOR
              </button>

              {showExport && (
                <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <button className="w-full text-left px-6 py-4 hover:bg-gray-50 rounded-2xl transition-colors font-bold text-gray-700 flex items-center gap-3 text-sm">
                    <span className="text-red-500"><FaFilePdf /></span> PDF Format
                  </button>
                  <button className="w-full text-left px-6 py-4 hover:bg-gray-50 rounded-2xl transition-colors font-bold text-gray-700 flex items-center gap-3 text-sm border-t border-gray-50">
                    <span className="text-emerald-500"><FaFileExcel /></span> Excel Format
                  </button>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-3 uppercase tracking-tight">
                <FaUser className="text-indigo-600" /> Rekapitulasi Data Siswa
            </h3>
            <span className="text-[10px] font-black text-gray-400 bg-white px-4 py-1.5 rounded-full border border-gray-100 uppercase tracking-widest shadow-sm">
                PERIODE: {new Date(tanggalMulai).toLocaleDateString('id-ID', {month: 'short'})} - {new Date(tanggalSampai).toLocaleDateString('id-ID', {month: 'short'})}
            </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-20">No</th>
                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Siswa</th>
                <th className="px-4 py-6 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] text-center">Hadir</th>
                <th className="px-4 py-6 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] text-center">Izin</th>
                <th className="px-4 py-6 text-[10px] font-black text-violet-500 uppercase tracking-[0.2em] text-center">Sakit</th>
                <th className="px-4 py-6 text-[10px] font-black text-red-500 uppercase tracking-[0.2em] text-center">Alpha</th>
                <th className="px-4 py-6 text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] text-center">Telat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-24"><FaSpinner className="animate-spin text-indigo-600 text-3xl mx-auto" /></td></tr>
              ) : recapData.map((item, i) => (
                <tr key={item.student.id} className="hover:bg-indigo-50/30 transition-all duration-300 group">
                  <td className="px-8 py-6 text-sm font-black text-gray-300 text-center">{i + 1}</td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-800 leading-tight group-hover:text-indigo-700 transition-colors uppercase tracking-tight">{item.student.user?.name || 'Siswa'}</span>
                        <span className="text-[9px] font-mono font-bold text-gray-400 mt-0.5 tracking-widest">NISN: {item.student.nisn}</span>
                    </div>
                  </td>
                  <td className="px-4 py-6 text-center font-black text-emerald-600">{getCount(item.totals, 'present')}</td>
                  <td className="px-4 py-6 text-center font-black text-blue-600">{getCount(item.totals, 'excused') + getCount(item.totals, 'izin')}</td>
                  <td className="px-4 py-6 text-center font-black text-violet-600">{getCount(item.totals, 'sick')}</td>
                  <td className="px-4 py-6 text-center font-black text-red-600">{getCount(item.totals, 'absent')}</td>
                  <td className="px-4 py-6 text-center font-black text-amber-600">{getCount(item.totals, 'late')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && recapData.length === 0 && (
            <div className="py-32 text-center bg-white/50 backdrop-blur shadow-inner border-t border-gray-50">
                <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Data rekap tidak ditemukan untuk periode ini</p>
            </div>
        )}
      </div>
    </PageWrapper>
  );
}