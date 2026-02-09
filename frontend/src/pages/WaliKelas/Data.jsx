import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSchool, 
  FaFilter, 
  FaFileAlt, 
  FaHistory, 
  FaEye, 
  FaEdit, 
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaProcedures,
  FaExclamationTriangle,
  FaUserGraduate
} from 'react-icons/fa';
import InputSuratModal from '../../components/WaliKelas/InputDispensasiModal';
import { getHomeroomDashboard, getClassAttendanceByDate } from '../../services/attendance';
import PageWrapper from '../../components/ui/PageWrapper';

const Data = () => {
  const navigate = useNavigate();
  const [editingIndex, setEditingIndex] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [classInfo, setClassInfo] = useState({ id: null, name: 'Loading...' });
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); 
  const [selectedMapel, setSelectedMapel] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [daftarMapel, setDaftarMapel] = useState([]);
  const [previewModal, setPreviewModal] = useState({
    open: false, file: null, type: null, studentName: '', fileName: '',
    nisn: '', status: '', keterangan: '', isTerlambat: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardData = await getHomeroomDashboard();
        setClassInfo({
          id: dashboardData.class_id,
          name: dashboardData.class_name || dashboardData.className || 'Kelas Saya'
        });

        if (dashboardData.class_id) {
          const today = new Date().toISOString().split('T')[0];
          const attendanceData = await getClassAttendanceByDate(dashboardData.class_id, today);
          const records = Array.isArray(attendanceData) ? attendanceData : (attendanceData.data || []);

          const mapped = records.map(r => ({
            id: r.id, 
            studentId: r.student_id,
            nisn: r.student_nisn || r.user?.nisn || '-',
            nama: r.student_name || r.user?.name || 'Siswa',
            status: mapStatus(r.status), 
            keterangan: r.reason || '',
            jamMasuk: r.check_in_time || null,
            suratFile: r.attachment_url || null,
            suratFileName: r.attachment_name || null,
            wasTerlambat: r.status === 'late',
            mapel: r.subject_name || r.schedule?.subject?.name || '-',
            tanggal: r.date,
            rawStatus: r.status
          }));

          setStudentList(mapped);
          const mapels = [...new Set(mapped.map(s => s.mapel).filter(m => m !== '-'))];
          setDaftarMapel(mapels);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback demo data
        setClassInfo({ id: 1, name: "XI RPL 1" });
        setStudentList([
            { id: 1, nisn: '12345678', nama: 'Andi Pratama', status: 'Hadir', keterangan: '', mapel: 'Matematika' },
            { id: 2, nisn: '87654321', nama: 'Siti Aulia', status: 'Izin', keterangan: 'Acara Keluarga', mapel: 'Matematika', suratFile: '#' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mapStatus = (backendStatus) => {
    const map = { 'present': 'Hadir', 'sick': 'Sakit', 'excused': 'Izin', 'izin': 'Izin', 'absent': 'Alpha', 'late': 'Terlambat', 'pulang': 'Pulang' };
    return map[backendStatus] || backendStatus;
  };

  const filteredStudents = filterType === 'mapel' && selectedMapel 
    ? studentList.filter(s => s.mapel === selectedMapel) 
    : studentList;

  const stats = {
    Hadir: filteredStudents.filter((s) => s.status === 'Hadir').length,
    Izin: filteredStudents.filter((s) => s.status === 'Izin').length,
    Sakit: filteredStudents.filter((s) => s.status === 'Sakit').length,
    Alpha: filteredStudents.filter((s) => s.status === 'Alpha').length,
    Terlambat: filteredStudents.filter((s) => s.status === 'Terlambat' || s.wasTerlambat).length,
  };

  const handleStatusChange = (index, value) => {
    const updated = [...studentList];
    const sItem = filteredStudents[index];
    const actualIndex = studentList.findIndex(s => s.id === sItem.id); 
    if (actualIndex !== -1) {
      updated[actualIndex].status = value;
      setStudentList(updated);
    }
    setEditingIndex(null);
  };

  const getStatusBadge = (status, wasTerlambat) => {
    const configs = {
      'Hadir': { class: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <FaCheckCircle /> },
      'Izin': { class: 'bg-blue-100 text-blue-700 border-blue-200', icon: <FaInfoCircle /> },
      'Sakit': { class: 'bg-violet-100 text-violet-700 border-violet-200', icon: <FaProcedures /> },
      'Alpha': { class: 'bg-red-100 text-red-700 border-red-200', icon: <FaTimesCircle /> },
      'Terlambat': { class: 'bg-amber-100 text-amber-700 border-amber-200', icon: <FaExclamationTriangle /> },
      'Pulang': { class: 'bg-orange-100 text-orange-700 border-orange-200', icon: <FaArrowLeft /> },
    };
    const config = configs[status] || configs['Alpha'];
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${config.class}`}>
        {config.icon} {status} {wasTerlambat && status === 'Hadir' && <span title="Terlambat">⏱</span>}
      </span>
    );
  };

  return (
    <PageWrapper className="container mx-auto p-4 md:p-8 space-y-8 max-w-7xl font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 md:p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-3xl shadow-inner ring-4 ring-white">
            <FaSchool />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-tight">Kehadiran Siswa</h1>
            <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-black uppercase tracking-widest border border-gray-200">
                    {classInfo.name}
                </span>
                <span className="text-xs font-bold text-gray-400 italic">Data Real-time</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-sm border
                    ${filterType !== 'all' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
            >
                <FaFilter /> FILTER {filterType !== 'all' && '●'}
            </button>

            {showFilterDropdown && (
                <div className="absolute top-48 lg:top-40 right-10 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Opsi Penyaringan</h4>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors group">
                            <input type="radio" value="all" checked={filterType === 'all'} onChange={() => { setFilterType('all'); setSelectedMapel(''); }} className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-700">Semua Data Hari Ini</span>
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 px-3 cursor-pointer">
                                <input type="radio" value="mapel" checked={filterType === 'mapel'} onChange={() => setFilterType('mapel')} className="w-4 h-4 text-indigo-600" />
                                <span className="text-sm font-bold text-gray-700">Per Mata Pelajaran</span>
                            </label>
                            <select
                                value={selectedMapel}
                                onChange={(e) => { setSelectedMapel(e.target.value); setFilterType('mapel'); }}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                            >
                                <option value="">Pilih Mapel...</option>
                                {daftarMapel.map(mapel => <option key={mapel} value={mapel}>{mapel}</option>)}
                            </select>
                        </div>
                        <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-100" onClick={() => setShowFilterDropdown(false)}>Terapkan</button>
                    </div>
                </div>
            )}

            <button onClick={() => navigate('/walikelas/riwayatkehadiran')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all shadow-sm">
                <FaHistory /> RIWAYAT
            </button>
            <button onClick={() => setOpenModal(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest">
                <FaFileAlt /> UNGGAH SURAT
            </button>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(stats).map(([key, val]) => (
            <div key={key} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center group hover:border-indigo-200 transition-all">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">{key}</span>
                <span className="text-2xl font-black text-gray-800 tracking-tighter">{val}</span>
            </div>
        ))}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-3">
                <FaUserGraduate className="text-indigo-600" /> Daftar Kehadiran Binaan
            </h3>
            <span className="text-[10px] font-black text-gray-400 bg-white px-4 py-1.5 rounded-full border border-gray-100 uppercase tracking-widest shadow-sm">
                Total: {filteredStudents.length} Siswa
            </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center w-20">No</th>
                <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Siswa</th>
                <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest w-40">Status</th>
                <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Keterangan / Alasan</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div></td></tr>
              ) : filteredStudents.map((s, i) => (
                <tr key={i} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-8 py-6 text-sm font-black text-gray-300 text-center">{i + 1}</td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-800 leading-tight group-hover:text-indigo-700 transition-colors">{s.nama}</span>
                        <span className="text-[10px] font-mono text-gray-400 mt-0.5">NISN: {s.nisn}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    {editingIndex === i ? (
                      <select
                        value={s.status}
                        onChange={(e) => handleStatusChange(i, e.target.value)}
                        onBlur={() => setEditingIndex(null)}
                        autoFocus
                        className="w-full bg-white border-2 border-indigo-500 rounded-xl px-2 py-1.5 text-xs font-black outline-none shadow-lg shadow-indigo-100"
                      >
                        {['Hadir', 'Izin', 'Sakit', 'Alpha', 'Pulang', 'Terlambat'].map(opt => <option key={val} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {getStatusBadge(s.status, s.wasTerlambat)}
                        {s.status !== 'Hadir' && !s.suratFile && <span className="text-[9px] font-black text-red-400 uppercase tracking-tighter px-1">⚠️ Surat Belum Ada</span>}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-gray-500 italic max-w-xs truncate">
                    {s.keterangan || '-'}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => setEditingIndex(i)} className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        <FaEdit size={14} />
                      </button>
                      {s.suratFile && (
                        <button onClick={() => handleViewSurat(s)} className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                          <FaEye size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InputSuratModal isOpen={openModal} onClose={() => setOpenModal(false)} onSuratUploaded={() => setOpenModal(false)} studentList={studentList} />

      {previewModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setPreviewModal(prev => ({ ...prev, open: false }))}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-black text-gray-800 tracking-tight">{previewModal.status === 'Izin' ? 'Surat Izin' : 'Surat Keterangan'}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{previewModal.studentName} • {previewModal.fileName}</p>
              </div>
              <button className="text-gray-400 hover:text-red-500 text-4xl leading-none transition-colors" onClick={() => setPreviewModal(prev => ({ ...prev, open: false }))}>&times;</button>
            </div>
            <div className="p-10 bg-gray-100 flex justify-center max-h-[60vh] overflow-auto">
              {previewModal.type === 'image' ? (
                <img src={previewModal.file} alt="Preview" className="max-w-full h-auto rounded-2xl shadow-2xl border-8 border-white" />
              ) : (
                <div className="flex flex-col items-center py-20 text-gray-400">
                    <FaFileAlt size={64} className="mb-4 opacity-20" />
                    <p className="font-bold">PDF Preview tidak tersedia langsung.</p>
                </div>
              )}
            </div>
            <div className="p-8 flex justify-end gap-4">
              <button className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-sm transition-all" onClick={() => setPreviewModal(prev => ({ ...prev, open: false }))}>TUTUP</button>
              <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 flex items-center gap-2 hover:-translate-y-1 transition-all" onClick={() => {}}>
                <FaDownload /> DOWNLOAD
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default Data;