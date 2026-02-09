import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaChevronDown, 
  FaDoorOpen, 
  FaEdit, 
  FaSave, 
  FaSpinner, 
  FaTimes, 
  FaUser, 
  FaEye,
  FaCalendarAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaProcedures,
  FaTimesCircle,
  FaExclamationTriangle,
  FaBook
} from 'react-icons/fa';
import PageWrapper from '../../components/ui/PageWrapper';
import apiClient from '../../services/api';

export default function KehadiranSiswaShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedulesAttendance, setSchedulesAttendance] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [classRes, attendanceRes, studentsRes] = await Promise.all([
          apiClient.get(`/classes/${id}`),
          apiClient.get(`/classes/${id}/attendance`, { params: { date } }),
          apiClient.get(`/students`, { params: { class_id: id, per_page: -1 } })
        ]);

        setClassData(classRes.data);
        setSchedulesAttendance(attendanceRes.data.items || []);
        setAllStudents(studentsRes.data.data || studentsRes.data || []);
      } catch (error) {
        console.error("Error fetching class attendance details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, date]);

  // Aggregate student status across schedules for the day
  // If 'all' schedules selected, we show a summary or the latest known status
  const getStudentStatus = (studentId) => {
    let status = 'none';
    let reason = '';

    const relevantItems = selectedScheduleId === 'all' 
      ? schedulesAttendance 
      : schedulesAttendance.filter(item => String(item.schedule.id) === String(selectedScheduleId));

    for (const item of relevantItems) {
      const att = item.attendances.find(a => String(a.student_id) === String(studentId));
      if (att) {
        // Priority: late > present, any negative status > none
        if (att.status !== 'present' || status === 'none') {
            status = att.status;
            reason = att.reason;
        }
      }
    }

    return { status, reason };
  };

  const getStatusBadge = (status) => {
    const configs = {
      present: { label: 'Hadir', class: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <FaCheckCircle /> },
      late: { label: 'Terlambat', class: 'bg-amber-100 text-amber-700 border-amber-200', icon: <FaExclamationTriangle /> },
      sick: { label: 'Sakit', class: 'bg-violet-100 text-violet-700 border-violet-200', icon: <FaProcedures /> },
      excused: { label: 'Izin', class: 'bg-blue-100 text-blue-700 border-blue-200', icon: <FaInfoCircle /> },
      absent: { label: 'Alpha', class: 'bg-red-100 text-red-700 border-red-200', icon: <FaTimesCircle /> },
      none: { label: 'Belum Absen', class: 'bg-gray-100 text-gray-400 border-gray-200', icon: <FaSpinner /> }
    };
    const config = configs[status] || configs.none;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.class}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const stats = allStudents.reduce((acc, s) => {
    const { status } = getStudentStatus(s.id);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  if (loading && !classData) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-8 font-sans">
      
      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/waka/kehadiran-siswa')} className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-all shadow-sm border border-gray-100 group">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-tight uppercase italic">{classData?.name}</h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-1">Wali Kelas: {classData?.homeroom_teacher?.user?.name || '-'}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative group">
                <FaCalendarAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500" />
                <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 outline-none font-black text-xs uppercase tracking-widest text-gray-700 transition-all shadow-inner"
                />
            </div>
            <div className="relative">
                <select 
                    value={selectedScheduleId} 
                    onChange={(e) => setSelectedScheduleId(e.target.value)}
                    className="appearance-none pl-6 pr-12 py-4 bg-white border border-gray-200 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-gray-600 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer min-w-[200px] shadow-sm"
                >
                    <option value="all">Ringkasan Harian</option>
                    {schedulesAttendance.map(item => (
                        <option key={item.schedule.id} value={item.schedule.id}>{item.schedule.subject_name}</option>
                    ))}
                </select>
                <FaChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={10} />
            </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatItem label="TOTAL" value={allStudents.length} color="gray" />
        <StatItem label="HADIR" value={stats.present || 0} color="emerald" />
        <StatItem label="TERLAMBAT" value={stats.late || 0} color="amber" />
        <StatItem label="IZIN" value={(stats.excused || 0) + (stats.izin || 0)} color="blue" />
        <StatItem label="SAKIT" value={stats.sick || 0} color="violet" />
        <StatItem label="ALPHA" value={stats.absent || 0} color="red" />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-3">
                <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                Daftar Kehadiran Peserta Didik
            </h3>
            <Link to="/waka/kehadiran-siswa/rekap" className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:-translate-y-0.5 transition-all">
                LIHAT REKAP BULANAN
            </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center w-24">No</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Peserta Didik</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Identitas (NISN)</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Status Presensi</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allStudents.map((s, i) => {
                const { status, reason } = getStudentStatus(s.id);
                return (
                  <tr key={s.id} className="hover:bg-indigo-50/30 transition-all duration-300 group">
                    <td className="px-10 py-6 text-sm font-black text-gray-300 text-center group-hover:text-indigo-400 transition-colors">{i + 1}</td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-gray-800 group-hover:text-indigo-700 transition-colors uppercase tracking-tight italic">{s.user?.name || s.name}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 bg-gray-50 border border-gray-100 font-mono text-xs font-bold text-gray-500 rounded-xl">
                        {s.nisn}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {getStatusBadge(status)}
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-500 italic max-w-xs truncate">
                      {reason || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {allStudents.length === 0 && !loading && (
            <div className="py-24 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-200">
                    <FaUser size={48} />
                </div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Siswa tidak ditemukan</p>
            </div>
        )}
      </div>
    </PageWrapper>
  );
}

function StatItem({ label, value, color }) {
    const configs = {
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        violet: "text-violet-600 bg-violet-50 border-violet-100",
        red: "text-red-600 bg-red-50 border-red-100",
        gray: "text-gray-600 bg-gray-50 border-gray-100",
    };
    const style = configs[color] || configs.gray;

    return (
        <div className={`p-5 rounded-3xl border shadow-sm flex flex-col items-center justify-center group hover:scale-105 transition-all ${style}`}>
            <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">{label}</span>
            <span className="text-2xl font-black tracking-tighter">{value}</span>
        </div>
    );
}