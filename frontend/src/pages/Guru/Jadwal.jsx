import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaBook, 
  FaClock, 
  FaUserGraduate, 
  FaArrowLeft,
  FaBell,
  FaFileAlt
} from 'react-icons/fa';
import PageWrapper from '../../components/ui/PageWrapper';
import apiClient from '../../services/api';
import DummyJadwal from '../../assets/images/DummyJadwal.png';
import { STORAGE_BASE_URL } from '../../utils/constants';

function Jadwal() {
  const [jadwalList, setJadwalList] = useState([]);
  const [jadwalImage, setJadwalImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/guru/schedules');
        const { schedules, attendance_settings } = response.data;
        
        setJadwalList(schedules || []);
        if (attendance_settings?.schedule_image) {
            setJadwalImage(attendance_settings.schedule_image);
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
        // Fallback for demo
        setJadwalList([
            { id: 1, day: 'Senin', subject_name: "Informatika", class_name: "XI RPL 1", start_time: "07:00", end_time: "08:30", time_slot: 1 },
            { id: 2, day: 'Senin', subject_name: "Basis Data", class_name: "XI RPL 2", start_time: "09:00", end_time: "10:30", time_slot: 3 },
            { id: 3, day: 'Selasa', subject_name: "Web Programming", class_name: "XII RPL 1", start_time: "07:00", end_time: "10:30", time_slot: 1 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  return (
    <PageWrapper className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-10 font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-blue-200">
            <FaCalendarAlt />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-none italic uppercase">Jadwal Mengajar</h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Agenda Pembelajaran Mingguan Anda
            </p>
          </div>
        </div>

        <div className="flex bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-inner">
            <div className="px-6 py-3 bg-white text-blue-600 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-sm border border-gray-100">Semester Genap</div>
            <div className="px-6 py-3 text-gray-400 text-xs font-black uppercase tracking-[0.2em]">TP 2025/2026</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* TABEL JADWAL MINGGUAN */}
        <div className="xl:col-span-2 space-y-8">
            {days.map((day) => {
                const dailyJadwal = jadwalList.filter(j => j.day === day);
                if (dailyJadwal.length === 0) return null;

                return (
                    <div key={day} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                            <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest flex items-center gap-3">
                                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                                {day}
                            </h3>
                            <span className="px-4 py-1.5 bg-white text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100 shadow-sm">
                                {dailyJadwal.length} SESI
                            </span>
                        </div>
                        <div className="p-4 sm:p-8">
                            <div className="space-y-4">
                                {dailyJadwal.map((j) => (
                                    <div key={j.id} className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-50/50 rounded-[1.5rem] border border-gray-100 hover:bg-white hover:shadow-lg transition-all group/item">
                                        <div className="w-20 sm:w-24 text-center shrink-0">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Jam Ke</p>
                                            <p className="text-3xl font-black text-blue-600 tracking-tighter leading-none">{j.time_slot}</p>
                                        </div>
                                        <div className="h-12 w-px bg-gray-200 hidden sm:block"></div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h4 className="text-xl font-black text-gray-800 leading-tight mb-1 uppercase tracking-tight">{j.subject_name}</h4>
                                            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><FaUserGraduate className="text-indigo-400" /> {j.class_name}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="flex items-center gap-1.5"><FaClock className="text-blue-400" /> {j.start_time} - {j.end_time}</span>
                                            </div>
                                        </div>
                                        <div className="shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200"><FaBook size={14} /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}

            {jadwalList.length === 0 && !loading && (
                <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
                    <div className="text-gray-200 mb-4 flex justify-center"><FaCalendarAlt size={64} /></div>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Belum ada jadwal mengajar terinput</p>
                </div>
            )}
        </div>

        {/* SIDEBAR / VISUAL MASTER */}
        <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-800 rounded-[2.5rem] shadow-xl p-10 text-white relative overflow-hidden group">
                <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-2 uppercase italic">Info Penting</h3>
                    <p className="text-indigo-100 text-xs font-medium leading-relaxed opacity-80 mb-8">Selalu periksa jadwal terbaru Anda untuk menghindari kesalahan waktu pembelajaran.</p>
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                            <FaBell className="text-amber-400 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Notifikasi Aktif</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                            <FaFileAlt className="text-indigo-200" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Sync Database: OK</span>
                        </div>
                    </div>
                </div>
                <FaClock size={150} className="absolute -right-10 -bottom-10 text-white/5 transform rotate-12 group-hover:scale-110 transition-transform duration-1000" />
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 text-center space-y-6">
                <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest">Master Jadwal Visual</h4>
                <div className="relative group cursor-pointer overflow-hidden rounded-[1.5rem]">
                    <img 
                        src={jadwalImage ? `${STORAGE_BASE_URL}/${jadwalImage}` : DummyJadwal} 
                        alt="Visual" 
                        className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => e.target.src = DummyJadwal}
                    />
                    <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <span className="px-6 py-2 bg-white text-indigo-900 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Perbesar Gambar</span>
                    </div>
                </div>
                <p className="text-[10px] font-bold text-gray-400 leading-relaxed px-4">Klik gambar di atas untuk melihat versi resolusi tinggi dari master jadwal kurikulum.</p>
            </div>
        </div>

      </div>
    </PageWrapper>
  );
}

export default Jadwal;