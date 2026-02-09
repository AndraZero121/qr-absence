import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { 
  FaUser, 
  FaHome, 
  FaChalkboardTeacher, 
  FaUserGraduate, 
  FaCalendarAlt, 
  FaSignOutAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaProcedures,
  FaTimesCircle,
  FaClock,
  FaBars,
  FaChevronRight
} from "react-icons/fa";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate, useLocation, Link } from "react-router-dom";
import CustomAlert from "../../components/Common/CustomAlert";
import PageWrapper from "../../components/ui/PageWrapper";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function DashboardWaka() {
  const navigate = useNavigate();
  const location = useLocation();
  const [now, setNow] = useState(new Date());
  const [alertState, setAlertState] = useState({ show: false, type: 'confirm', title: '', message: '' });
  const [statistik, setStatistik] = useState({ hadir: 0, izin: 0, sakit: 0, alpha: 0, terlambat: 0 });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchData = async () => {
    try {
      const { default: apiClient } = await import("../../services/api");
      const response = await apiClient.get('waka/dashboard/summary');
      const stats = response?.data?.statistik || { hadir: 850, izin: 45, sakit: 32, alpha: 12, terlambat: 5 };
      const trend = response?.data?.trend || [];

      setStatistik(stats);

      const labels = trend.length > 0 ? trend.map(t => t.label) : ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
      const hadirData = trend.length > 0 ? trend.map(t => t.hadir) : [800, 820, 810, 850, 840, 860];
      const izinData = trend.length > 0 ? trend.map(t => t.izin) : [20, 25, 30, 28, 45, 30];
      const sakitData = trend.length > 0 ? trend.map(t => t.sakit) : [15, 18, 20, 22, 32, 25];
      const alphaData = trend.length > 0 ? trend.map(t => t.alpha) : [10, 5, 8, 12, 12, 10];
      const terlambatData = trend.length > 0 ? trend.map(t => t.terlambat) : [5, 8, 4, 6, 5, 7];

      setChartData({
        labels,
        datasets: [
          { label: "Hadir", data: hadirData, backgroundColor: "#10B981", borderRadius: 8 },
          { label: "Izin", data: izinData, backgroundColor: "#F59E0B", borderRadius: 8 },
          { label: "Sakit", data: sakitData, backgroundColor: "#8B5CF6", borderRadius: 8 },
          { label: "Alpha", data: alphaData, backgroundColor: "#EF4444", borderRadius: 8 },
          { label: "Terlambat", data: pulangData, backgroundColor: "#F97316", borderRadius: 8 },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogoutClick = () => {
    setAlertState({ show: true, type: 'confirm', title: 'Konfirmasi Keluar', message: 'Apakah Anda yakin ingin keluar?' });
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { path: "/waka/dashboard", label: "Dashboard", icon: <FaHome /> },
    { path: "/waka/kehadiran-guru", label: "Kehadiran Guru", icon: <FaChalkboardTeacher /> },
    { path: "/waka/kehadiran-siswa", label: "Kehadiran Siswa", icon: <FaUserGraduate /> },
    { path: "/waka/jadwal-guru", label: "Jadwal Guru", icon: <FaCalendarAlt /> },
    { path: "/waka/jadwal-siswa", label: "Jadwal Siswa", icon: <FaCalendarAlt /> },
  ];

  return (
    <PageWrapper className="flex min-h-[calc(100vh-80px)] bg-transparent font-sans">
      
      {/* SIDEBAR */}
      <aside className={`
        fixed lg:sticky top-[80px] h-[calc(100vh-80px)] z-40 bg-white/95 backdrop-blur-xl border-r border-gray-200 transition-all duration-500 ease-in-out flex flex-col
        ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'}
      `}>
        {/* Toggle Button Inside Sidebar for Desktop */}
        <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex absolute -right-4 top-10 w-8 h-8 bg-indigo-600 text-white rounded-full items-center justify-center shadow-lg hover:bg-indigo-700 transition-all"
        >
            <FaChevronRight className={`transition-transform duration-500 ${isSidebarOpen ? 'rotate-180' : 'rotate-0'}`} size={12} />
        </button>

        {/* Profile Area */}
        <div className={`p-8 border-b border-gray-100 flex flex-col items-center transition-opacity duration-300 ${!isSidebarOpen && 'lg:opacity-0 lg:pointer-events-none'}`}>
          <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-500 mb-4 shadow-inner ring-4 ring-white">
            <FaUser size={40} />
          </div>
          <h2 className="font-black text-gray-800 text-lg text-center leading-tight">Waka Kesiswaan</h2>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mt-2 bg-indigo-50 px-3 py-1 rounded-full">Administrator</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all group
                ${location.pathname === item.path 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <span className={`text-xl transition-transform group-hover:scale-110`}>{item.icon}</span>
              <span className={`whitespace-nowrap transition-opacity duration-300 ${!isSidebarOpen && 'lg:opacity-0'}`}>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={handleLogoutClick}
            className={`flex items-center gap-4 w-full px-5 py-4 text-xs font-black text-red-600 hover:bg-red-50 rounded-2xl transition-all uppercase tracking-widest ${!isSidebarOpen && 'lg:justify-center'}`}
          >
            <FaSignOutAlt className="text-xl" />
            <span className={`transition-opacity duration-300 ${!isSidebarOpen && 'lg:hidden'}`}>Keluar</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0">
        <div className="p-6 md:p-10 lg:p-12 max-w-[1400px] mx-auto space-y-10">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-white/50">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-1.5 bg-indigo-600 rounded-full"></span>
                <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">Dashboard Overview</h1>
              </div>
              <p className="text-gray-500 font-medium ml-11">Monitor seluruh aktivitas dan statistik sekolah secara real-time.</p>
            </div>
            
            <div className="flex items-center gap-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100 shadow-inner ml-auto lg:ml-0">
              <div className="text-right">
                <div className="text-3xl font-black text-indigo-600 font-mono tracking-tighter leading-none mb-1">
                  {now.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm border border-gray-100"><FaClock /></div>
            </div>
          </div>

          {/* STATS STRIP */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <StatsCard title="Hadir" value={statistik.hadir} icon={<FaCheckCircle />} color="emerald" />
            <StatsCard title="Izin" value={statistik.izin} icon={<FaInfoCircle />} color="amber" />
            <StatsCard title="Sakit" value={statistik.sakit} icon={<FaProcedures />} color="violet" />
            <StatsCard title="Alpha" value={statistik.alpha} icon={<FaTimesCircle />} color="red" />
            <StatsCard title="Terlambat" value={statistik.terlambat} icon={<FaClock />} color="orange" />
          </div>

          {/* ANALYTICS & WIDGETS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Chart Area */}
            <div className="xl:col-span-2 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-10 flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <h3 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-4">
                    <span className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><FaCalendarAlt /></span>
                    Tren Kehadiran
                </h3>
                <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                    <button className="px-6 py-2 bg-white text-indigo-600 rounded-xl text-xs font-black shadow-sm border border-gray-100 uppercase tracking-widest">Tahun Ini</button>
                    <button className="px-6 py-2 text-gray-400 rounded-xl text-xs font-black hover:text-gray-600 uppercase tracking-widest transition-colors">Semester</button>
                </div>
              </div>
              
              <div className="flex-1 min-h-[350px]">
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom", labels: { font: { weight: '800', size: 11 }, padding: 25, usePointStyle: true } },
                      tooltip: { backgroundColor: '#1e293b', padding: 15, cornerRadius: 16, titleFont: { size: 14, weight: '900' }, bodyFont: { size: 13, weight: '600' } }
                    },
                    scales: {
                      y: { beginAtZero: true, grid: { color: '#f8fafc', borderDash: [5, 5] }, ticks: { font: { weight: '700' } } },
                      x: { grid: { display: false }, ticks: { font: { weight: '700' } } }
                    }
                  }}
                />
              </div>
            </div>

            {/* Side Info / Activity */}
            <div className="space-y-8">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-800 rounded-[2.5rem] shadow-xl p-10 text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em] mb-3">Tahun Ajaran</p>
                        <h4 className="text-3xl font-black leading-tight mb-6">2025 / 2026 <br/><span className="text-indigo-200 opacity-60">Semester Genap</span></h4>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                        </div>
                        <p className="text-xs font-bold text-indigo-100 mt-4 italic opacity-80">Progres semester berjalan: 65%</p>
                    </div>
                    <FaCalendarAlt size={120} className="absolute -right-8 -bottom-8 text-white/5 transform -rotate-12 group-hover:scale-110 transition-transform duration-1000" />
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-10">
                    <h4 className="text-lg font-black text-gray-800 uppercase tracking-tight mb-6 flex items-center gap-3">
                        <span className="w-2 h-6 bg-amber-400 rounded-full"></span>
                        Aktivitas Terbaru
                    </h4>
                    <div className="space-y-6">
                        {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex gap-5 items-start pb-6 border-b border-gray-50 last:border-0 last:pb-0 group">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                <FaInfoCircle size={14} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-700 font-bold leading-relaxed mb-1 group-hover:text-gray-900 transition-colors">Rekap mingguan kehadiran siswa telah digenerate.</p>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">2 jam yang lalu</span>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>

        </div>
      </main>

      <CustomAlert
        isOpen={alertState.show}
        onClose={() => setAlertState(prev => ({ ...prev, show: false }))}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onConfirm={handleConfirmLogout}
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
      />
    </PageWrapper>
  );
}

function StatsCard({ title, value, icon, color }) {
    const configs = {
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/50",
        amber: "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/50",
        violet: "bg-violet-50 text-violet-600 border-violet-100 shadow-violet-100/50",
        red: "bg-red-50 text-red-600 border-red-100 shadow-red-100/50",
        orange: "bg-orange-50 text-orange-600 border-orange-100 shadow-orange-100/50",
    };
    const config = configs[color];

    return (
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden relative">
            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-6 transition-all group-hover:scale-110 shadow-lg ${config}`}>
                    {icon}
                </div>
                <h3 className="text-3xl font-black text-gray-800 tracking-tighter mb-1">{value}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</p>
            </div>
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 ${config.split(' ')[0]}`}></div>
        </div>
    );
}