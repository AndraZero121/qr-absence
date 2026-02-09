// KelasAdmin.tsx - Halaman admin untuk mengelola data kelas
import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../component/Admin/AdminLayout";
import { Button } from "../../component/Shared/Button";
import { Table } from "../../component/Shared/Table";
import { TambahKelasForm } from "../../component/Shared/Form/KelasForm";
import AWANKIRI from "../../assets/Icon/AWANKIRI.png";
import AwanBawahkanan from "../../assets/Icon/AwanBawahkanan.png";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { usePopup } from "../../component/Shared/Popup/PopupProvider";

/* ===================== INTERFACE ===================== */
interface User {
  role: string;
  name: string;
}

interface Kelas {
  id: string;
  konsentrasiKeahlian: string;
  tingkatKelas: string;
  namaKelas: string;
  waliKelas: string;
}

interface KelasAdminProps {
  user: User;
  onLogout: () => void;
  currentPage: string;
  onMenuClick: (page: string) => void;
}

const konsentrasiKeahlianOptions = [
  "Semua Konsentrasi Keahlian",
  "Rekayasa Perangkat Lunak",
  "Teknik Komputer dan Jaringan",
  "Multimedia",
  "Desain Komunikasi Visual",
  "Teknik Kendaraan Ringan",
  "Elektronika Industri",
  "Mekatronika",
  "Animasi"
];

const tingkatKelasOptions = [
  "Semua Tingkat",
  "10",
  "11",
  "12"
];

/* ===================== COMPONENT ===================== */
export default function KelasAdmin({
  user,
  onLogout,
  currentPage,
  onMenuClick,
}: KelasAdminProps) {
  const { alert: popupAlert, confirm: popupConfirm } = usePopup();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [selectedKonsentrasi, setSelectedKonsentrasi] = useState("Semua Konsentrasi Keahlian");
  const [selectedTingkat, setSelectedTingkat] = useState("Semua Tingkat");
  const [validationError, setValidationError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Data for Form
  const [jurusanList, setJurusanList] = useState<{ id: string, nama: string }[]>([]);
  const [semuaGuru, setSemuaGuru] = useState<{ id: string, nama: string }[]>([]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { classService } = await import('../../services/class');
        const { majorService } = await import('../../services/major');
        // We also need teacher list for Wali Kelas. 
        // Assuming teacherService exists or we use 'users' endpoint?
        // Let's use teacherService if available.
        const { teacherService } = await import('../../services/teacher');

        const [classesData, majorsData, teachersData] = await Promise.all([
          classService.getClasses(),
          majorService.getMajors(),
          teacherService.getTeachers()
        ]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedClasses: Kelas[] = classesData.map((c: Record<string, any>) => ({
          id: String(c.id),
          konsentrasiKeahlian: c.major ? c.major.name : '-',
          tingkatKelas: c.grade,
          namaKelas: c.name || `${c.grade} ${c.label}`,
          waliKelas: c.homeroom_teacher?.user?.name || '-'
        }));
        setKelasList(mappedClasses);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedMajors = majorsData.map((m: Record<string, any>) => ({
          id: String(m.id),
          nama: m.name
        }));
        setJurusanList(mappedMajors);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedTeachers = teachersData.map((t: Record<string, any>) => ({
          id: String(t.id),
          nama: t.user?.name || t.nip || 'Guru'
        }));
        setSemuaGuru(mappedTeachers);

      } catch (e) {
        console.error(e);
        void popupAlert("Gagal mengambil data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [popupAlert]);

  /* ===================== GET UNIQUE DATA ===================== */
  // Daftar wali kelas yang sudah digunakan
  const usedWaliKelas = useMemo(() => {
    const waliKelasSet = new Set<string>();
    kelasList.forEach(kelas => {
      if (kelas.waliKelas && kelas.waliKelas !== '-') {
        waliKelasSet.add(kelas.waliKelas);
      }
    });
    return Array.from(waliKelasSet);
  }, [kelasList]);



  // Daftar guru yang belum menjadi wali kelas (tersedia)
  const availableWaliKelas = useMemo(() => {
    // IMPORTANT: In real backend waliKelas is Name string in Table, but ID in update?
    // deskta version uses ID in update/create payload (data.waliKelasId).
    // The select options in form (KelasForm) expect ID for value and NAME for display.
    // In our `semauGuru` fetched from teacherService, `nama` is the name.
    // `usedWaliKelas` set contains NAMES because that's what we mapped in `kelasList`.
    // Wait, backend response for class puts name in `waliKelas` field.
    // So we need to match by ID if possible, or name.
    // Ideally we should store ID in `kelasList` too?
    // Let's assume we filter by NAME for simplicity as per existing logic, OR fix logic to use IDs.
    // In `fetchData`: waliKelas: c.homeroom_teacher?.user?.name
    // We should probably rely on the form passing the ID.
    // For `availableWaliKelas` calculation: filter out teachers whose name is in `usedWaliKelas`?
    // Or fetch who is homeroom teacher from backend?
    // Let's filter by name.

    return semuaGuru.filter(guru => !usedWaliKelas.includes(guru.nama));
  }, [semuaGuru, usedWaliKelas]);

  // Daftar wali kelas yang tersedia untuk modal edit (termasuk yang sedang diedit)
  const availableWaliKelasForEdit = useMemo(() => {
    if (!editingKelas) return availableWaliKelas;

    // Saat edit, tambahkan wali kelas yang sedang diedit ke daftar tersedia
    const currentWaliKelas = semuaGuru.find(guru => guru.nama === editingKelas.waliKelas);
    if (currentWaliKelas) {
      // Need to avoid duplicates if somehow it is in available list
      if (!availableWaliKelas.find(g => g.id === currentWaliKelas.id)) {
        return [...availableWaliKelas, currentWaliKelas];
      }
    }
    return availableWaliKelas;
  }, [availableWaliKelas, editingKelas, semuaGuru]);

  // Statistik untuk ditampilkan
  const stats = useMemo(() => ({
    totalKelas: kelasList.length,
    waliKelasTersedia: availableWaliKelas.length,
    waliKelasDigunakan: usedWaliKelas.length,
  }), [kelasList.length, availableWaliKelas.length, usedWaliKelas.length]);



  /* ===================== FILTER ===================== */
  const filteredData = kelasList.filter((k) => {
    const konsentrasiMatch =
      selectedKonsentrasi === "Semua Konsentrasi Keahlian" ||
      k.konsentrasiKeahlian === selectedKonsentrasi;

    const tingkatMatch =
      selectedTingkat === "Semua Tingkat" ||
      k.tingkatKelas === selectedTingkat;

    return konsentrasiMatch && tingkatMatch;
  });

  /* ===================== HANDLE DELETE ===================== */
  const handleDelete = async (row: Kelas) => {
    if (await popupConfirm(`Hapus kelas "${row.namaKelas}"? Wali kelas "${row.waliKelas}" akan tersedia kembali.`)) {
      try {
        const { classService } = await import('../../services/class');
        await classService.deleteClass(row.id);

        // Refresh local list
        setKelasList((prev) => prev.filter((k) => k.id !== row.id));
        setOpenActionId(null);
        void popupAlert("Kelas berhasil dihapus");
      } catch (e) {
        console.error(e);
        void popupAlert("Gagal menghapus kelas");
      }
    }
  };

  /* ===================== HANDLE SUBMIT ===================== */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: Record<string, any>) => {
    if (isSubmitting) return;

    // Check duplicate logic locally for UPSERT proposal
    // We construct the key and check if it exists
    const combinationKey = `${data.jurusanId}|${data.kelasId}|${data.namaKelas.toLowerCase().trim()}`;

    // Find if any class matches this key (excluding current edit id)
    const duplicateClass = kelasList.find((k) => {
      // If editing, skip self
      if (editingKelas && k.id === editingKelas.id) return false;
      const existingKey = `${k.konsentrasiKeahlian}|${k.tingkatKelas}|${k.namaKelas.toLowerCase()}`;
      return existingKey === combinationKey;
    });

    let targetId = editingKelas?.id;

    if (duplicateClass) {
      // Prompt for Upsert
      const confirmUpdate = await popupConfirm(
        `Kelas "${data.namaKelas}" (Jurusan: ${data.jurusanId}, Tingkat: ${data.kelasId}) sudah ada. Update data kelas tersebut?`
      );
      if (!confirmUpdate) return;
      targetId = duplicateClass.id;
    }

    setIsSubmitting(true);

    try {
      const { classService } = await import('../../services/class');

      // Find major ID based on selected name/ID
      // In Form, jurusanId is the NAME because options use name.
      const selectedMajor = jurusanList.find(j => j.nama === data.jurusanId || j.id === data.jurusanId);
      const majorId = selectedMajor ? parseInt(selectedMajor.id) : null;

      if (!majorId) throw new Error("Jurusan tidak valid");

      const payload = {
        grade: data.kelasId,
        label: data.namaKelas,
        major_id: majorId,
        homeroom_teacher_id: data.waliKelasId
      };

      if (targetId) {
        await classService.updateClass(targetId, payload);
        void popupAlert("Kelas berhasil diupdate");
      } else {
        await classService.createClass(payload);
        void popupAlert("Kelas berhasil dibuat");
      }

      // Refresh Data
      const newData = await classService.getClasses();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedData: Kelas[] = newData.map((c: Record<string, any>) => ({
        id: String(c.id),
        konsentrasiKeahlian: c.major ? c.major.name : '-',
        tingkatKelas: c.grade,
        namaKelas: c.name || `${c.grade} ${c.label}`,
        waliKelas: c.homeroom_teacher?.user?.name || '-'
      }));
      setKelasList(mappedData);

      // Reset
      setIsModalOpen(false);
      setEditingKelas(null);
      setValidationError("");

    } catch (e) {
      console.error(e);
      const errorMsg = (e as any)?.response?.data?.message || "Gagal menyimpan data kelas";
      void popupAlert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===================== HANDLE OPEN MODAL ===================== */
  const handleOpenModal = () => {
    setValidationError("");
    setIsModalOpen(true);
  };

  /* ===================== TABLE ===================== */
  const columns = [
    { key: "konsentrasiKeahlian", label: "Konsentrasi Keahlian" },
    { key: "tingkatKelas", label: "Tingkat Kelas" },
    { key: "namaKelas", label: "Kelas" },
    { key: "waliKelas", label: "Wali Kelas" },
    {
      key: "aksi",
      label: "Aksi",
      render: (_: unknown, row: Kelas) => (
        <div style={{ position: "relative" }}>
          <button
            onClick={() =>
              setOpenActionId(openActionId === row.id ? null : row.id)
            }
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#666",
            }}
          >
            <MoreVertical size={22} strokeWidth={1.5} />
          </button>

          {openActionId === row.id && (
            <div style={dropdownMenuStyle}>
              <button
                onClick={() => {
                  setOpenActionId(null);
                  setEditingKelas(row);
                  setValidationError("");
                  setIsModalOpen(true);
                }}
                style={actionItemStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F0F4FF";
                  e.currentTarget.style.color = "#2563EB";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.color = "#0F172A";
                }}
              >
                <Edit size={16} strokeWidth={2} />
                Ubah
              </button>

              <button
                onClick={() => handleDelete(row)}
                style={{ ...actionItemStyle, borderBottom: "none" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FEF2F2";
                  e.currentTarget.style.color = "#DC2626";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.color = "#0F172A";
                }}
              >
                <Trash2 size={16} strokeWidth={2} />
                Hapus
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      pageTitle="Data Kelas"
      currentPage={currentPage}
      onMenuClick={onMenuClick}
      user={user}
      onLogout={onLogout}
      hideBackground
    >
      <img src={AWANKIRI} style={bgLeft} alt="Background awan kiri" />
      <img src={AwanBawahkanan} style={bgRight} alt="Background awan kanan bawah" />

      <div style={containerStyle}>
        {/* STATISTICS CARDS - WARNA NAVY DENGAN TULISAN PUTIH */}
        <div style={statsContainerStyle}>
          <div style={statCardStyle}>
            {/* Icon dengan background circular */}
            <div style={statIconContainerStyle}>
              <div style={iconCircleStyle}>
                <span style={iconTextStyle}>🏫</span>
              </div>
            </div>

            <div style={statContentStyle}>
              <div style={statNumberStyle}>{stats.totalKelas}</div>
              <div style={statLabelStyle}>Total Kelas</div>
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={statIconContainerStyle}>
              <div style={iconCircleStyle}>
                <span style={iconTextStyle}>👨‍🏫</span>
              </div>
            </div>

            <div style={statContentStyle}>
              <div style={statNumberStyle}>{stats.waliKelasTersedia}</div>
              <div style={statLabelStyle}>Wali Kelas Tersedia</div>
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={statIconContainerStyle}>
              <div style={iconCircleStyle}>
                <span style={iconTextStyle}>📚</span>
              </div>
            </div>

            <div style={statContentStyle}>
              <div style={statNumberStyle}>{stats.waliKelasDigunakan}</div>
              <div style={statLabelStyle}>Wali Kelas Digunakan</div>
            </div>
          </div>
        </div>

        {/* HEADER DENGAN FILTER DAN TOMBOL */}
        <div style={headerStyle}>
          <div style={filterContainerStyle}>
            <div style={{ minWidth: "200px", maxWidth: "250px" }}>
              <select
                value={selectedKonsentrasi}
                onChange={(e) => setSelectedKonsentrasi(e.target.value)}
                style={dropdownStyle}
              >
                {konsentrasiKeahlianOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ minWidth: "120px", maxWidth: "150px" }}>
              <select
                value={selectedTingkat}
                onChange={(e) => setSelectedTingkat(e.target.value)}
                style={dropdownStyle}
              >
                {tingkatKelasOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={buttonContainerStyle}>
            <Button
              label="Tambahkan"
              onClick={handleOpenModal}
              style={buttonStyle}
            />
          </div>
        </div>

        {validationError && (
          <div style={errorBannerStyle}>
            ⚠️ {validationError}
          </div>
        )}

        <div style={tableWrapperStyle}>
          {isLoading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
              Memuat data...
            </div>
          ) : (
            <Table columns={columns} data={filteredData} keyField="id" />
          )}
        </div>
      </div>

      {/* MODAL OVERLAY */}
      <div style={{
        ...modalOverlayStyle,
        display: isModalOpen ? "flex" : "none",
      }}>
        <div style={modalContentStyle}>
          <TambahKelasForm
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingKelas(null);
              setValidationError("");
              setIsSubmitting(false);
            }}
            isEdit={!!editingKelas}
            isLoading={isSubmitting} // Pass isLoading here
            initialData={
              editingKelas
                ? {
                  // Try to guess valid data from editingKelas
                  // Nama Kelas is Name
                  namaKelas: editingKelas.namaKelas,
                  // Jurusan is Name in existing data? Yes
                  jurusanId: editingKelas.konsentrasiKeahlian,
                  // Kelas ID is grade
                  kelasId: editingKelas.tingkatKelas,
                  // Wali Kelas ID ?? editingKelas.waliKelas is NAME. 
                  // We need ID of user/teacher. 
                  // We have `semuaGuru`. using name match to find ID.
                  waliKelasId: semuaGuru.find(g => g.nama === editingKelas.waliKelas)?.id || ''
                }
                : undefined
            }
            jurusanList={jurusanList}
            waliKelasList={availableWaliKelasForEdit}
            takenWaliKelasIds={editingKelas ? usedWaliKelas.filter(id => id !== editingKelas.waliKelas) : usedWaliKelas}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

/* ===================== STYLES ===================== */
const containerStyle: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: 12,
  padding: 20,
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: 24,
  position: "relative",
  zIndex: 1,
  minHeight: "calc(100vh - 180px)",
};

/* ========== STATISTICS CARDS STYLES - WARNA NAVY ========== */
const statsContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: 20,
  justifyContent: "space-between",
  marginBottom: 8,
};

const statCardStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: "#1e3a8a", // Navy blue
  borderRadius: 16,
  padding: "24px",
  display: "flex",
  alignItems: "center",
  gap: 16,
  boxShadow: "0 4px 12px rgba(30, 58, 138, 0.3)",
  border: "1px solid #1e40af",
  minHeight: "120px",
  transition: "all 0.2s ease",
  cursor: "pointer",
};

const statIconContainerStyle: React.CSSProperties = {
  flexShrink: 0,
};

const iconCircleStyle: React.CSSProperties = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  border: "2px solid rgba(255, 255, 255, 0.3)",
};

const iconTextStyle: React.CSSProperties = {
  fontSize: "28px",
  lineHeight: 1,
  color: "#FFFFFF",
};

const statContentStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 0,
};

const statNumberStyle: React.CSSProperties = {
  color: "#FFFFFF",
  fontSize: "36px",
  fontWeight: 800,
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  lineHeight: 1.2,
  marginBottom: "6px",
  textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
};

const statLabelStyle: React.CSSProperties = {
  color: "#dbeafe", // Light blue
  fontSize: "15px",
  fontWeight: 500,
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  letterSpacing: "0.3px",
};

// Hover effects (Inserted via JS in component or styles here? Inline styles don't support pseudo :hover well without CSS-in-JS or external sheet. 
// I'll skip complex hover logic for consistency with previous merge or use style tag trick if strictly needed.
// previous merge used:
// const styleSheet = document.createElement("style"); ...
// I can keep that pattern or omit. I'll omit to mitigate risk of hydration mismatch if SSR used (though this is SPA),
// but for standard React, it's fine. I will omit for simplicity unless requested.
// The code I wrote has:
/*
const hoverStyles = `...`;
const styleSheet ...
*/
// I will include it to match Merge version fidelity.
// But placing `document.head.appendChild` at top level module scope is bad practice.
// I'll put it in useEffect if needed, or simply not do it.
// I will skip it to be safe.

/* ========== HEADER STYLES ========== */
const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 20,
  marginTop: 8,
  paddingBottom: 16,
  borderBottom: "1px solid #F3F4F6",
};

const filterContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flex: 1,
};

const buttonContainerStyle: React.CSSProperties = {
  height: "40px",
  display: "flex",
  alignItems: "center",
};

const buttonStyle: React.CSSProperties = {
  height: "100%",
  padding: "0 20px",
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#1e3a8a",
  color: "#FFFFFF",
  fontWeight: 600,
  fontSize: "14px",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
};

/* ========== TABLE STYLES ========== */
const tableWrapperStyle: React.CSSProperties = {
  borderRadius: 8,
  overflow: "hidden",
  border: "1px solid #E5E7EB",
  backgroundColor: "#FFFFFF",
  marginTop: 8,
};

/* ========== MODAL STYLES ========== */
const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  backdropFilter: "blur(2px)",
};

const modalContentStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 10000,
  maxWidth: "90vw",
  maxHeight: "90vh",
  overflow: "auto",
};

/* ========== DROPDOWN STYLES ========== */
const dropdownStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 6,
  border: "1px solid #D1D5DB",
  fontSize: 14,
  backgroundColor: "#FFFFFF",
  color: "#374151",
  outline: "none",
  cursor: "pointer",
  height: "40px",
  boxSizing: "border-box",
  transition: "all 0.2s ease",
};

const dropdownMenuStyle: React.CSSProperties = {
  position: "absolute",
  top: "100%",
  right: 0,
  marginTop: 4,
  background: "#FFFFFF",
  borderRadius: 6,
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  minWidth: 140,
  zIndex: 1000,
  overflow: "hidden",
  border: "1px solid #E5E7EB",
};

const actionItemStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  border: "none",
  background: "none",
  textAlign: "left",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#374151",
  fontSize: 14,
  fontWeight: 400,
  transition: "all 0.2s ease",
  borderBottom: "1px solid #F3F4F6",
};

/* ========== ERROR BANNER STYLES ========== */
const errorBannerStyle: React.CSSProperties = {
  backgroundColor: "#FEF2F2",
  border: "1px solid #FECACA",
  color: "#DC2626",
  padding: "12px 16px",
  borderRadius: "6px",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: 500,
  margin: "8px 0",
};

/* ========== BACKGROUND IMAGE STYLES ========== */
const bgLeft: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: 200,
  zIndex: 0,
  opacity: 0.9,
};

const bgRight: React.CSSProperties = {
  position: "fixed",
  bottom: 0,
  right: 0,
  width: 220,
  zIndex: 0,
  opacity: 0.9,
};
