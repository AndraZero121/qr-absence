import React, { useState, useEffect } from 'react';
import { 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaLayerGroup, 
  FaShapes, 
  FaBuilding, 
  FaClock, 
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaProcedures,
  FaTimesCircle,
  FaChartBar
} from 'react-icons/fa';
import PageWrapper from '../../components/ui/PageWrapper';
import { useFetchData } from '../../hooks/useData';
import { API_ENDPOINTS } from '../../utils/constants';

function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Sat Set Fetching
  const { data: statsData, isLoading: loadingStats } = useFetchData(
    'adminStats', 
    API_ENDPOINTS.ADMIN_SUMMARY,
    {}, 
    { staleTime: 60000 * 5 } 
  );

  const { data: attData, isLoading: loadingAtt } = useFetchData(
    'attendanceSummary', 
    'attendance/summary', 
    {}, 
    { staleTime: 30000 }
  );

  const stats = {
    totalMurid: statsData?.students_count || 0,
    totalGuru: statsData?.teachers_count || 0,
    totalKelas: statsData?.classes_count || 0,
    totalJurusan: statsData?.majors_count || 0,
    totalRuang: statsData?.rooms_count || 0
  };

  const attendanceData = {
    tepatWaktu: attData?.present || 0,
    terlambat: attData?.late || 0,
    izin: (attData?.izin || 0) + (attData?.excused || 0),
    sakit: attData?.sick || 0,
    alpha: attData?.absent || 0
  };

  const loading = loadingStats || loadingAtt;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <PageWrapper className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-10">
      
      {/* WELCOME BANNER */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-white/50 p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group transition-all hover:shadow-2xl">
        <div className="z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight leading-tight">Statistik Sekolah</h1>
          <p className="text-lg text-gray-500 font-medium mt-3 max-w-lg">Selamat datang di pusat kendali administrasi digital SMKN 2 Singosari.</p>
          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
             <div className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-200">Aktif: Semester Genap</div>
             <div className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-2xl text-sm font-black uppercase tracking-widest border border-gray-200">TP 2025/2026</div>
          </div>
        </div>

        <div className="z-10 bg-gray-50 p-8 rounded-[2rem] border border-gray-100 shadow-inner flex flex-col items-center md:items-end min-w-[280px]">
          <div className="text-5xl font-black text-blue-600 font-mono tracking-tighter mb-2">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <FaCalendarAlt className="text-blue-400" />
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-blue-100 transition-colors duration-700"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-50 rounded-full blur-2xl -ml-10 -mb-10 group-hover:bg-indigo-100 transition-colors duration-700"></div>
      </div>

      {/* QUICK STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Siswa" value={stats.totalMurid} loading={loading} icon={<FaUserGraduate />} color="blue" />
        <StatCard title="Total Guru" value={stats.totalGuru} loading={loading} icon={<FaChalkboardTeacher />} color="orange" />
        <StatCard title="Total Rombel" value={stats.totalKelas} loading={loading} icon={<FaLayerGroup />} color="cyan" />
        <StatCard title="Konsentrasi" value={stats.totalJurusan} loading={loading} icon={<FaShapes />} color="emerald" />
        <StatCard title="Ruang / Lab" value={stats.totalRuang} loading={loading} icon={<FaBuilding />} color="purple" />
      </div>

      {/* MAIN ANALYTICS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Attendance Summary */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-4">
              <span className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><FaChartBar /></span>
              Kehadiran Hari Ini
            </h2>
            <span className="px-4 py-1.5 bg-gray-50 text-gray-400 rounded-full text-xs font-black uppercase tracking-widest border border-gray-100">Live Update</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <AttendanceStat label="Tepat Waktu" value={attendanceData.tepatWaktu} icon={<FaCheckCircle />} color="emerald" />
            <AttendanceStat label="Terlambat" value={attendanceData.terlambat} icon={<FaExclamationTriangle />} color="amber" />
            <AttendanceStat label="Izin" value={attendanceData.izin} icon={<FaInfoCircle />} color="blue" />
            <AttendanceStat label="Sakit" value={attendanceData.sakit} icon={<FaProcedures />} color="violet" />
            <AttendanceStat label="Alpha" value={attendanceData.alpha} icon={<FaTimesCircle />} color="red" />
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
             <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm"><FaClock /></div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Jam Operasional</p>
                        <p className="text-lg font-black text-gray-700">07:00 — 15:00 WIB</p>
                    </div>
                </div>
                <button className="w-full md:w-auto px-10 py-4 bg-white hover:bg-gray-100 text-gray-800 font-black text-sm uppercase tracking-widest rounded-2xl border border-gray-200 transition-all active:scale-95 shadow-sm">
                    Lihat Laporan Lengkap
                </button>
             </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-800 rounded-[2.5rem] shadow-xl p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between min-h-[400px]">
            <div className="relative z-10">
                <h3 className="text-2xl font-black mb-2">Informasi Penting</h3>
                <p className="text-indigo-100 opacity-80 text-sm leading-relaxed">Seluruh data yang ditampilkan adalah real-time dari sistem presensi digital.</p>
                
                <div className="mt-10 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10"><FaInfoCircle /></div>
                        <div>
                            <p className="font-black text-sm uppercase tracking-wide">Sync Terakhir</p>
                            <p className="text-xs text-indigo-200">Otomatis setiap 5 menit</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10"><FaLayerGroup /></div>
                        <div>
                            <p className="font-black text-sm uppercase tracking-wide">Data Backup</p>
                            <p className="text-xs text-indigo-200">Harian: 00:00 WIB</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 pt-10">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-2">Server Status</p>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                        <span className="font-black text-lg">OPERATIONAL</span>
                    </div>
                </div>
            </div>

            {/* Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
        </div>

      </div>
    </PageWrapper>
  );
}

function StatCard({ title, value, loading, icon, color }) {
  const configs = {
    blue: "text-blue-600 bg-blue-50 border-blue-100 shadow-blue-100/50",
    orange: "text-orange-600 bg-orange-50 border-orange-100 shadow-orange-100/50",
    cyan: "text-cyan-600 bg-cyan-50 border-cyan-100 shadow-cyan-100/50",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100 shadow-emerald-100/50",
    purple: "text-purple-600 bg-purple-50 border-purple-100 shadow-purple-100/50",
  };

  const config = configs[color] || configs.blue;

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden relative">
      <div className="relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-all group-hover:scale-110 shadow-lg ${config}`}>
          {icon}
        </div>
        <h3 className="text-3xl font-black text-gray-800 tracking-tighter mb-1">
          {loading ? <div className="h-8 w-16 bg-gray-100 rounded-xl animate-pulse"></div> : value}
        </h3>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
      </div>
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 ${config.split(' ')[0]}`}></div>
    </div>
  );
}

function AttendanceStat({ label, value, icon, color }) {
  const configs = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:shadow-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100 hover:shadow-amber-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100 hover:shadow-blue-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100 hover:shadow-violet-100",
    red: "bg-red-50 text-red-600 border-red-100 hover:shadow-red-100",
  };

  const style = configs[color] || configs.blue;

  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all hover:-translate-y-2 hover:shadow-xl cursor-default group ${style}`}>
      <div className="text-2xl mb-3 transform transition-transform group-hover:scale-125 duration-300">
        {icon}
      </div>
      <div className="text-3xl font-black tracking-tighter mb-1">{value}</div>
      <div className="text-[9px] font-black uppercase tracking-widest text-center opacity-60 leading-tight">{label}</div>
    </div>
  );
}

export default Dashboard;