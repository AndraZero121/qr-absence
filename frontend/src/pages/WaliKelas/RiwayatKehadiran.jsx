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

  const fetchSummary = React.useCallback(async (cid) => {
    try {
      setLoading(true);
      const [summaryRes, absencesRes] = await Promise.all([
        apiClient.get(`/classes/${cid}/students/attendance-summary`, {
          params: { from: startDate, to: endDate }
        }),
        apiClient.get(`/classes/${cid}/students/absences`, {
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
  }, [startDate, endDate]);

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
  }, [fetchSummary]);

  const handleApplyPeriode = () => {
    if (classInfo.id) fetchSummary(classInfo.id);
    setIsPeriodeOpen(false);
  };

  const getCount = (totals, status) => totals[status] || 0;

  const handleExportExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Rekap Kehadiran');

      worksheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Nama Siswa', key: 'name', width: 30 },
        { header: 'NISN', key: 'nisn', width: 15 },
        { header: 'Hadir', key: 'present', width: 10 },
        { header: 'Izin', key: 'excused', width: 10 },
        { header: 'Sakit', key: 'sick', width: 10 },
        { header: 'Alpha', key: 'absent', width: 10 },
        { header: 'Telat', key: 'late', width: 10 },
      ];

      attendanceData.forEach((item, index) => {
        worksheet.addRow({
          no: index + 1,
          name: item.student.user?.name,
          nisn: item.student.nisn,
          present: getCount(item.totals, 'present'),
          excused: getCount(item.totals, 'excused') + getCount(item.totals, 'izin'),
          sick: getCount(item.totals, 'sick'),
          absent: getCount(item.totals, 'absent'),
          late: getCount(item.totals, 'late'),
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `Rekap_Kehadiran_${classInfo.name}_${startDate}_${endDate}.xlsx`);
    } catch (error) {
      console.error('Export Excel failed:', error);
    }
    setIsExportOpen(false);
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text(`Rekapitulasi Kehadiran Kelas: ${classInfo.name}`, 14, 15);
      doc.text(`Periode: ${startDate} s/d ${endDate}`, 14, 22);

      const tableData = attendanceData.map((item, index) => [
        index + 1,
        item.student.user?.name,
        getCount(item.totals, 'present'),
        getCount(item.totals, 'excused') + getCount(item.totals, 'izin'),
        getCount(item.totals, 'sick'),
        getCount(item.totals, 'absent'),
        getCount(item.totals, 'late'),
      ]);

      autoTable(doc, {
        startY: 30,
        head: [['No', 'Nama Siswa', 'H', 'I', 'S', 'A', 'T']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] }
      });

      doc.save(`Rekap_Kehadiran_${classInfo.name}.pdf`);
    } catch (error) {
      console.error('Export PDF failed:', error);
    }
    setIsExportOpen(false);
  };

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
                        <button 
                            onClick={handleExportExcel}
                            className="w-full text-left px-6 py-4 hover:bg-gray-50 rounded-2xl transition-colors font-bold text-gray-700 flex items-center gap-3 text-sm"
                        >
                            <span className="text-emerald-500"><FaFileExcel /></span> Excel Report
                        </button>
                        <button 
                            onClick={handleExportPDF}
                            className="w-full text-left px-6 py-4 hover:bg-gray-50 rounded-2xl transition-colors font-bold text-gray-700 flex items-center gap-3 text-sm border-t border-gray-50"
                        >
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
                      <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Dokumen</th>
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
                        <td className="px-6 py-5 text-center">
                          {log.attachments && log.attachments.length > 0 ? (
                            <button 
                              onClick={async () => {
                                try {
                                  const res = await apiClient.get(`/attendance/${log.id}/document`);
                                  if (res.data.url) window.open(res.data.url, '_blank');
                                } catch {
                                  alert('Gagal memuat dokumen');
                                }
                              }}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                              title="Lihat Surat"
                            >
                              <FaDownload size={14} />
                            </button>
                          ) : (
                            <span className="text-gray-200">-</span>
                          )}
                        </td>
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