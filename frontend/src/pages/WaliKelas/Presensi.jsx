import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSave, 
  FaCalendarAlt, 
  FaClock, 
  FaBook, 
  FaEdit, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaInfoCircle, 
  FaProcedures, 
  FaExclamationTriangle,
  FaUserGraduate,
  FaFileAlt
} from 'react-icons/fa';
import CustomAlert from '../../components/Common/CustomAlert';
import apiClient from '../../services/api';
import { getAttendanceBySchedule, createManualAttendance } from '../../services/attendance';
import PageWrapper from '../../components/ui/PageWrapper';

const Presensi = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const { mataPelajaran = '', jamKe = '', kelas = '', waktu = '', tanggal = '', scheduleId, classId } = state;
  
  const [siswaList, setSiswaList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alertState, setAlertState] = useState({ show: false, type: 'info', title: '', message: '' });
  const [showKeteranganModal, setShowKeteranganModal] = useState(false);
  const [currentSiswaIndex, setCurrentSiswaIndex] = useState(null);
  const [keteranganForm, setKeteranganForm] = useState({ alasan: '' });

  const showAlert = (type, title, message) => setAlertState({ show: true, type, title, message });
  const closeAlert = () => setAlertState(prev => ({ ...prev, show: false }));

  useEffect(() => {
    const fetchData = async () => {
      if (!scheduleId || !classId) return;
      try {
        setIsLoading(true);
        const studentsRes = await apiClient.get('students', { params: { class_id: classId } });
        const studentsData = studentsRes.data.data || studentsRes.data;
        let existingRecords = [];
        try {
          const attendanceRes = await getAttendanceBySchedule(scheduleId);
          existingRecords = Array.isArray(attendanceRes) ? attendanceRes : [];
        } catch (e) { console.warn(e); }

        const mapped = studentsData.map((s, index) => {
          const record = existingRecords.find(r => String(r.student_id) === String(s.id));
          let status = null;
          if (record) {
            const map = { present: 'Hadir', sick: 'Sakit', excused: 'Izin', izin: 'Izin', absent: 'Alpha', late: 'Terlambat', pulang: 'Pulang' };
            status = map[record.status] || record.status;
          }
          return {
            id: s.id, no: index + 1, nisn: s.nisn, nama: s.user?.name || s.name || 'Siswa',
            status: status, keterangan: record?.reason || '',
          };
        });
        setSiswaList(mapped);
      } catch (error) { showAlert('error', 'Gagal', 'Gagal memuat data siswa'); } finally { setIsLoading(false); }
    };
    fetchData();
  }, [scheduleId, classId]);

  const handleStatusChange = (index, value) => {
    const updated = [...siswaList];
    updated[index].status = value;
    if (!['Izin', 'Sakit', 'Pulang', 'Terlambat'].includes(value)) updated[index].keterangan = '';
    setSiswaList(updated);
  };

  const handleOpenKeterangan = (index) => {
    setCurrentSiswaIndex(index);
    setKeteranganForm({ alasan: siswaList[index].keterangan || '' });
    setShowKeteranganModal(true);
  };

  const handleSaveKeterangan = () => {
    const updated = [...siswaList];
    updated[currentSiswaIndex].keterangan = keteranganForm.alasan;
    setSiswaList(updated);
    setShowKeteranganModal(false);
  };

  const handleSimpan = async () => {
    if (!scheduleId) return showAlert('error', 'Error', 'Jadwal tidak ditemukan');
    const filled = siswaList.filter(s => s.status);
    if (filled.length === 0) return showAlert('warning', 'Peringatan', 'Mohon isi presensi siswa');

    setIsLoading(true);
    try {
      const currentDateStr = new Date().toISOString().split('T')[0];
      const promises = filled.map(s => {
        const map = { Hadir: 'present', Sakit: 'sick', Izin: 'excused', Alpha: 'absent', Terlambat: 'late', Pulang: 'pulang' };
        return createManualAttendance({
          attendee_type: 'student', student_id: s.id, schedule_id: scheduleId,
          status: map[s.status] || 'present', date: currentDateStr, reason: s.keterangan || null
        });
      });
      await Promise.all(promises);
      showAlert('success', 'Berhasil', 'Presensi berhasil disimpan');
      setTimeout(() => navigate('/walikelas/dashboard'), 1500);
    } catch (error) { showAlert('error', 'Gagal', 'Terjadi kesalahan saat menyimpan data'); } finally { setIsLoading(false); }
  };

  if (!scheduleId) {
    return (
      <PageWrapper className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-12 max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><FaExclamationTriangle size={40} /></div>
          <h2 className="text-2xl font-black text-gray-800 mb-3 uppercase tracking-tight">Akses Dibatasi</h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed italic">Silakan akses halaman ini melalui tombol presensi di dashboard utama Anda.</p>
          <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 transition-all active:scale-95" onClick={() => navigate('/walikelas/dashboard')}>KEMBALI KE DASHBOARD</button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-10 font-sans">
      <CustomAlert isOpen={alertState.show} onClose={closeAlert} title={alertState.title} message={alertState.message} type={alertState.type} />

      {/* HEADER SECTION */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/walikelas/dashboard')} className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-all shadow-sm border border-gray-100 group">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-none italic uppercase">{mataPelajaran}</h1>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">Ke-{jamKe}</span>
            </div>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Kelas: {kelas} <span className="mx-2 opacity-20">|</span> {waktu}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-3xl border border-gray-100 shadow-inner">
            <div className="flex items-center gap-3 px-6 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
                <FaCalendarAlt className="text-indigo-500" />
                <span className="text-xs font-black text-gray-700 uppercase tracking-widest">{tanggal}</span>
            </div>
            <button onClick={handleSimpan} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3">
                <FaSave /> SIMPAN DATA
            </button>
        </div>
      </div>

      {/* TABLE CONTENT */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-3 uppercase tracking-tight">
                <FaUserGraduate className="text-indigo-600" /> Lembar Presensi Siswa
            </h3>
            <div className="flex gap-4">
                <StatBrief label="TOTAL" value={siswaList.length} color="gray" />
                <StatBrief label="HADIR" value={siswaList.filter(s => s.status === 'Hadir').length} color="emerald" />
                <StatBrief label="ALPHA" value={siswaList.filter(s => s.status === 'Alpha').length} color="red" />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-24">No</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Siswa / Identitas</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Status Kehadiran</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Keterangan</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-28">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {siswaList.map((s, i) => (
                <tr key={s.id} className={`hover:bg-blue-50/30 transition-all duration-300 group ${s.status ? 'bg-indigo-50/10' : ''}`}>
                  <td className="px-10 py-6 text-sm font-black text-gray-300 text-center group-hover:text-indigo-400">{i + 1}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-800 group-hover:text-indigo-700 transition-colors uppercase tracking-tight leading-tight">{s.nama}</span>
                        <span className="text-[9px] font-mono font-bold text-gray-400 tracking-wider">NISN: {s.nisn}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2">
                        {['Hadir', 'Sakit', 'Izin', 'Alpha', 'Terlambat', 'Pulang'].map(opt => (
                          <label key={opt} className={`relative flex items-center justify-center cursor-pointer group/opt transition-all active:scale-90
                            ${s.status === opt ? 'scale-110 z-10' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}>
                            <input type="radio" name={`status-${s.id}`} checked={s.status === opt} onChange={() => handleStatusChange(i, opt)} className="sr-only" />
                            <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all shadow-sm
                                ${opt === 'Hadir' ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-100' : 
                                  opt === 'Sakit' ? 'bg-violet-500 border-violet-500 text-white shadow-violet-100' :
                                  opt === 'Alpha' ? 'bg-red-500 border-red-500 text-white shadow-red-100' :
                                  'bg-indigo-600 border-indigo-600 text-white shadow-indigo-100'}`}>
                                {opt}
                            </div>
                          </label>
                        ))}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="max-w-[200px] truncate text-[11px] font-bold text-gray-500 italic">
                        {s.keterangan || <span className="opacity-20 text-[9px] not-italic uppercase tracking-widest">Tidak ada keterangan</span>}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <button onClick={() => handleOpenKeterangan(i)} className="w-11 h-11 mx-auto rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-all shadow-sm border border-gray-100 active:scale-90 group/note">
                        <FaEdit size={14} className="group-hover:rotate-12 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KETERANGAN MODAL */}
      {showKeteranganModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => setShowKeteranganModal(false)}>
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-10 text-white relative">
              <h2 className="text-2xl font-black tracking-tight uppercase italic flex items-center gap-3">
                <FaFileAlt /> Keterangan
              </h2>
              <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-80">{siswaList[currentSiswaIndex]?.nama}</p>
              <button className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors text-4xl leading-none font-light" onClick={() => setShowKeteranganModal(false)}>&times;</button>
            </div>
            <div className="p-10 space-y-8">
                <textarea
                    value={keteranganForm.alasan}
                    onChange={(e) => setKeteranganForm({ ...keteranganForm, alasan: e.target.value })}
                    placeholder="Contoh: Sakit demam, Izin ada acara keluarga penting..."
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl p-6 text-sm font-bold text-gray-700 outline-none focus:border-indigo-500 focus:bg-white transition-all h-40 resize-none shadow-inner"
                />
                <div className="flex gap-4">
                    <button className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all" onClick={() => setShowKeteranganModal(false)}>BATAL</button>
                    <button className="flex-[2] py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 transition-all active:scale-95" onClick={handleSaveKeterangan}>SIMPAN INFO</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

const StatBrief = ({ label, value, color }) => (
    <div className={`px-4 py-1.5 rounded-xl border flex items-center gap-2 shadow-sm
        ${color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
          color === 'red' ? 'bg-red-50 text-red-700 border-red-100' : 
          'bg-white text-gray-400 border-gray-100'}`}>
        <span className="text-[9px] font-black uppercase tracking-widest">{label}:</span>
        <span className="text-xs font-black">{value}</span>
    </div>
);

export default Presensi;