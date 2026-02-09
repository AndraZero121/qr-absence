import { useState, useMemo } from "react";
import SiswaLayout from "../../component/Siswa/SiswaLayout";
import { Select } from "../../component/Shared/Select";
import { Modal } from "../../component/Shared/Modal";

interface AbsensiRecord {
  id: string;
  tanggal: string;
  jamPelajaran: string;
  mataPelajaran: string;
  guru: string;
  status: "alpha" | "izin" | "sakit" | "hadir" | "pulang";
  keterangan?: string; // Tambahan untuk izin/sakit/pulang
}

// Dummy data - nanti dari API
const dummyData: AbsensiRecord[] = [
  {
    id: "1",
    tanggal: "25-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "alpha",
  },
  {
    id: "2",
    tanggal: "24-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "alpha",
  },
  {
    id: "3",
    tanggal: "25-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "izin",
    keterangan: "Ijin tidak masuk karena ada keperluan keluarga",
  },
  {
    id: "4",
    tanggal: "25-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "sakit",
    keterangan: "Demam tinggi dan dokter menyarankan istirahat",
  },
  {
    id: "5",
    tanggal: "25-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "alpha",
  },
  {
    id: "6",
    tanggal: "25-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "alpha",
  },
  {
    id: "7",
    tanggal: "26-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Bahasa Indonesia",
    guru: "Budi Santoso S.Pd",
    status: "izin",
    keterangan: "Menghadiri acara keluarga",
  },
  {
    id: "8",
    tanggal: "26-05-2025",
    jamPelajaran: "5-8",
    mataPelajaran: "Bahasa Inggris",
    guru: "Siti Nurhaliza S.Pd",
    status: "sakit",
    keterangan: "Flu berat dan batuk",
  },
  {
    id: "9",
    tanggal: "26-05-2025",
    jamPelajaran: "1-4",
    mataPelajaran: "Matematika",
    guru: "Alifah Diantebes Aindra S.pd",
    status: "hadir",
  },
  {
    id: "10",
    tanggal: "26-05-2025",
    jamPelajaran: "5-8",
    mataPelajaran: "Bahasa Inggris",
    guru: "Siti Nurhaliza S.Pd",
    status: "pulang",
    keterangan: "Pulang lebih awal karena sakit perut",
  },
];

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

// Icon mata untuk lihat detail
function EyeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path
        d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Interface untuk props
interface AbsensiSiswaProps {
  user?: { name: string; phone: string; role?: string };
  currentPage?: string;
  onMenuClick?: (page: string) => void;
  onLogout?: () => void;
}

export default function AbsensiSiswa({
  user = { name: "Siswa", phone: "", role: "siswa" },
  currentPage = "absensi",
  onMenuClick = () => {},
  onLogout = () => {},
}: AbsensiSiswaProps) {
  const [startDate, setStartDate] = useState("2025-05-24");
  const [endDate, setEndDate] = useState("2025-05-26");
  const [statusFilter, setStatusFilter] = useState<string>("semua");
  const [selectedRecord, setSelectedRecord] = useState<AbsensiRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        if (statusFilter === "izin/sakit") {
          statusMatch = item.status === "izin" || item.status === "sakit";
        } else if (statusFilter === "alpha") {
          statusMatch = item.status === "alpha";
        } else if (statusFilter === "pulang") {
          statusMatch = item.status === "pulang";
        } else if (statusFilter === "hadir") {
          statusMatch = item.status === "hadir";
        }
      }
      
      return inDateRange && statusMatch;
    });
  }, [startDate, endDate, statusFilter]);

  // Hitung summary berdasarkan data filtered
  const summary = useMemo(() => {
    const hadir = filteredData.filter((d) => d.status === "hadir").length;
    const pulang = filteredData.filter((d) => d.status === "pulang").length;
    const izin = filteredData.filter((d) => d.status === "izin").length;
    const sakit = filteredData.filter((d) => d.status === "sakit").length;
    const alpha = filteredData.filter((d) => d.status === "alpha").length;
    
    return { hadir, pulang, izin, sakit, alpha, total: filteredData.length };
  }, [filteredData]);

  // Fungsi untuk membuka modal detail
  const handleStatusClick = (record: AbsensiRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Status diklik:", record);
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  // Custom Status Renderer dengan icon mata
  const StatusButton = ({ status, row }: { status: string; row: AbsensiRecord }) => {
    let bgColor = "#EF4444"; // Red (Alpha)
    let label = "Tidak Hadir"; // Diubah dari "Alpha" ke "Tidak Hadir"
    let textColor = "#FFFFFF";

    if (status === "izin") {
      bgColor = "#F59E0B"; // Yellow/Gold
      label = "Izin";
    } else if (status === "sakit") {
      bgColor = "#3B82F6"; // Blue
      label = "Sakit";
    } else if (status === "pulang") {
      bgColor = "#10B981"; // Green
      label = "Pulang";
    } else if (status === "hadir") {
      bgColor = "#22C55E"; // Green lebih terang untuk hadir
      label = "Hadir";
    }

    return (
      <div
        onClick={(e) => handleStatusClick(row, e)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          minWidth: "100px",
          padding: "8px 14px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 600,
          color: textColor,
          backgroundColor: bgColor,
          cursor: "pointer",
          transition: "all 0.2s ease",
          border: "none",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.9";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
        }}
      >
        <EyeIcon size={14} />
        <span>{label}</span>
      </div>
    );
  };

  const columns = [
    {
      key: "tanggal",
      label: "Tanggal",
      width: "120px",
    },
    {
      key: "jamPelajaran",
      label: "Jam Pelajaran",
      width: "120px",
    },
    {
      key: "mataPelajaran",
      label: "Mata Pelajaran",
      width: "200px",
    },
    {
      key: "guru",
      label: "Guru",
      width: "250px",
    },
    {
      key: "status",
      label: "Status",
      render: (_: any, row: AbsensiRecord) => <StatusButton status={row.status} row={row} />,
      align: "center" as const,
      width: "120px",
    },
  ];

  // Status filter options - Alpha diubah jadi Tidak Hadir
  const statusOptions = [
    { label: "Semua Status", value: "semua" },
    { label: "Hadir", value: "hadir" },
    { label: "Tidak Hadir", value: "alpha" }, // Label: Tidak Hadir, value tetap "alpha"
    { label: "Izin/Sakit", value: "izin/sakit" },
    { label: "Pulang", value: "pulang" },
  ];

  // Fungsi untuk mendapatkan teks status
  const getStatusText = (status: string) => {
    switch(status) {
      case "alpha":
        return "Siswa tidak hadir tanpa keterangan";
      case "izin":
        return "Izin";
      case "sakit":
        return "Sakit";
      case "hadir":
        return "Siswa hadir tepat waktu";
      case "pulang":
        return "Pulang";
      default:
        return status;
    }
  };

  // Helper function untuk warna status
  const getStatusColor = (status: string) => {
    switch(status) {
      case "alpha": return "#EF4444";
      case "izin": return "#F59E0B";
      case "sakit": return "#3B82F6";
      case "hadir": return "#22C55E";
      case "pulang": return "#10B981";
      default: return "#6B7280";
    }
  };

  // Total Card
  const TotalCard = () => (
    <div
      style={{
        background: "#0B2948",
        borderRadius: "12px",
        padding: "12px 24px",
        border: "1px solid #0B2948",
        boxShadow: "0 2px 4px rgba(11, 41, 72, 0.1)",
        minWidth: "120px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#FFFFFF",
          marginBottom: "4px",
        }}
      >
        Total Data
      </div>
      <div
        style={{
          fontSize: "24px",
          fontWeight: 800,
          color: "#FFFFFF",
          lineHeight: 1,
        }}
      >
        {summary.total}
      </div>
    </div>
  );

  return (
    <>
      <SiswaLayout
        pageTitle="Daftar Ketidakhadiran" // Hapus "(Pengurus Kelas)"
        currentPage={currentPage}
        onMenuClick={onMenuClick}
        user={user}
        onLogout={onLogout}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            padding: "20px",
          }}
        >
          {/* Header Section */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "24px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Date Range Picker */}
            <div
              style={{
                background: "#0B2948",
                borderRadius: "8px",
                padding: "12px 24px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                color: "white",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                flex: 1,
                minWidth: "300px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontWeight: "700",
                  fontSize: "16px",
                  whiteSpace: "nowrap",
                }}
              >
                <CalendarIcon />
                <span>Periode :</span>
              </div>
              
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px",
                flexWrap: "wrap",
                flex: 1 
              }}>
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    color: "#0F172A",
                    fontWeight: "600",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    minWidth: "140px",
                  }}
                >
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#0F172A",
                      fontWeight: "600",
                      fontSize: "14px",
                      outline: "none",
                      fontFamily: "inherit",
                      cursor: "pointer",
                      colorScheme: "light",
                      width: "100%",
                    }}
                  />
                </div>
                
                <span style={{ fontWeight: "bold", color: "#FFFFFF" }}>s/d</span>
                
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    color: "#0F172A",
                    fontWeight: "600",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    minWidth: "140px",
                  }}
                >
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#0F172A",
                      fontWeight: "600",
                      fontSize: "14px",
                      outline: "none",
                      fontFamily: "inherit",
                      cursor: "pointer",
                      colorScheme: "light",
                      width: "100%",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "8px",
                padding: "6px 12px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                minWidth: "200px",
              }}
            >
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
                placeholder="Filter Status"
              />
            </div>
          </div>

          {/* Summary Cards */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <TotalCard />
            <SummaryCard label="Hadir" value={summary.hadir} color="#22C55E" />
            <SummaryCard label="Tidak Hadir" value={summary.alpha} color="#EF4444" /> {/* Diubah jadi Tidak Hadir */}
            <SummaryCard label="Izin" value={summary.izin} color="#F59E0B" />
            <SummaryCard label="Sakit" value={summary.sakit} color="#3B82F6" />
            <SummaryCard label="Pulang" value={summary.pulang} color="#10B981" />
          </div>

          {/* Tabel Absensi - MAIN CONTENT */}
          <div style={{ 
            position: "relative",
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
            border: "1px solid #E2E8F0",
          }}>
            <div style={{ 
              padding: "20px 24px",
              borderBottom: "1px solid #E2E8F0",
              backgroundColor: "#F8FAFC",
            }}>
              <h3 style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 700,
                color: "#0F172A",
              }}>
                Daftar Ketidakhadiran
              </h3>
            </div>
            
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "800px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#F1F5F9" }}>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        style={{
                          padding: "16px 24px",
                          textAlign: "left",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#475569",
                          borderBottom: "2px solid #E2E8F0",
                          width: col.width || "auto",
                        }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((row) => (
                      <tr
                        key={row.id}
                        style={{
                          borderBottom: "1px solid #E2E8F0",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#F8FAFC";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        {columns.map((col) => (
                          <td
                            key={col.key}
                            style={{
                              padding: "16px 24px",
                              fontSize: "14px",
                              color: "#334155",
                              verticalAlign: "middle",
                              textAlign: col.align || "left",
                            }}
                          >
                            {col.render
                              ? col.render(row[col.key as keyof AbsensiRecord], row)
                              : row[col.key as keyof AbsensiRecord]}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td 
                        colSpan={columns.length}
                        style={{
                          padding: "60px 24px",
                          textAlign: "center",
                          color: "#64748B",
                          fontSize: "16px",
                        }}
                      >
                        Tidak ada data ketidakhadiran untuk periode yang dipilih
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Footer with pagination info */}
            {filteredData.length > 0 && (
              <div style={{
                padding: "16px 24px",
                borderTop: "1px solid #E2E8F0",
                backgroundColor: "#F8FAFC",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "14px",
                color: "#64748B",
              }}>
                <span>Menampilkan {filteredData.length} dari {dummyData.length} data</span>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid #CBD5E1",
                      background: "#FFFFFF",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#475569",
                    }}
                  >
                    Sebelumnya
                  </button>
                  <span style={{ padding: "6px 12px" }}>1</span>
                  <button
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid #CBD5E1",
                      background: "#FFFFFF",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#475569",
                    }}
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SiswaLayout>

      {/* Modal Detail Kehadiran - SESUAIKAN dengan versi baru */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedRecord && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            overflow: "hidden",
            width: "100%",
            maxWidth: "500px",
            margin: "0 20px",
          }}>
            {/* Header Modal */}
            <div style={{
              backgroundColor: "#0B2948",
              padding: "20px 24px",
              textAlign: "center",
            }}>
              <h3 style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 600,
                color: "white",
              }}>
                Detail Kehadiran
              </h3>
            </div>

            {/* Content Modal */}
            <div style={{ 
              padding: "24px",
              maxHeight: "calc(100vh - 200px)",
              overflowY: "auto"
            }}>
              {/* Info Detail */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
                <DetailRow label="Tanggal" value={selectedRecord.tanggal} />
                <DetailRow label="Jam Pelajaran" value={selectedRecord.jamPelajaran} />
                <DetailRow label="Mata Pelajaran" value={selectedRecord.mataPelajaran} />
                <DetailRow label="Nama guru" value={selectedRecord.guru} />
                
                {/* Status */}
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  backgroundColor: "#F9FAFB",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  marginBottom: "16px"
                }}>
                  <span style={{ fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                    Status
                  </span>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    backgroundColor: getStatusColor(selectedRecord.status),
                  }}>
                    <EyeIcon size={12} />
                    <span>
                      {selectedRecord.status === "alpha" ? "Tidak Hadir" : // Diubah dari "Alpha" ke "Tidak Hadir"
                       selectedRecord.status === "sakit" ? "Sakit" :
                       selectedRecord.status === "izin" ? "Izin" :
                       selectedRecord.status === "hadir" ? "Hadir" :
                       "Pulang"}
                    </span>
                  </div>
                </div>

                {/* Pesan Status */}
                <div style={{ 
                  padding: "16px", 
                  backgroundColor: "#F3F4F6", 
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: "14px", 
                    color: "#111827",
                    lineHeight: 1.5,
                    textAlign: "center",
                    fontWeight: 500,
                  }}>
                    {getStatusText(selectedRecord.status)}
                  </p>
                </div>

                {/* Keterangan untuk izin, sakit, DAN PULANG (ditambahkan pulang) */}
                {(selectedRecord.status === "izin" || selectedRecord.status === "sakit" || selectedRecord.status === "pulang") && selectedRecord.keterangan && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#374151",
                    }}>
                      Keterangan :
                    </div>
                    <div style={{ 
                      padding: "12px 16px",
                      backgroundColor: "#F9FAFB",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      minHeight: "60px",
                    }}>
                      <p style={{ 
                        margin: 0, 
                        fontSize: "14px", 
                        color: "#6B7280",
                        lineHeight: 1.5,
                      }}>
                        {selectedRecord.keterangan}
                      </p>
                    </div>
                  </div>
                )}

                {/* Area Bukti Foto untuk izin, sakit, DAN PULANG (ditambahkan pulang) */}
                {(selectedRecord.status === "izin" || selectedRecord.status === "sakit" || selectedRecord.status === "pulang") && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#374151",
                    }}>
                      Bukti Foto :
                    </div>
                    <div style={{ 
                      padding: "40px 16px",
                      backgroundColor: "#F9FAFB",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      minHeight: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <p style={{ 
                        margin: 0, 
                        fontSize: "14px", 
                        color: "#9CA3AF",
                        lineHeight: 1.5,
                        textAlign: "center",
                      }}>
                        [Area untuk menampilkan bukti foto]
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tombol Tutup */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "white",
                    color: "#475569",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "all 0.2s",
                    minWidth: "120px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F8FAFC";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function SummaryCard({ label, value, color = "#0B2948" }: { label: string; value: number; color?: string }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "12px",
        padding: "12px 24px",
        border: `1px solid ${color}20`,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
        minWidth: "100px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: color,
          marginBottom: "4px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "24px",
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: "12px 0",
      borderBottom: "1px solid #E5E7EB",
      minHeight: "44px"
    }}>
      <span style={{ 
        fontWeight: "500", 
        color: "#374151", 
        fontSize: "14px",
        flex: "0 0 140px"
      }}>
        {label} :
      </span>
      <span style={{ 
        color: "#111827", 
        fontSize: "14px", 
        fontWeight: "500",
        flex: 1,
        textAlign: "right"
      }}>
        {value}
      </span>
    </div>
  );
}