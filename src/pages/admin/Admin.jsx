import { useEffect, useState } from "react";
import { callApi } from "../../api";
import SesiModal from "../../components/admin/SesiModal";
import PetaModal from "../../components/admin/PetaModal";
import ExportRekapModal from "../../components/admin/ExportRekapModal";

const menitKeJam = (menit) => {
  const nilai = Number(menit) || 0;

  const jam = Math.floor(nilai / 60);
  const menitSisa = nilai % 60;

  return `${String(jam).padStart(2, "0")}:${String(menitSisa).padStart(
    2,
    "0",
  )}`;
};

function SesiRow({ label, mulai, selesai, onUbah }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100">
      <div>
        <p className="text-sm font-semibold text-slate-700">{label}</p>

        <p className="mt-1 text-xs text-slate-500">
          {menitKeJam(mulai)} - {menitKeJam(selesai)}
        </p>
      </div>

      <button
        type="button"
        onClick={onUbah}
        className="
          px-3
          py-1.5
          rounded-lg
          border
          border-blue-200
          bg-blue-50
          text-blue-600
          text-xs
          font-semibold
          hover:bg-blue-100
          transition
        "
      >
        Ubah
      </button>
    </div>
  );
}

export default function Admin({
  opdId,
  role,
  isSuperAdmin,
  selectedOpdId,
  setSelectedOpdId,
  onLogout,
  onManajemenPegawai,
  onManajemenOpd,
}) {
  const opdAktif = isSuperAdmin ? selectedOpdId : opdId;

  const [absensiList, setAbsensiList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [radius, setRadius] = useState("");

  const [namaOpd, setNamaOpd] = useState("");
  const [daftarOpd, setDaftarOpd] = useState([]);
  const [loadingOpd, setLoadingOpd] = useState(false);
  const [koordinatKantor, setKoordinatKantor] = useState(null);
  const [halaman, setHalaman] = useState("dashboard");
  const [showPeta, setShowPeta] = useState(false);

  const [showExportModal, setShowExportModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [jamSesi, setJamSesi] = useState({
    senin_masuk_mulai: 420,
    senin_masuk_selesai: 540,

    senin_istirahat_mulai: 750,
    senin_istirahat_selesai: 840,

    senin_pulang_mulai: 1020,
    senin_pulang_selesai: 1200,

    jumat_masuk_mulai: 390,
    jumat_masuk_selesai: 510,

    jumat_istirahat_mulai: 780,
    jumat_istirahat_selesai: 870,

    jumat_pulang_mulai: 1020,
    jumat_pulang_selesai: 1200,
  });

  const [savingRadius, setSavingRadius] = useState(false);

  const [savingLokasi, setSavingLokasi] = useState(false);

  const [savingJam, setSavingJam] = useState(false);

  const [modalSesi, setModalSesi] = useState({
    visible: false,
    sesi: null,
    keyMulai: "",
    keySelesai: "",
  });
  const fetchAbsensiAdmin = async () => {
    setLoading(true);

    try {
      const data = await callApi("getAbsensiAdmin", {});

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
      const result = await callApi("getDaftarOpd");

      console.log("DAFTAR OPD:", result);

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

  const fetchConfig = async () => {
    try {
      const result = await callApi("getConfig", { opdId: opdAktif });

      if (!result) return;

      if (result.radius !== undefined && result.radius !== null) {
        setRadius(String(result.radius));
      }

      if (result.kantorLat && result.kantorLng) {
        setKoordinatKantor({
          latitude: parseFloat(result.kantorLat),
          longitude: parseFloat(result.kantorLng),
        });
      }

      if (result.nama_opd) {
        console.log("NAMA OPD:", result.nama_opd);
        setNamaOpd(String(result.nama_opd));
      }

      setJamSesi({
        senin_masuk_mulai: parseInt(result.senin_masuk_mulai || 420),

        senin_masuk_selesai: parseInt(result.senin_masuk_selesai || 540),

        senin_istirahat_mulai: parseInt(result.senin_istirahat_mulai || 750),

        senin_istirahat_selesai: parseInt(
          result.senin_istirahat_selesai || 840,
        ),

        senin_pulang_mulai: parseInt(result.senin_pulang_mulai || 1020),

        senin_pulang_selesai: parseInt(result.senin_pulang_selesai || 1200),

        jumat_masuk_mulai: parseInt(result.jumat_masuk_mulai || 390),

        jumat_masuk_selesai: parseInt(result.jumat_masuk_selesai || 510),

        jumat_istirahat_mulai: parseInt(result.jumat_istirahat_mulai || 780),

        jumat_istirahat_selesai: parseInt(
          result.jumat_istirahat_selesai || 870,
        ),

        jumat_pulang_mulai: parseInt(result.jumat_pulang_mulai || 1020),

        jumat_pulang_selesai: parseInt(result.jumat_pulang_selesai || 1200),
      });
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

  const handleSimpanRadius = async () => {
    const nilaiRadius = parseFloat(radius);

    if (!radius || Number.isNaN(nilaiRadius) || nilaiRadius <= 0) {
      alert("Masukkan nilai radius yang valid.");
      return;
    }

    const konfirmasi = window.confirm(
      `Ubah radius menjadi ${nilaiRadius} meter?`,
    );

    if (!konfirmasi) return;

    setSavingRadius(true);

    try {
      const result = await callApi("updateConfig", {
        opdId,
        key: "radius",
        value: nilaiRadius,
      });

      if (result?.status === "berhasil") {
        alert(`Radius berhasil diubah menjadi ${nilaiRadius} meter.`);
      } else {
        alert("Gagal mengubah radius.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan radius.");
    } finally {
      setSavingRadius(false);
    }
  };

  const handleUbahSesi = (hari, label, keyMulai, keySelesai) => {
    setModalSesi({
      visible: true,
      sesi: {
        hari,
        label,
        mulai: jamSesi[keyMulai],
        selesai: jamSesi[keySelesai],
      },
      keyMulai,
      keySelesai,
    });
  };

  const handleSimpanSesi = async ({ mulai, selesai }) => {
    setModalSesi((prev) => ({
      ...prev,
      visible: false,
    }));

    setSavingJam(true);
    console.log("DEBUG SIMPAN SESI:", {
      opdId,
      selectedOpdId,
      isSuperAdmin,
      opdAktif,
      keyMulai: modalSesi.keyMulai,
      keySelesai: modalSesi.keySelesai,
      mulai,
      selesai,
    });

    try {
      const r1 = await callApi("updateConfig", {
        opdId: opdAktif,
        key: modalSesi.keyMulai,
        value: mulai,
      });

      const r2 = await callApi("updateConfig", {
        opdId: opdAktif,
        key: modalSesi.keySelesai,
        value: selesai,
      });
      console.log("HASIL UPDATE SESI r1:", r1);
      console.log("HASIL UPDATE SESI r2:", r2);

      if (r1?.status === "berhasil" && r2?.status === "berhasil") {
        setJamSesi((prev) => ({
          ...prev,
          [modalSesi.keyMulai]: mulai,
          [modalSesi.keySelesai]: selesai,
        }));

        alert("Jam sesi berhasil diperbarui.");
      } else {
        alert("Gagal menyimpan jam sesi.");
      }
    } catch (error) {
      console.error("Gagal menyimpan jam sesi:", error);

      alert("Terjadi kesalahan saat menyimpan jam sesi.");
    } finally {
      setSavingJam(false);
    }
  };

  const handleSimpanLokasi = async (koordinatBaru) => {
    if (!koordinatBaru) {
      alert("Koordinat lokasi tidak valid.");
      return;
    }

    const konfirmasi = window.confirm(
      `Simpan lokasi kantor pada:\n\nLatitude: ${koordinatBaru.latitude}\nLongitude: ${koordinatBaru.longitude}?`,
    );

    if (!konfirmasi) return;

    setSavingLokasi(true);

    try {
      const r1 = await callApi("updateConfig", {
        opdId,
        key: "kantorLat",
        value: koordinatBaru.latitude,
      });

      const r2 = await callApi("updateConfig", {
        opdId,
        key: "kantorLng",
        value: koordinatBaru.longitude,
      });

      if (r1?.status === "berhasil" && r2?.status === "berhasil") {
        setKoordinatKantor(koordinatBaru);
        setShowPeta(false);

        alert("Lokasi kantor berhasil diperbarui.");
      } else {
        alert("Gagal menyimpan lokasi kantor.");
      }
    } catch (error) {
      console.error("Gagal menyimpan lokasi kantor:", error);
      alert("Terjadi kesalahan saat menyimpan lokasi kantor.");
    } finally {
      setSavingLokasi(false);
    }
  };

  const totalAbsen = absensiList.length;

  const totalApproved = absensiList.filter(
    (item) => item[6] === "APPROVED",
  ).length;

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

        {/* PILIH OPD - KHUSUS SUPERADMIN */}
        {isSuperAdmin && (
          <div className="p-5 mb-5 bg-white border shadow-sm rounded-2xl border-slate-200">
            <h2 className="text-base font-bold text-slate-800">
              🔐 Pilih Instansi
            </h2>

            <p className="mt-1 mb-4 text-xs text-slate-500">
              Superadmin dapat memilih OPD yang ingin dikelola.
            </p>

            <select
              value={selectedOpdId || ""}
              onChange={(e) => setSelectedOpdId(e.target.value)}
              disabled={loadingOpd}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {loadingOpd ? (
                <option value="">Memuat daftar OPD...</option>
              ) : (
                <>
                  <option value="">-- Pilih Instansi --</option>

                  {daftarOpd.map((opd) => (
                    <option key={opd.opd_id} value={opd.opd_id}>
                      {opd.nama_opd} ({opd.opd_id})
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        )}

        {/* IDENTITAS INSTANSI */}
        <div className="p-5 mb-5 bg-white border shadow-sm rounded-2xl border-slate-200">
          <h2 className="text-base font-bold text-slate-800">
            🏢 Identitas Instansi
          </h2>

          <p className="mt-1 mb-4 text-xs text-slate-500">
            Instansi yang digunakan oleh akun administrator ini.
          </p>

          <div className="p-3 border bg-slate-50 border-slate-200 rounded-xl">
            <p className="text-sm font-semibold text-slate-700">
              {namaOpd || "Memuat nama instansi..."}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              OPD ID: {opdId || "-"}
            </p>
          </div>
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

                const approved = item[6] === "APPROVED";

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 py-3 border-b border-slate-100 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate text-slate-700">
                        {item[1]}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {tanggalText}, {jam} • Sesi: {item[2]}
                      </p>
                    </div>

                    <span
                      className={`
                          text-xs
                          font-bold
                          ${approved ? "text-green-600" : "text-red-500"}
                        `}
                    >
                      {item[6]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RADIUS */}
        <div className="p-5 mb-5 bg-white border shadow-sm rounded-2xl border-slate-200">
          <h2 className="text-base font-bold text-slate-800">
            ⚙️ Pengaturan Radius
          </h2>

          <p className="mt-1 mb-4 text-xs text-slate-500">
            Atur jarak maksimal pegawai dari titik kantor untuk dapat melakukan
            absen.
          </p>

          <div className="flex items-center gap-2 mb-3">
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              placeholder="Contoh: 50"
              min="1"
              className="
                flex-1
                px-3
                py-2.5
                rounded-xl
                border
                border-slate-300
                bg-slate-50
                text-sm
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />

            <span className="text-sm text-slate-500">meter</span>
          </div>

          <button
            type="button"
            onClick={handleSimpanRadius}
            disabled={savingRadius}
            className="w-full py-3 text-sm font-bold text-white transition bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-xl"
          >
            {savingRadius ? "Menyimpan..." : "💾 Simpan Radius"}
          </button>
        </div>

        {/* LOKASI */}
        <div className="p-5 mb-5 bg-white border shadow-sm rounded-2xl border-slate-200">
          <h2 className="text-base font-bold text-slate-800">
            📍 Titik Lokasi Kantor
          </h2>

          <p className="mt-1 mb-4 text-xs text-slate-500">
            Atur titik koordinat kantor sebagai pusat radius absensi.
          </p>

          {koordinatKantor ? (
            <div className="p-3 mb-3 border bg-slate-50 border-slate-200 rounded-xl">
              <p className="text-xs text-slate-600">
                Lat:{" "}
                <span className="font-semibold">
                  {koordinatKantor.latitude.toFixed(7)}
                </span>
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Lng:{" "}
                <span className="font-semibold">
                  {koordinatKantor.longitude.toFixed(7)}
                </span>
              </p>
            </div>
          ) : (
            <div className="p-3 mb-3 border bg-slate-50 border-slate-200 rounded-xl">
              <p className="text-xs text-slate-400">
                Koordinat kantor belum tersedia.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowPeta(true)}
            className="w-full py-3 text-sm font-bold text-white transition bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            🗺️ Pilih di Peta
          </button>
        </div>

        {/* JAM SESI */}
        <div className="p-5 mb-5 bg-white border shadow-sm rounded-2xl border-slate-200">
          <h2 className="mb-4 text-base font-bold text-slate-800">
            🕐 Pengaturan Jam Sesi
          </h2>

          {savingJam && (
            <p className="mb-3 text-xs text-blue-600">
              Menyimpan perubahan jam...
            </p>
          )}

          <h3 className="mb-2 text-sm font-bold text-blue-600">
            Senin - Kamis
          </h3>

          <SesiRow
            label="Masuk"
            mulai={jamSesi.senin_masuk_mulai}
            selesai={jamSesi.senin_masuk_selesai}
            onUbah={() =>
              handleUbahSesi(
                "Senin - Kamis",
                "Masuk",
                "senin_masuk_mulai",
                "senin_masuk_selesai",
              )
            }
          />

          <SesiRow
            label="Istirahat"
            mulai={jamSesi.senin_istirahat_mulai}
            selesai={jamSesi.senin_istirahat_selesai}
            onUbah={() =>
              handleUbahSesi(
                "Senin - Kamis",
                "Istirahat",
                "senin_istirahat_mulai",
                "senin_istirahat_selesai",
              )
            }
          />

          <SesiRow
            label="Pulang"
            mulai={jamSesi.senin_pulang_mulai}
            selesai={jamSesi.senin_pulang_selesai}
            onUbah={() =>
              handleUbahSesi(
                "Senin - Kamis",
                "Pulang",
                "senin_pulang_mulai",
                "senin_pulang_selesai",
              )
            }
          />

          <h3 className="mt-5 mb-2 text-sm font-bold text-blue-600">Jumat</h3>

          <SesiRow
            label="Masuk"
            mulai={jamSesi.jumat_masuk_mulai}
            selesai={jamSesi.jumat_masuk_selesai}
            onUbah={() =>
              handleUbahSesi(
                "Jumat",
                "Masuk",
                "jumat_masuk_mulai",
                "jumat_masuk_selesai",
              )
            }
          />

          <SesiRow
            label="Istirahat"
            mulai={jamSesi.jumat_istirahat_mulai}
            selesai={jamSesi.jumat_istirahat_selesai}
            onUbah={() =>
              handleUbahSesi(
                "Jumat",
                "Istirahat",
                "jumat_istirahat_mulai",
                "jumat_istirahat_selesai",
              )
            }
          />

          <SesiRow
            label="Pulang"
            mulai={jamSesi.jumat_pulang_mulai}
            selesai={jamSesi.jumat_pulang_selesai}
            onUbah={() =>
              handleUbahSesi(
                "Jumat",
                "Pulang",
                "jumat_pulang_mulai",
                "jumat_pulang_selesai",
              )
            }
          />
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
            onClick={() => setShowExportModal(true)}
            className="w-full py-3 mb-3 text-sm font-bold text-white transition bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            📊 Export Rekap Bulan Ini
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
      <SesiModal
        visible={modalSesi.visible}
        sesi={modalSesi.sesi}
        onSimpan={handleSimpanSesi}
        onBatal={() =>
          setModalSesi((prev) => ({
            ...prev,
            visible: false,
          }))
        }
      />
      <PetaModal
        visible={showPeta}
        koordinatAwal={koordinatKantor}
        onSimpan={handleSimpanLokasi}
        onBatal={() => setShowPeta(false)}
      />
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
            });

            console.log("HASIL EXPORT:", result);

            if (result?.status === "berhasil") {
              alert(`File rekap berhasil dibuat:\n${result.namaFile}`);

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
