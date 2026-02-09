import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaQrcode, 
  FaUsers, 
  FaHistory, 
  FaCalendarAlt, 
  FaClock, 
  FaBell,
  FaArrowRight,
  FaCheckCircle,
  FaLayerGroup,
  FaChevronRight
} from 'react-icons/fa';
import PageWrapper from '../../components/ui/PageWrapper';
import QRGenerateButton from '../../components/PengurusKelas/QRGenerateButton';
import attendanceService from '../../services/attendance';

// Force HMR fix for attendance service export
function DashboardKelas() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    className: '...',
    totalStudents: 0,
    activeSchedule: null,
    todayAttendance: 0
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await attendanceService.getStudentClassDashboard();
        const data = response.data;
        setDashboardData({
          className: data.class_name || 'XI RPL 1',
          totalStudents: data.total_students || 36,
          activeSchedule: data.active_schedule || { id: 1, subject: 'Pemrograman Web', time: '07:00 - 08:30' },
          todayAttendance: data.today_attendance_count || 32
        });
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <PageWrapper className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-10 font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-blue-200">
            <FaLayerGroup />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-none uppercase italic">Portal Pengurus</h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Kelas: {dashboardData.className}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100 shadow-inner">
          <div className="text-right">
            <div className="text-3xl font-black text-blue-600 font-mono tracking-tighter leading-none mb-1">
              {currentTime.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {currentTime.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
            </div>
          </div>
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm border border-gray-100"><FaClock /></div>
        </div>
      </div>

      {/* QUICK ACTIONS & STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* QR CODE CARD */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-800 rounded-[2.5rem] shadow-xl p-10 text-white relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-40 h-40 bg-white p-4 rounded-[2rem] shadow-2xl flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-500">
                    <FaQrcode size={80} className="text-indigo-900" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-3xl font-black mb-3 italic">Generasi Kode Presensi</h3>
                    <p className="text-indigo-100 font-medium mb-8 opacity-80 leading-relaxed">Gunakan kode ini untuk absensi mandiri siswa di dalam kelas.</p>
                    <QRGenerateButton />
                </div>
            </div>
            <FaQrcode size={200} className="absolute -right-10 -bottom-10 text-white/5 transform -rotate-12 group-hover:scale-110 transition-transform duration-1000" />
        </div>

        {/* STATS CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 flex flex-col justify-between hover:shadow-2xl transition-all">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Siswa Hadir</span>
                    <FaUsers className="text-emerald-500" />
                </div>
                <div>
                    <p className="text-5xl font-black text-gray-800 tracking-tighter leading-none mb-2">{dashboardData.todayAttendance}</p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(dashboardData.todayAttendance/dashboardData.totalStudents)*100}%` }}></div>
                        </div>
                        <span className="text-[10px] font-black text-gray-400">/{dashboardData.totalStudents}</span>
                    </div>
                </div>
            </div>
            <button onClick={() => navigate('/pengurus-kelas/presensi')} className="mt-8 w-full py-4 bg-gray-50 hover:bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                DETAIL PRESENSI <FaArrowRight size={10} />
            </button>
        </div>
      </div>

      {/* LOWER SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* ACTIVE SCHEDULE */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-10">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-xl"><FaBell className="animate-bounce" /></div>
                <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Sesi Aktif Sekarang</h3>
            </div>

            {dashboardData.activeSchedule ? (
                <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-white hover:shadow-xl transition-all">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <FaCalendarAlt size={24} />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-gray-800 leading-tight italic">{dashboardData.activeSchedule.subject}</h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                                <FaClock className="text-blue-400" /> {dashboardData.activeSchedule.time}
                            </p>
                        </div>
                    </div>
                    <div className="px-8 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100">SEDANG BERJALAN</div>
                </div>
            ) : (
                <div className="py-16 text-center bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">Tidak ada jadwal aktif saat ini</p>
                </div>
            )}
        </div>

        {/* QUICK NAVIGATION */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-2">Navigasi Cepat</h3>
            <NavBtn label="Input Manual" icon={<FaCheckCircle />} color="text-blue-600" bg="bg-blue-50" onClick={() => navigate('/pengurus-kelas/presensi')} />
            <NavBtn label="Riwayat Presensi" icon={<FaHistory />} color="text-indigo-600" bg="bg-indigo-50" onClick={() => navigate('/pengurus-kelas/riwayat')} />
        </div>

      </div>
    </PageWrapper>
  );
}

function NavBtn({ label, icon, color, bg, onClick }) {
    return (
        <button onClick={onClick} className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-[1.5rem] hover:shadow-xl hover:border-blue-200 transition-all group">
            <div className="flex items-center gap-4">
                <span className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>{icon}</span>
                <span className="font-black text-gray-700 text-sm uppercase tracking-tight italic">{label}</span>
            </div>
            <FaChevronRight size={10} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
        </button>
    );
}

export default DashboardKelas;