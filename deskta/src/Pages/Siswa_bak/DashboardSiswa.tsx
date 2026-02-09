import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SiswaLayout from "../../component/Siswa/SiswaLayout";
import { Select } from "../../component/Shared/Select";

// ==================== INTERFACES & TYPES ====================

type SiswaPage = "dashboard" | "jadwal-anda" | "absensi";

interface DashboardSiswaProps {
  user: { name: string; phone: string };
  onLogout: () => void;
}

interface AbsensiRecord {
  id: string;
  tanggal: string;
  jamPelajaran: string;
  mataPelajaran: string;
  guru: string;
  status: "hadir" | "izin" | "sakit" | "pulang" | "tidak-hadir";
}

// ==================== DUMMY DATA ====================

const dummyData: AbsensiRecord[] = [
  {
    id: "1",
    tanggal: "25-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "tidak-hadir",
  },
  {
    id: "2",
    tanggal: "24-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "tidak-hadir",
  },
  {
    id: "3",
    tanggal: "25-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "sakit",
  },
  {
    id: "4",
    tanggal: "25-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "izin",
  },
  {
    id: "5",
    tanggal: "25-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "hadir",
  },
  {
    id: "6",
    tanggal: "25-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "pulang",
  },
  {
    id: "7",
    tanggal: "26-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Bahasa Indonesia",
    guru: "Budi Santoso S.Pd",
    status: "izin",
  },
  {
    id: "8",
    tanggal: "26-05-2025",
    jamPelajaran: "5-8",
    mataPelajaran: "Bahasa Inggris",
    guru: "Siti Nurhaliza S.Pd",
    status: "sakit",
  },
  {
    id: "9",
    tanggal: "27-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Fisika",
    guru: "Rina Wulandari S.Pd",
    status: "hadir",
  },
  {
    id: "10",
    tanggal: "27-05-2025",
    jamPelajaran: "5-8",
    mataPelajaran: "Kimia",
    guru: "Ahmad Fauzi S.Pd",
    status: "pulang",
  },
];

// ==================== HELPER COMPONENTS ====================

function CalendarIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 2V5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 2V5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 9.09H20.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SummaryCard({ label, value, color = "#0B2948" }: { label: string; value: number; color?: string }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "12px",
        padding: "20px 24px",
        border: "1px solid #E2E8F0",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
        minWidth: "100px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
      }}
    >
      <div
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: color,
          marginBottom: "8px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "28px",
          fontWeight: 800,
          color: color,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "48px 32px",
        border: "2px dashed #E5E7EB",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚀</div>
      <h2
        style={{
          fontSize: "20px",
          marginBottom: "8px",
          color: "#111827",
          fontWeight: 700,
        }}
      >
        {title}
      </h2>
      <p style={{ color: "#6B7280", fontSize: "14px", margin: 0 }}>
        Halaman {title} sedang dalam pengembangan.
      </p>
    </div>
  );
}

// ==================== SUB-PAGES ====================

// 1. HALAMAN DASHBOARD (BERANDA)
function HalamanDashboard({ user }: { user: { name: string } }) {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      setCurrentDate(now.toLocaleDateString("id-ID", options));
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Welcome & Clock Section */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px"
      }}>
        {/* Welcome Card */}
        <div style={{
          background: "linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)",
          borderRadius: "16px",
          padding: "32px",
          color: "white",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(30, 58, 138, 0.2)"
        }}>
          <div style={{ position: "relative", zIndex: 2 }}>
            <h2 style={{ fontSize: "28px", fontWeight: "800", margin: "0 0 8px 0" }}>
              Halo, {user.name} 👋
            </h2>
            <p style={{ fontSize: "16px", opacity: 0.9, margin: 0, lineHeight: 1.5 }}>
              Selamat datang kembali di Dashboard Siswa. <br />
              Pantau jadwal dan absensi kamu hari ini.
            </p>
          </div>
          {/* Decorative Circle */}
          <div style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            zIndex: 1
          }} />
        </div>

        {/* Clock Card */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "12px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#6B7280" }}>
            <CalendarIcon />
            <span style={{ fontSize: "16px", fontWeight: "600" }}>{currentDate}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#111827" }}>
            <ClockIcon />
            <span style={{ fontSize: "32px", fontWeight: "800", letterSpacing: "1px" }}>
              {currentTime}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats or Info could go here */}
    </div>
  );
}

// 2. HALAMAN ABSENSI (LOGIC LAMA)
function HalamanAbsensi() {
  const [startDate, setStartDate] = useState("2025-05-24");
  const [endDate, setEndDate] = useState("2025-05-27");
  const [statusFilter, setStatusFilter] = useState<string>("semua");

  // Filter data
  const filteredData = useMemo(() => {
    if (!startDate || !endDate) return dummyData;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return dummyData.filter((item) => {
      const [day, month, year] = item.tanggal.split("-").map(Number);
      const itemDate = new Date(year, month - 1, day);

      const inDateRange = itemDate >= start && itemDate <= end;

      let statusMatch = true;
      if (statusFilter !== "semua") {
        if (statusFilter === "tidak-hadir") {
          statusMatch = item.status === "tidak-hadir";
        } else {
          statusMatch = item.status === statusFilter;
        }
      }

      return inDateRange && statusMatch;
    });
  }, [startDate, endDate, statusFilter]);

  // Hitung summary
  const summary = useMemo(() => {
    const hadir = filteredData.filter((d) => d.status === "hadir").length;
    const izin = filteredData.filter((d) => d.status === "izin").length;
    const sakit = filteredData.filter((d) => d.status === "sakit").length;
    const pulang = filteredData.filter((d) => d.status === "pulang").length;
    const tidakHadir = filteredData.filter((d) => d.status === "tidak-hadir").length;

    return { hadir, izin, sakit, pulang, tidakHadir };
  }, [filteredData]);

  const renderStatus = (status: string) => {
    let bgColor = "";
    let label = "";

    switch (status) {
      case "hadir":
        bgColor = "#10B981";
        label = "Hadir";
        break;
      case "izin":
        bgColor = "#3B82F6";
        label = "Izin";
        break;
      case "sakit":
        bgColor = "#F59E0B";
        label = "Sakit";
        break;
      case "pulang":
        bgColor = "#8B5CF6";
        label = "Pulang";
        break;
      case "tidak-hadir":
        bgColor = "#EF4444";
        label = "Tidak Hadir";
        break;
      default:
        bgColor = "#6B7280";
        label = status;
        break;
    }

    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "100px",
          padding: "8px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 600,
          color: "white",
          backgroundColor: bgColor,
          textAlign: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {label}
      </div>
    );
  };

  const columns = [
    { key: "tanggal", label: "Tanggal", width: "120px" },
    { key: "jamPelajaran", label: "Jam Pelajaran", width: "120px" },
    { key: "mataPelajaran", label: "Mata Pelajaran", width: "200px" },
    { key: "guru", label: "Guru", width: "250px" },
    {
      key: "status",
      label: "Status",
      render: (_: any, row: AbsensiRecord) => renderStatus(row.status),
      align: "center" as const,
      width: "120px",
    },
  ];

  const statusOptions = [
    { label: "Semua Status", value: "semua" },
    { label: "Hadir", value: "hadir" },
    { label: "Izin", value: "izin" },
    { label: "Sakit", value: "sakit" },
    { label: "Pulang", value: "pulang" },
    { label: "Tidak Hadir", value: "tidak-hadir" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Filter Section */}
      <div
        style={{
          background: "#0B2948",
          borderRadius: 12,
          padding: "20px 24px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
          {/* Date Range */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: 8,
              padding: "12px 20px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              flex: 1,
              minWidth: "300px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontWeight: "600", fontSize: "14px", color: "#FFFFFF" }}>
              <CalendarIcon />
              <span>Periode :</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", flex: 1 }}>
              <div style={{ background: "#FFFFFF", borderRadius: "6px", padding: "10px 14px", border: "1px solid #CBD5E1", minWidth: "150px" }}>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ border: "none", background: "transparent", fontWeight: "600", fontSize: "14px", outline: "none", width: "100%" }}
                />
              </div>
              <span style={{ fontWeight: "bold", color: "#FFFFFF" }}>—</span>
              <div style={{ background: "#FFFFFF", borderRadius: "6px", padding: "10px 14px", border: "1px solid #CBD5E1", minWidth: "150px" }}>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ border: "none", background: "transparent", fontWeight: "600", fontSize: "14px", outline: "none", width: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* Status Select */}
          <div style={{ background: "rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", border: "1px solid rgba(255, 255, 255, 0.2)", minWidth: "200px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#FFFFFF", marginBottom: 6 }}>Status</div>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: 6, padding: 2 }}>
              <Select value={statusFilter} onChange={setStatusFilter} options={statusOptions} placeholder="Semua Status" />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
        <SummaryCard label="Hadir" value={summary.hadir} color="#10B981" />
        <SummaryCard label="Izin" value={summary.izin} color="#3B82F6" />
        <SummaryCard label="Sakit" value={summary.sakit} color="#F59E0B" />
        <SummaryCard label="Pulang" value={summary.pulang} color="#8B5CF6" />
        <SummaryCard label="Tidak Hadir" value={summary.tidakHadir} color="#EF4444" />
      </div>

      {/* Table */}
      <div style={{ background: "#FFFFFF", borderRadius: 12, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead>
              <tr style={{ backgroundColor: "#F8FAFC" }}>
                {columns.map((col) => (
                  <th key={col.key} style={{ padding: "16px 24px", textAlign: "left", fontSize: "14px", fontWeight: 600, color: "#475569", borderBottom: "2px solid #E2E8F0", width: col.width || "auto" }}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                    {columns.map((col) => (
                      <td key={col.key} style={{ padding: "16px 24px", fontSize: "14px", color: "#334155", textAlign: col.align || "left" }}>
                        {col.render ? col.render(row[col.key as keyof AbsensiRecord], row) : row[col.key as keyof AbsensiRecord]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} style={{ padding: "60px 24px", textAlign: "center", color: "#64748B", fontSize: "16px" }}>
                    Tidak ada data ketidakhadiran untuk periode yang dipilih
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function DashboardSiswa({ user, onLogout }: DashboardSiswaProps) {
  const [currentPage, setCurrentPage] = useState<SiswaPage>("dashboard");
  const navigate = useNavigate();

  const handleMenuClick = (page: string) => {
    setCurrentPage(page as SiswaPage);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const getPageTitle = (page: SiswaPage) => {
    switch (page) {
      case "dashboard": return "Dashboard";
      case "jadwal-anda": return "Jadwal Anda";
      case "absensi": return "Riwayat Absensi";
      default: return "Dashboard";
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <HalamanDashboard user={user} />;
      case "absensi":
        return <HalamanAbsensi />;
      case "jadwal-anda":
        return <ComingSoon title="Jadwal Anda" />;
      default:
        return <HalamanDashboard user={user} />;
    }
  };

  return (
    <SiswaLayout
      user={user}
      currentPage={currentPage}
      onMenuClick={handleMenuClick}
      onLogout={handleLogout}
      pageTitle={getPageTitle(currentPage)}
    >
      {renderContent()}
    </SiswaLayout>
  );
}