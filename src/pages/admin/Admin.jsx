import { useEffect, useState } from "react";
import { callApi } from "../../api";
import SesiModal from "../../components/admin/SesiModal";
import PetaModal from "../../components/admin/PetaModal";

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

        <p className="text-xs text-slate-500 mt-1">
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

export default function Admin({ onLogout, onManajemenPegawai }) {
  const [absensiList, setAbsensiList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [radius, setRadius] = useState("");
  const [koordinatKantor, setKoordinatKantor] = useState(null);

  const [showPeta, setShowPeta] = useState(false);

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

  const fetchConfig = async () => {
    try {
      const result = await callApi("getConfig", {});

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
    fetchAbsensiAdmin();
    fetchConfig();
  }, []);

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

    try {
      const r1 = await callApi("updateConfig", {
        key: modalSesi.keyMulai,
        value: mulai,
      });

      const r2 = await callApi("updateConfig", {
        key: modalSesi.keySelesai,
        value: selesai,
      });

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
        key: "kantorLat",
        value: koordinatBaru.latitude,
      });

      const r2 = await callApi("updateConfig", {
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-5">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            Dashboard Admin
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Sistem Absensi PPPK Inspektorat
          </p>
        </div>

        {/* STATISTIK */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-3xl font-bold text-blue-600">{totalAbsen}</p>

            <p className="text-xs text-slate-500 mt-1">Absen Hari Ini</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-3xl font-bold text-green-600">{totalApproved}</p>

            <p className="text-xs text-slate-500 mt-1">Approved</p>
          </div>
        </div>

        {/* ABSENSI HARI INI */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-5">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">
              Absensi Hari Ini
            </h2>

            <button
              type="button"
              onClick={fetchAbsensiAdmin}
              disabled={loading}
              className="
                text-xs
                font-semibold
                text-blue-600
                hover:text-blue-700
                disabled:opacity-50
              "
            >
              {loading ? "Memuat..." : "↻ Refresh"}
            </button>
          </div>

          {loading && absensiList.length === 0 ? (
            <div className="py-8 text-center">
              <div className="w-7 h-7 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

              <p className="text-xs text-slate-500 mt-3">Memuat data...</p>
            </div>
          ) : absensiList.length === 0 ? (
            <p className="text-sm text-center text-slate-400 py-8">
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
                    className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        py-3
                        border-b
                        border-slate-100
                        last:border-b-0
                      "
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">
                        {item[1]}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-5">
          <h2 className="text-base font-bold text-slate-800">
            ⚙️ Pengaturan Radius
          </h2>

          <p className="text-xs text-slate-500 mt-1 mb-4">
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
            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              disabled:opacity-60
              text-white
              rounded-xl
              py-3
              text-sm
              font-bold
              transition
            "
          >
            {savingRadius ? "Menyimpan..." : "💾 Simpan Radius"}
          </button>
        </div>

        {/* LOKASI */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-5">
          <h2 className="text-base font-bold text-slate-800">
            📍 Titik Lokasi Kantor
          </h2>

          <p className="text-xs text-slate-500 mt-1 mb-4">
            Atur titik koordinat kantor sebagai pusat radius absensi.
          </p>

          {koordinatKantor ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3">
              <p className="text-xs text-slate-600">
                Lat:{" "}
                <span className="font-semibold">
                  {koordinatKantor.latitude.toFixed(7)}
                </span>
              </p>

              <p className="text-xs text-slate-600 mt-1">
                Lng:{" "}
                <span className="font-semibold">
                  {koordinatKantor.longitude.toFixed(7)}
                </span>
              </p>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3">
              <p className="text-xs text-slate-400">
                Koordinat kantor belum tersedia.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowPeta(true)}
            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              rounded-xl
              py-3
              text-sm
              font-bold
              transition
            "
          >
            🗺️ Pilih di Peta
          </button>
        </div>

        {/* JAM SESI */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-5">
          <h2 className="text-base font-bold text-slate-800 mb-4">
            🕐 Pengaturan Jam Sesi
          </h2>

          {savingJam && (
            <p className="text-xs text-blue-600 mb-3">
              Menyimpan perubahan jam...
            </p>
          )}

          <h3 className="text-sm font-bold text-blue-600 mb-2">
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

          <h3 className="text-sm font-bold text-blue-600 mt-5 mb-2">Jumat</h3>

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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-5">
          <h2 className="text-base font-bold text-slate-800 mb-4">Aksi</h2>

          <button
            type="button"
            onClick={onManajemenPegawai}
            className="
              w-full
              bg-green-50
              hover:bg-green-100
              border
              border-green-200
              text-green-700
              rounded-xl
              py-3
              text-sm
              font-bold
              transition
              mb-3
            "
          >
            👥 Manajemen Pegawai
          </button>

          <button
            type="button"
            onClick={() =>
              alert(
                "Fitur export akan kita sambungkan setelah halaman Admin selesai.",
              )
            }
            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              rounded-xl
              py-3
              text-sm
              font-bold
              transition
              mb-3
            "
          >
            📊 Export Rekap Bulan Ini
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="
              w-full
              bg-slate-100
              hover:bg-slate-200
              text-red-600
              rounded-xl
              py-3
              text-sm
              font-bold
              transition
            "
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
    </div>
  );
}
