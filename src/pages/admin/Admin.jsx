import { useEffect, useState } from "react";
import { callApi } from "../../api";
import ExportRekapModal from "../../components/admin/ExportRekapModal";

export default function Admin({
  opdId,
  role,
  isSuperAdmin,
  selectedOpdId,
  setSelectedOpdId,
  onLogout,
  onManajemenPegawai,
  onManajemenOpd,
  userData,
}) {
  const opdAktif = isSuperAdmin ? selectedOpdId : opdId;

  const [absensiList, setAbsensiList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [namaOpd, setNamaOpd] = useState("");
  const [daftarOpd, setDaftarOpd] = useState([]);
  const [loadingOpd, setLoadingOpd] = useState(false);
  const [halaman, setHalaman] = useState("dashboard");

  const [showExportModal, setShowExportModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchAbsensiAdmin = async () => {
    setLoading(true);

    try {
      const data = await callApi("getAbsensiAdmin", {
        session_token: userData.session_token,
      });

      setAbsensiList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat absensi admin:", error);
      setAbsensiList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDaftarOpd = async () => {
    if (!isSuperAdmin) return;

    setLoadingOpd(true);

    try {
      const result = await callApi("getDaftarOpd", {
        session_token: userData.session_token,
      });

      if (Array.isArray(result)) {
        setDaftarOpd(result);

        // Kalau belum ada OPD yang dipilih,
        // gunakan OPD pertama
        if (!selectedOpdId && result.length > 0) {
          setSelectedOpdId(result[0].opd_id);
        }
      } else {
        setDaftarOpd([]);
      }
    } catch (error) {
      console.error("Gagal memuat daftar OPD:", error);
      setDaftarOpd([]);
    } finally {
      setLoadingOpd(false);
    }
  };

  // Hanya nama OPD yang dipakai di dashboard ini.
  // Radius, lokasi, dan jam sesi diatur di Manajemen OPD (Edit OPD).
  const fetchConfig = async () => {
    try {
      const result = await callApi("getConfig", {
        opdId: opdAktif,
        session_token: userData.session_token,
      });

      if (result?.nama_opd) {
        setNamaOpd(String(result.nama_opd));
      }
    } catch (error) {
      console.error("Gagal memuat konfigurasi:", error);
    }
  };

  useEffect(() => {
    fetchDaftarOpd();
  }, [isSuperAdmin]);

  useEffect(() => {
    if (!opdId) return;

    // fetchAbsensiAdmin();
    fetchConfig();
  }, [opdAktif]);

  const totalAbsen = absensiList.length;

  const totalApproved = absensiList.filter(
    (item) => item[6] === "APPROVED",
  ).length;

  const fiturBelumTersedia = () => {
    // alert("Fitur belum tersedia.");
    setShowExportModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-6">
        {/* HEADER */}
        <div className="p-5 mb-5 bg-white border shadow-sm rounded-2xl border-slate-200">
          <h1 className="text-xl font-bold md:text-2xl text-slate-800">
            Dashboard Admin
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Sistem Absensi PPPK {namaOpd || "Instansi"}
          </p>
        </div>

        {/* STATISTIK */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
            <p className="text-3xl font-bold text-blue-600">{totalAbsen}</p>

            <p className="mt-1 text-xs text-slate-500">Absen Hari Ini</p>
          </div>

          <div className="p-5 bg-white border shadow-sm rounded-2xl border-slate-200">
            <p className="text-3xl font-bold text-green-600">{totalApproved}</p>

            <p className="mt-1 text-xs text-slate-500">Approved</p>
          </div>
        </div>

        {/* ABSENSI HARI INI */}
        <div className="p-5 mb-5 bg-white border shadow-sm rounded-2xl border-slate-200">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">
              Absensi Hari Ini
            </h2>

            <button
              type="button"
              onClick={fetchAbsensiAdmin}
              disabled={loading}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              {loading ? "Memuat..." : "↻ Refresh"}
            </button>
          </div>

          {loading && absensiList.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto border-4 border-blue-200 rounded-full w-7 h-7 border-t-blue-600 animate-spin" />

              <p className="mt-3 text-xs text-slate-500">Memuat data...</p>
            </div>
          ) : absensiList.length === 0 ? (
            <p className="py-8 text-sm text-center text-slate-400">
              Belum ada absensi hari ini
            </p>
          ) : (
            <div>
              {absensiList.map((item, index) => {
                const tanggal = new Date(item[0]);

                const jam = tanggal.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const tanggalText = tanggal.toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                });

                const approved = item[8] === "APPROVED";

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 py-3 border-b border-slate-100 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate text-slate-700">
                        {item[2]}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Sesi: {item[4]}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {tanggalText}, {jam}
                      </p>
                    </div>

                    <span
                      className={`
                          text-xs
                          font-bold
                          ${approved ? "text-green-600" : "text-red-500"}
                        `}
                    >
                      {item[8]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AKSI */}
        <div className="p-5 mb-5 bg-white border shadow-sm rounded-2xl border-slate-200">
          <h2 className="mb-4 text-base font-bold text-slate-800">Aksi</h2>
          {/* KHUSUS SUPERADMIN */}
          {isSuperAdmin && (
            <button
              type="button"
              onClick={onManajemenOpd}
              className="w-full py-3 mb-3 text-sm font-bold text-purple-700 transition border border-purple-200 bg-purple-50 hover:bg-purple-100 rounded-xl"
            >
              🏢 Manajemen OPD
            </button>
          )}

          <button
            type="button"
            onClick={onManajemenPegawai}
            className="w-full py-3 mb-3 text-sm font-bold text-green-700 transition border border-green-200 bg-green-50 hover:bg-green-100 rounded-xl"
          >
            👥 Manajemen Pegawai
          </button>

          <button
            type="button"
            onClick={fiturBelumTersedia}
            className="w-full py-3 mb-3 text-sm font-bold text-white transition bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            📊 Export Rekapan Absen
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full py-3 text-sm font-bold text-red-600 transition bg-slate-100 hover:bg-slate-200 rounded-xl"
          >
            Logout
          </button>
        </div>
      </div>
      <ExportRekapModal
        visible={showExportModal}
        isSuperAdmin={isSuperAdmin}
        daftarOpd={daftarOpd}
        selectedOpdId={selectedOpdId}
        exporting={exporting}
        onBatal={() => setShowExportModal(false)}
        onExport={async ({ opdId, bulan, tahun }) => {
          setExporting(true);

          try {
            console.log("DATA EXPORT:", {
              opdId,
              bulan,
              tahun,
            });

            const result = await callApi("exportRekap", {
              opdId,
              bulan,
              tahun,

              session_token: userData.session_token,
            });

            if (result?.status === "berhasil" && result?.fileBase64) {
              // ========================================
              // DOWNLOAD FILE (dari isi file yang dikirim server)
              // ========================================

              const binary = atob(result.fileBase64);
              const bytes = new Uint8Array(binary.length);

              for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
              }

              const blob = new Blob([bytes], {
                type:
                  result.mimeType ||
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              });

              const url = URL.createObjectURL(blob);

              const link = document.createElement("a");

              link.href = url;

              link.download = result.namaFile;

              document.body.appendChild(link);

              link.click();

              document.body.removeChild(link);

              setTimeout(() => URL.revokeObjectURL(url), 1000);

              // ========================================
              // TUTUP MODAL
              // ========================================

              setShowExportModal(false);
            } else {
              alert(result?.message || "Gagal mengeksport rekap.");
            }
          } catch (error) {
            console.error("handleExport:", error);

            alert("Terjadi kesalahan saat mengeksport data.");
          } finally {
            setExporting(false);
          }
        }}
      />
    </div>
  );
}
