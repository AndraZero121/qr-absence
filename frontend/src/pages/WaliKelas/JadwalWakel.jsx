import React, { useState, useEffect } from 'react';
import { FaUser, FaCalendarAlt, FaSpinner, FaImage } from 'react-icons/fa';
import PageWrapper from '../../components/ui/PageWrapper';
import { getHomeroomDashboard, getClassScheduleImage } from '../../services/attendance';
import DummyJadwal from '../../assets/images/DummyJadwal.png';

const JadwalWakel = () => {
  const [loading, setLoading] = useState(true);
  const [scheduleUrl, setScheduleUrl] = useState(null);
  const [teacher, setTeacher] = useState({ name: "Memuat...", nip: "..." });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardData = await getHomeroomDashboard();
        setTeacher({
          name: dashboardData.teacher_name || 'Wali Kelas',
          nip: dashboardData.teacher_nip || '-'
        });

        if (dashboardData.homeroom_class?.id || dashboardData.class_id) {
          const classId = dashboardData.homeroom_class?.id || dashboardData.class_id;
          try {
            const url = await getClassScheduleImage(classId);
            setScheduleUrl(url);
          } catch {
            console.warn("No custom schedule image found");
          }
        }
      } catch (error) {
        console.error("Error fetching homeroom schedule:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <PageWrapper className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-10 font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-indigo-200">
            <FaCalendarAlt />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-none italic uppercase">Jadwal Kelas Binaan</h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-3">Master Jadwal Pembelajaran Mingguan</p>
          </div>
        </div>

        <div className="flex bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-inner">
            <div className="px-6 py-3 bg-white text-indigo-600 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-sm border border-gray-100 flex items-center gap-3">
                <FaUser /> {teacher.name}
            </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col items-center p-10 min-h-[600px] relative">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Menyiapkan Visual Jadwal...</p>
            </div>
        ) : (
            <div className="w-full flex flex-col items-center gap-10">
                <div className="relative group max-w-5xl w-full">
                    <img 
                        src={scheduleUrl || DummyJadwal} 
                        alt="Jadwal Pembelajaran" 
                        className="w-full h-auto rounded-[2rem] shadow-2xl border-[12px] border-white transition-transform duration-700 group-hover:scale-[1.02]"
                        onError={(e) => { e.target.src = DummyJadwal; }}
                    />
                    {!scheduleUrl && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/5 backdrop-blur-[2px] rounded-[2rem]">
                            <FaImage size={64} className="text-gray-300 mb-4" />
                            <p className="text-gray-500 font-black uppercase tracking-widest text-sm">Menggunakan Jadwal Default</p>
                        </div>
                    )}
                </div>
                
                <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 text-center max-w-xl">
                    <p className="text-gray-500 text-xs font-medium leading-relaxed italic italic">
                        "Visual di atas adalah master jadwal resmi yang telah disetujui kurikulum. 
                        Silakan hubungi bagian kurikulum jika terdapat ketidaksesuaian data."
                    </p>
                </div>
            </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default JadwalWakel;