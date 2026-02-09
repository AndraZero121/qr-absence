import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaFileExport, 
  FaHistory, 
  FaSearch, 
  FaEye, 
  FaEdit, 
  FaDownload,
  FaFilePdf,
  FaFileExcel,
  FaSpinner,
  FaArrowLeft,
  FaChevronDown,
  FaUserGraduate,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaProcedures,
  FaExclamationTriangle
} from 'react-icons/fa';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PageWrapper from '../../components/ui/PageWrapper';
import apiClient from '../../services/api';
import { getHomeroomDashboard } from '../../services/attendance';

const RiwayatKehadiran = () => {
  const [loading, setLoading] = useState(true);
  const [classInfo, setClassInfo] = useState({ id: null, name: '...' });
  const [attendanceData, setAttendanceData] = useState([]);
  const [absencesList, setAbsencesList] = useState([]);
  
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [isPeriodeOpen, setIsPeriodeOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchSummary = async (classId) => {
    try {
      setLoading(true);
      const [summaryRes, absencesRes] = await Promise.all([
        apiClient.get(`/classes/${classId}/students/attendance-summary`, {
          params: { from: startDate, to: endDate }
        }),
        apiClient.get(`/classes/${classId}/students/absences`, {
          params: { from: startDate, to: endDate }
        })
      ]);
      
      setAttendanceData(summaryRes.data || []);
      setAbsencesList(absencesRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const dashboard = await getHomeroomDashboard();
        const cid = dashboard.homeroom_class?.id || dashboard.class_id;
        if (cid) {
          setClassInfo({ id: cid, name: dashboard.homeroom_class?.name || dashboard.class_name || 'Kelas Saya' });
          fetchSummary(cid);
        }
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, []);

  const handleApplyPeriode = () => {
    if (classInfo.id) fetchSummary(classInfo.id);
    setIsPeriodeOpen(false);
  };

  const getCount = (totals, status) => totals[status] || 0;

  const openDetailModal = (studentId) => {
    const record = absencesList.find(a => String(a.student?.id) === String(studentId));
    setSelectedStudent(record);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status) => {
    const configs = {
      present: { label: 'Hadir', class: 'bg-emerald-100 text-emerald-700', icon: <FaCheckCircle /> },
      late: { label: 'Terlambat', class: 'bg-amber-100 text-amber-700', icon: <FaExclamationTriangle /> },
      sick: { label: 'Sakit', class: 'bg-violet-100 text-violet-700', icon: <FaProcedures /> },
      excused: { label: 'Izin', class: 'bg-blue-100 text-blue-700', icon: <FaInfoCircle /> },
      absent: { label: 'Alpha', class: 'bg-red-100 text-red-700', icon: <FaTimesCircle /> },
    };
    const config = configs[status] || configs.present;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${config.class}`}>
        {config.label}
      </span>
    );
  };

  return (
    <PageWrapper className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-10 font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-indigo-200">
            <FaHistory />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-none uppercase italic">Riwayat Binaan</h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-3 flex items-center gap-2">
                Kelas: {classInfo.name}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative">
                <button 
                    onClick={() => setIsPeriodeOpen(!isPeriodeOpen)}
                    className="px-8 py-4 bg-gray-50 border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-3 shadow-inner"
                >
                    <FaCalendarAlt className="text-indigo-500" />
                    PERIODE: {new Date(startDate).toLocaleDateString('id-ID', {month: 'short'})} - {new Date(endDate).toLocaleDateString('id-ID', {month: 'short'})}
                    <FaChevronDown size={10} />
                </button>

                {isPeriodeOpen && (
                    <div className="absolute top-full left-0 lg:right-0 lg:left-auto mt-3 bg-white rounded-[2rem] shadow-2xl border border-gray-100 z-50 p-8 w-80 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dari Tanggal</label>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-black text-xs uppercase tracking-widest" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sampai Tanggal</label>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-black text-xs uppercase tracking-widest" />
                            </div>
                            <button onClick={handleApplyPeriode} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">TERAPKAN</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="relative">
                <button onClick={() => setIsExportOpen(!isExportOpen)} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3">
                    <FaFileExport /> EKSPOR DATA
                </button>
                {isExportOpen && (
                    <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <button className="w-full text-left px-6 py-4 hover:bg-gray-50 rounded-2xl transition-colors font-bold text-gray-700 flex items-center gap-3 text-sm">
                            <span className="text-emerald-500"><FaFileExcel /></span> Excel Report
                        </button>
                        <button className="w-full text-left px-6 py-4 hover:bg-gray-50 rounded-2xl transition-colors font-bold text-gray-700 flex items-center gap-3 text-sm border-t border-gray-50">
                            <span className="text-red-500"><FaFilePdf /></span> PDF Summary
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* SUMMARY TABLE */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-3 uppercase tracking-tight">
                <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                Rekapitulasi Kehadiran Siswa
            </h3>
            <span className="text-[10px] font-black text-gray-400 bg-white px-4 py-1.5 rounded-full border border-gray-100 uppercase tracking-widest shadow-sm">
                Total: {attendanceData.length} Siswa
            </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-20">No</th>
                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Siswa</th>
                <th className="px-4 py-6 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] text-center">Hadir</th>
                <th className="px-4 py-6 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] text-center">Izin</th>
                <th className="px-4 py-6 text-[10px] font-black text-violet-500 uppercase tracking-[0.2em] text-center">Sakit</th>
                <th className="px-4 py-6 text-[10px] font-black text-red-500 uppercase tracking-[0.2em] text-center">Alpha</th>
                <th className="px-4 py-6 text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] text-center">Telat</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-32">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="8" className="text-center py-24"><FaSpinner className="animate-spin text-indigo-600 text-3xl mx-auto" /></td></tr>
              ) : attendanceData.map((item, i) => (
                <tr key={item.student.id} className="hover:bg-indigo-50/30 transition-all duration-300 group">
                  <td className="px-10 py-6 text-gray-300 font-black text-center">{i + 1}</td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                        <span className="font-black text-gray-800 uppercase tracking-tight group-hover:text-indigo-700 transition-colors">{item.student.user?.name || 'Siswa'}</span>
                        <span className="text-[10px] font-mono font-bold text-gray-400">NISN: {item.student.nisn}</span>
                    </div>
                  </td>
                  <td className="px-4 py-6 text-center font-black text-emerald-600">{getCount(item.totals, 'present')}</td>
                  <td className="px-4 py-6 text-center font-black text-blue-600">{getCount(item.totals, 'excused') + getCount(item.totals, 'izin')}</td>
                  <td className="px-4 py-6 text-center font-black text-violet-600">{getCount(item.totals, 'sick')}</td>
                  <td className="px-4 py-6 text-center font-black text-red-600">{getCount(item.totals, 'absent')}</td>
                  <td className="px-4 py-6 text-center font-black text-amber-600">{getCount(item.totals, 'late')}</td>
                  <td className="px-10 py-6">
                    <button 
                        onClick={() => openDetailModal(item.student.id)}
                        className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <FaEye /> LOG
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {showDetailModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-8 text-white relative">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner"><FaUserGraduate size={24} /></div>
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">{selectedStudent.student?.user?.name}</h2>
                    <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest mt-1 opacity-80">Log Ketidakhadiran & Catatan</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors text-4xl leading-none">&times;</button>
            </div>

            <div className="p-0">
              <div className="overflow-x-auto max-h-[50vh]">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">No</th>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Tanggal</th>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Mata Pelajaran</th>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {selectedStudent.items?.map((log, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-5 text-xs font-black text-gray-300">{idx + 1}.</td>
                        <td className="px-6 py-5 text-xs font-bold text-gray-600">{new Date(log.date).toLocaleDateString('id-ID', {day:'numeric', month: 'short'})}</td>
                        <td className="px-6 py-5">
                            <span className="text-xs font-black text-gray-700 uppercase">{log.schedule?.subject_name || log.subject_name || '-'}</span>
                        </td>
                        <td className="px-6 py-5 text-center">{getStatusBadge(log.status)}</td>
                        <td className="px-6 py-5 text-xs font-medium text-gray-500 italic">{log.reason || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button onClick={() => setShowDetailModal(false)} className="px-10 py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">TUTUP LOG</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default RiwayatKehadiran;