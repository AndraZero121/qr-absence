import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PageWrapper from "../../components/ui/PageWrapper";
import {
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaTimes,
  FaUser,
  FaClipboardCheck,
  FaChevronDown,
  FaCalendarAlt,
  FaChevronRight,
  FaUserTie
} from "react-icons/fa";

function KehadiranGuruShow() {
  useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  // Ambil data dari sessionStorage
  useEffect(() => {
    setTimeout(() => {
      const saved = sessionStorage.getItem("kehadiran-guru");
      if (saved) {
        setData(JSON.parse(saved));
      } else {
        const mock = [
          {
            id: 1,
            tanggal: "12-01-2026",
            jam: "07.00 - 08.30",
            mapel: "Matematika",
            kelas: "X RPL 1",
            status: "Hadir",
          },
          {
            id: 2,
            tanggal: "13-01-2026",
            jam: "09.00 - 10.30",
            mapel: "Bahasa Indonesia",
            kelas: "XI RPL 2",
            status: "",
          },
        ];
        sessionStorage.setItem("kehadiran-guru", JSON.stringify(mock));
        setData(mock);
      }
      setLoading(false);
    }, 400);
  }, []);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setSelectedStatus(item.status || "Tidak Mengajar");
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    const updated = data.map((item) =>
      item.id === selectedItem.id
        ? { ...item, status: selectedStatus }
        : item
    );
    setData(updated);
    sessionStorage.setItem("kehadiran-guru", JSON.stringify(updated));
    setShowEditModal(false);
  };

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Data...</span>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-8 font-sans">
      
      {/* ================= BREADCRUMB ================= */}
      <div className="flex items-center gap-3 text-sm font-bold text-gray-500 mb-8 overflow-hidden whitespace-nowrap">
        <Link to="/waka/kehadiran-guru" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest text-[11px] font-black">
          <FaUserTie />
          <span>Kehadiran Guru</span>
        </Link>
        <FaChevronRight className="text-[10px] text-gray-300" />
        <span className="text-gray-400 uppercase tracking-widest text-[11px] font-black truncate">Budi Santoso, S.Pd</span>
      </div>

      {/* ================= HEADER CARD ================= */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-white/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-indigo-100">
            <FaUser />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-none italic uppercase">Budi Santoso, S.Pd</h1>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-3">Kode Guru: GR001</p>
          </div>
        </div>

        <Link
          to="/waka/kehadiran-guru"
          className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-black active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-gray-200"
        >
          <FaArrowLeft />
          <span>Kembali</span>
        </Link>
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-3 uppercase tracking-tight">
                <FaClipboardCheck className="text-indigo-600" /> Daftar Kehadiran Mengajar
            </h3>
            <span className="hidden sm:block text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail Per Pertemuan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">No</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tanggal</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Jam Pelajaran</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mata Pelajaran</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Kelas</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((item, i) => {
                const displayStatus = item.status || "Tidak Mengajar";
                const statusColors = {
                  "Hadir": "bg-emerald-50 text-emerald-600 border-emerald-100",
                  "Terlambat": "bg-amber-50 text-amber-600 border-amber-100",
                  "Izin": "bg-blue-50 text-blue-600 border-blue-100",
                  "Sakit": "bg-violet-50 text-violet-600 border-violet-100",
                  "Alpha": "bg-red-50 text-red-600 border-red-100",
                  "Pulang": "bg-gray-100 text-gray-600 border-gray-200",
                  "Tidak Mengajar": "bg-gray-50 text-gray-400 border-gray-100"
                };
                const colorClass = statusColors[displayStatus] || statusColors["Tidak Mengajar"];

                return (
                  <tr key={item.id} className="group hover:bg-indigo-50/10 transition-colors">
                    <td className="px-8 py-6 text-sm font-black text-gray-300 italic group-hover:text-indigo-400">{String(i + 1).padStart(2, '0')}</td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-600">{item.tanggal}</td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-600">{item.jam}</td>
                    <td className="px-8 py-6 font-black text-gray-800 text-xs uppercase tracking-tight italic">{item.mapel}</td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest border border-gray-100">{item.kelas}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${colorClass}`}>
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button
                        className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-400 flex items-center justify-center transition-all hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-100 active:scale-95 mx-auto"
                        onClick={() => handleEditClick(item)}
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EDIT */}
      {showEditModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
          
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Ubah Kehadiran</h3>
              <button
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
                onClick={() => setShowEditModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FaClipboardCheck className="text-indigo-600" /> Pilih Status Kehadiran
                </label>
                <div className="relative group">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full appearance-none px-6 py-5 bg-gray-50 border border-gray-200 rounded-[1.5rem] outline-none font-bold text-gray-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer shadow-inner"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Terlambat">Terlambat</option>
                    <option value="Izin">Izin</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Alpha">Alpha</option>
                    <option value="Pulang">Pulang</option>
                    <option value="Tidak Mengajar">Tidak Mengajar</option>
                  </select>
                  <FaChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-hover:text-indigo-500 transition-colors" />
                </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-2 gap-4 border-t border-gray-50 bg-gray-50/30">
              <button
                className="py-4 rounded-2xl bg-white border border-gray-200 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 hover:text-gray-600 transition-all active:scale-95"
                onClick={() => setShowEditModal(false)}
              >
                Batal
              </button>
              <button 
                className="py-4 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                onClick={handleUpdate}
              >
                <FaSave /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

export default KehadiranGuruShow;