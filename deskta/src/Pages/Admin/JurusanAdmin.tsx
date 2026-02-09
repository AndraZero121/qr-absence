import React, { useState, useEffect } from "react";
import AdminLayout from "../../component/Admin/AdminLayout";
import { Button } from "../../component/Shared/Button";
import { SearchBox } from "../../component/Shared/Search";
import { Table } from "../../component/Shared/Table";
import { JurusanForm } from "../../component/Shared/Form/JurusanForm";
import AWANKIRI from "../../assets/Icon/AWANKIRI.png";
import AwanBawahkanan from "../../assets/Icon/AwanBawahkanan.png";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { usePopup } from "../../component/Shared/Popup/PopupProvider";

/* ===================== INTERFACE ===================== */
interface User {
  role: string;
  name: string;
}

interface KonsentrasiKeahlian {
  id: string;
  kode: string;
  nama: string;
}

interface KonsentrasiKeahlianAdminProps {
  user: User;
  onLogout: () => void;
  currentPage: string;
  onMenuClick: (page: string) => void;
}

/* ===================== DUMMY DATA ===================== */


/* ===================== COMPONENT ===================== */
export default function KonsentrasiKeahlianAdmin({
  user,
  onLogout,
  currentPage,
  onMenuClick,
}: KonsentrasiKeahlianAdminProps) {
  const { alert: popupAlert, confirm: popupConfirm } = usePopup();
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [konsentrasiKeahlianList, setKonsentrasiKeahlianList] = useState<KonsentrasiKeahlian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingKonsentrasiKeahlian, setEditingKonsentrasiKeahlian] = useState<KonsentrasiKeahlian | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ namaJurusan: "", kodeJurusan: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to check for duplicates
  const checkDuplicate = (kode: string, nama: string, excludeId?: string) => {
    return konsentrasiKeahlianList.some(
      (k) =>
        (k.kode.toLowerCase() === kode.toLowerCase() ||
          k.nama.toLowerCase() === nama.toLowerCase()) &&
        k.id !== excludeId
    );
  };

  // Fetch Majors
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        setIsLoading(true);
        const { majorService } = await import('../../services/major');
        const data = await majorService.getMajors();
        const mappedData: KonsentrasiKeahlian[] = data.map((m: any) => ({
          id: String(m.id),
          kode: m.code,
          nama: m.name
        }));
        setKonsentrasiKeahlianList(mappedData);
      } catch (e) {
        console.error(e);
        void popupAlert("Gagal mengambil data jurusan");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMajors();
  }, [popupAlert]);

  /* ===================== FILTER ===================== */
  const filteredData = konsentrasiKeahlianList.filter(
    (k) =>
      k.kode.toLowerCase().includes(searchValue.toLowerCase()) ||
      k.nama.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleDelete = async (row: KonsentrasiKeahlian) => {
    if (await popupConfirm(`Hapus "${row.nama}"?`)) {
      try {
        const { majorService } = await import('../../services/major');
        await majorService.deleteMajor(row.id);
        setKonsentrasiKeahlianList((prev) => prev.filter((k) => k.id !== row.id));
        setOpenActionId(null);
        void popupAlert("Jurusan berhasil dihapus");
      } catch (e) {
        void popupAlert("Gagal menghapus jurusan");
      }
    }
  };

  /* ===================== HANDLER FUNCTIONS ===================== */
  const handleEditKonsentrasi = (konsentrasi: KonsentrasiKeahlian) => {
    setEditingKonsentrasiKeahlian(konsentrasi);
    setIsEditMode(true);
    setFormData({
      namaJurusan: konsentrasi.nama,
      kodeJurusan: konsentrasi.kode
    });
    setIsModalOpen(true);
    setOpenActionId(null);
  };

  const handleTambahKonsentrasi = () => {
    setEditingKonsentrasiKeahlian(null);
    setIsEditMode(false);
    setFormData({ namaJurusan: "", kodeJurusan: "" });
    setIsModalOpen(true);
  };

  const handleSubmitKonsentrasi = async (data: { namaJurusan: string; kodeJurusan: string }) => {
    // Validasi duplikasi di frontend
    const isDuplicate = checkDuplicate(
      data.kodeJurusan,
      data.namaJurusan,
      isEditMode && editingKonsentrasiKeahlian ? editingKonsentrasiKeahlian.id : undefined
    );

    if (isDuplicate) {
      await popupAlert("Kode atau nama konsentrasi keahlian sudah ada. Harap gunakan yang berbeda.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { majorService } = await import('../../services/major');
      const payload = {
        name: data.namaJurusan,
        code: data.kodeJurusan
      };

      if (isEditMode && editingKonsentrasiKeahlian) {
        await majorService.updateMajor(editingKonsentrasiKeahlian.id, payload);
        await popupAlert(`Konsentrasi keahlian "${data.namaJurusan}" berhasil diperbarui!`);
      } else {
        await majorService.createMajor(payload);
        await popupAlert(`Konsentrasi keahlian "${data.namaJurusan}" berhasil ditambahkan!`);
      }

      // Refresh
      const newData = await majorService.getMajors();
      const mappedData: KonsentrasiKeahlian[] = newData.map((m: any) => ({
        id: String(m.id),
        kode: m.code,
        nama: m.name
      }));
      setKonsentrasiKeahlianList(mappedData);

      handleCloseModal();

    } catch (e: any) {
      console.error(e);
      // Handle logic for backend duplication error (409) if needed
      // Assuming generic error for now, as frontend check covers most cases
      const errorMessage = e?.response?.data?.message || "Gagal menyimpan data";
      await popupAlert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKonsentrasiKeahlian(null);
    setIsEditMode(false);
    setFormData({ namaJurusan: "", kodeJurusan: "" });
  };

  // Update form data when editing data changes
  useEffect(() => {
    if (editingKonsentrasiKeahlian && isEditMode) {
      setFormData({
        namaJurusan: editingKonsentrasiKeahlian.nama,
        kodeJurusan: editingKonsentrasiKeahlian.kode
      });
    }
  }, [editingKonsentrasiKeahlian, isEditMode]);

  /* ===================== TABLE ===================== */
  const columns = [
    { key: "kode", label: "Kode Konsentrasi Keahlian" },
    { key: "nama", label: "Konsentrasi Keahlian" },
    {
      key: "aksi",
      label: "Aksi",
      render: (_: any, row: KonsentrasiKeahlian) => (
        <div style={{ position: "relative" }}>
          <button
            onClick={() =>
              setOpenActionId(openActionId === row.id ? null : row.id)
            }
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F3F4F6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <MoreVertical size={22} strokeWidth={1.5} />
          </button>

          {openActionId === row.id && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 6,
                background: "#FFFFFF",
                borderRadius: 8,
                boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
                minWidth: 180,
                zIndex: 10,
                overflow: "hidden",
                border: "1px solid #E2E8F0",
              }}
            >
              {/* UBAH */}
              <button
                onClick={() => handleEditKonsentrasi(row)}
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

              {/* HAPUS */}
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
      pageTitle="Data Konsentrasi Keahlian"
      currentPage={currentPage}
      onMenuClick={onMenuClick}
      user={user}
      onLogout={onLogout}
      hideBackground
    >
      <img src={AWANKIRI} style={bgLeft} alt="Background kiri" />
      <img src={AwanBawahkanan} style={bgRight} alt="Background kanan" />

      <div
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(6px)",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid rgba(255,255,255,0.6)",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ width: 300 }}>
            <SearchBox
              placeholder="Cari Konsentrasi Keahlian.."
              value={searchValue}
              onChange={setSearchValue}
            />
          </div>
          <Button label="Tambahkan" onClick={handleTambahKonsentrasi} />
        </div>

        {/* TABLE WRAPPER */}
        <div
          style={{
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 0 0 1px #E5E7EB",
          }}
        >
          {isLoading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
              Memuat data...
            </div>
          ) : (
            <Table columns={columns} data={filteredData} keyField="id" />
          )}
        </div>
      </div>

      {/* FORM MODAL */}
      <JurusanForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitKonsentrasi}
        initialData={formData}
        isEdit={isEditMode}
        isLoading={isSubmitting}
      />
    </AdminLayout>
  );
}

/* ===================== STYLE ===================== */
const actionItemStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  border: "none",
  background: "none",
  textAlign: "left",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "#0F172A",
  fontSize: 14,
  fontWeight: 500,
  transition: "all 0.2s ease",
  borderBottom: "1px solid #F1F5F9",
};

const bgLeft: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: 220,
  zIndex: 0,
  pointerEvents: "none",
};

const bgRight: React.CSSProperties = {
  position: "fixed",
  bottom: 0,
  right: 0,
  width: 220,
  zIndex: 0,
  pointerEvents: "none",
};

