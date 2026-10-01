import { useEffect, useState } from "react";
import PetaModal from "./PetaModal";
import SesiModal from "./SesiModal";

// ============================================================
// DAFTAR SESI
// Kunci mengikuti nama kolom di sheet config.
// ============================================================
const DAFTAR_SESI = [
  {
    hari: "Senin - Kamis",
    label: "Masuk",
    mulai: "senin_masuk_mulai",
    selesai: "senin_masuk_selesai",
  },
  {
    hari: "Senin - Kamis",
    label: "Istirahat",
    mulai: "senin_istirahat_mulai",
    selesai: "senin_istirahat_selesai",
  },
  {
    hari: "Senin - Kamis",
    label: "Pulang",
    mulai: "senin_pulang_mulai",
    selesai: "senin_pulang_selesai",
  },
  {
    hari: "Jumat",
    label: "Masuk",
    mulai: "jumat_masuk_mulai",
    selesai: "jumat_masuk_selesai",
  },
  {
    hari: "Jumat",
    label: "Istirahat",
    mulai: "jumat_istirahat_mulai",
    selesai: "jumat_istirahat_selesai",
  },
  {
    hari: "Jumat",
    label: "Pulang",
    mulai: "jumat_pulang_mulai",
    selesai: "jumat_pulang_selesai",
  },
];

const KUNCI_SESI = DAFTAR_SESI.flatMap((s) => [s.mulai, s.selesai]);

const HARI_SESI = ["Senin - Kamis", "Jumat"];

const PILIHAN_JABATAN = [
  "Sekretaris Daerah",
  "Kepala Dinas",
  "Kepala Badan",
  "Inspektur Daerah",
  "Kepala Satuan",
  "Kepala Pelaksana",
];

const PILIHAN_PANGKAT = [
  "Penata Tingkat I/III-d",
  "Pembina/IV-a",
  "Pembina Tingkat I/IV-b",
  "Pembina Utama Muda/IV-c",
  "Pembina Utama Madya/IV-d",
  "Pembina Utama/IV-e",
];

// ============================================================
// TOTAL MENIT -> "HH:MM"
// ============================================================
const menitKeJam = (menit) => {
  const nilai = Number(menit) || 0;

  const jam = Math.floor(nilai / 60);
  const sisa = nilai % 60;

  return `${String(jam).padStart(2, "0")}:${String(sisa).padStart(2, "0")}`;
};

// ============================================================
// NILAI AWAL DARI DATA OPD + CONFIG
// ============================================================
const bacaKoordinat = (opd) => {
  const lat = Number(opd?.kantorLat);
  const lng = Number(opd?.kantorLng);

  if (
    opd?.kantorLat == null ||
    opd?.kantorLng == null ||
    Number.isNaN(lat) ||
    Number.isNaN(lng)
  ) {
    return null;
  }

  return { latitude: lat, longitude: lng };
};

const bacaSesi = (config) => {
  const hasil = {};

  KUNCI_SESI.forEach((kunci) => {
    hasil[kunci] = Number(config?.[kunci]);
  });

  return hasil;
};

// ============================================================
// EDIT OPD MODAL
//
// Props:
//   visible  : modal tampil atau tidak
//   opd      : data OPD dari daftar (opd_id, nama_opd, radius,
//              kantorLat, kantorLng)
//   config   : hasil getConfig untuk OPD ini (jam sesi)
//   onSimpan : ({ opdId, namaOpd, namaBerubah, dataConfig }) => void
//              dataConfig hanya berisi kolom yang berubah
//   onBatal  : () => void
//   saving   : true saat proses simpan berjalan
// ============================================================
const formatNip = (value) => {
  const angka = value.replace(/\D/g, "").slice(0, 18);

  if (angka.length <= 8) {
    return angka;
  }

  if (angka.length <= 14) {
    return `${angka.slice(0, 8)} ${angka.slice(8)}`;
  }

  if (angka.length <= 15) {
    return `${angka.slice(0, 8)} ${angka.slice(8, 14)} ${angka.slice(14)}`;
  }

  return `${angka.slice(0, 8)} ${angka.slice(8, 14)} ${angka.slice(
    14,
    15,
  )} ${angka.slice(15, 18)}`;
};

export default function EditOpdModal({
  visible,
  opd,
  config,
  profil,
  onSimpan,
  onBatal,
  saving,
}) {
  const [namaOpd, setNamaOpd] = useState("");
  const [radius, setRadius] = useState("");
  const [koordinat, setKoordinat] = useState(null);
  const [sesi, setSesi] = useState({});

  const [lokasi, setLokasi] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [namaPimpinan, setNamaPimpinan] = useState("");
  const [pangkat, setPangkat] = useState("");
  const [nip, setNip] = useState("");

  const [showPeta, setShowPeta] = useState(false);

  const [modalSesi, setModalSesi] = useState({
    visible: false,
    sesi: null,
    keyMulai: "",
    keySelesai: "",
  });

  // ==========================================================
  // ISI FORM SAAT MODAL DIBUKA
  // ==========================================================
  useEffect(() => {
    if (!visible) return;

    setNamaOpd(opd?.nama_opd || "");
    setRadius(opd?.radius != null ? String(opd.radius) : "");
    setKoordinat(bacaKoordinat(opd));
    setSesi(bacaSesi(config));

    setLokasi(profil?.lokasi || "");
    setJabatan(profil?.jabatan || "");
    setNamaPimpinan(profil?.nama_pimpinan || "");
    setPangkat(profil?.pangkat || "");
    setNip(profil?.nip || "");

    setShowPeta(false);
    setModalSesi({
      visible: false,
      sesi: null,
      keyMulai: "",
      keySelesai: "",
    });
  }, [visible, opd, config, profil]);

  // ==========================================================
  // HASIL DARI PETA
  // ==========================================================
  const handleSimpanLokasi = (lokasiBaru) => {
    if (!lokasiBaru) return;

    setKoordinat({
      latitude: lokasiBaru.latitude,
      longitude: lokasiBaru.longitude,
    });

    setShowPeta(false);
  };

  // ==========================================================
  // BUKA DAN SIMPAN JAM SESI
  // ==========================================================
  const handleUbahSesi = (item) => {
    setModalSesi({
      visible: true,
      sesi: {
        hari: item.hari,
        label: item.label,
        mulai: sesi[item.mulai],
        selesai: sesi[item.selesai],
      },
      keyMulai: item.mulai,
      keySelesai: item.selesai,
    });
  };

  const handleSimpanSesi = ({ mulai, selesai }) => {
    setSesi((sebelumnya) => ({
      ...sebelumnya,
      [modalSesi.keyMulai]: mulai,
      [modalSesi.keySelesai]: selesai,
    }));

    setModalSesi({
      visible: false,
      sesi: null,
      keyMulai: "",
      keySelesai: "",
    });
  };

  // ==========================================================
  // SIMPAN
  // ==========================================================
  const handleSimpan = () => {
    const nama = namaOpd.trim();
    const nilaiRadius = Number(radius);

    const lokasiBersih = lokasi.trim();
    const jabatanBersih = jabatan.trim();
    const namaPimpinanBersih = namaPimpinan.trim();
    const pangkatBersih = pangkat.trim();
    const nipBersih = nip.replace(/\D/g, "");

    // ==========================================================
    // VALIDASI DATA OPD
    // ==========================================================

    if (!nama) {
      alert("Nama OPD wajib diisi.");
      return;
    }

    if (!koordinat) {
      alert("Silakan pilih lokasi kantor di peta.");
      return;
    }

    if (
      !radius ||
      Number.isNaN(nilaiRadius) ||
      nilaiRadius < 1 ||
      nilaiRadius > 5000
    ) {
      alert("Radius harus berupa angka antara 1 dan 5000 meter.");
      return;
    }

    // ==========================================================
    // VALIDASI PROFIL PIMPINAN
    // ==========================================================

    if (!lokasiBersih) {
      alert("Lokasi wajib diisi.");
      return;
    }

    if (!jabatanBersih) {
      alert("Jabatan pimpinan wajib dipilih.");
      return;
    }

    if (!namaPimpinanBersih) {
      alert("Nama pimpinan wajib diisi.");
      return;
    }

    if (!pangkatBersih) {
      alert("Pangkat / Golongan wajib dipilih.");
      return;
    }

    if (nipBersih.length !== 18) {
      alert("NIP harus terdiri dari 18 digit.");
      return;
    }

    // ==========================================================
    // DATA CONFIG YANG BERUBAH
    // ==========================================================

    const dataConfig = {};

    if (nilaiRadius !== Number(opd?.radius)) {
      dataConfig.radius = nilaiRadius;
    }

    if (koordinat.latitude !== Number(opd?.kantorLat)) {
      dataConfig.kantorLat = koordinat.latitude;
    }

    if (koordinat.longitude !== Number(opd?.kantorLng)) {
      dataConfig.kantorLng = koordinat.longitude;
    }

    KUNCI_SESI.forEach((kunci) => {
      if (sesi[kunci] !== Number(config?.[kunci])) {
        dataConfig[kunci] = sesi[kunci];
      }
    });

    // ==========================================================
    // DATA PROFIL YANG BERUBAH
    // ==========================================================

    const dataProfil = {};

    if (lokasiBersih !== String(profil?.lokasi || "").trim()) {
      dataProfil.lokasi = lokasiBersih;
    }

    if (jabatanBersih !== String(profil?.jabatan || "").trim()) {
      dataProfil.jabatan = jabatanBersih;
    }

    if (namaPimpinanBersih !== String(profil?.nama_pimpinan || "").trim()) {
      dataProfil.nama_pimpinan = namaPimpinanBersih;
    }

    if (pangkatBersih !== String(profil?.pangkat || "").trim()) {
      dataProfil.pangkat = pangkatBersih;
    }

    const nipLama = String(profil?.nip || "").replace(/\D/g, "");

    if (nipBersih !== nipLama) {
      dataProfil.nip = formatNip(nipBersih);
    }

    // ==========================================================
    // NAMA OPD
    // ==========================================================

    const namaBerubah = nama !== String(opd?.nama_opd || "").trim();

    const adaConfig = Object.keys(dataConfig).length > 0;

    const adaProfil = Object.keys(dataProfil).length > 0;

    // ==========================================================
    // TIDAK ADA PERUBAHAN
    // ==========================================================

    if (!namaBerubah && !adaConfig && !adaProfil) {
      onBatal();
      return;
    }

    // ==========================================================
    // KIRIM KE PARENT
    // ==========================================================

    onSimpan({
      opdId: opd?.opd_id,
      namaOpd: nama,
      namaBerubah,
      dataConfig,
      dataProfil,
    });
  };

  const handleBatal = () => {
    if (saving) return;

    onBatal();
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-[1000] overflow-y-auto bg-black/50">
        <div className="flex items-center justify-center min-h-full p-5">
          <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-[20px]">
            <h2 className="mb-5 text-lg font-bold text-center text-slate-800">
              Edit OPD
            </h2>

            {/* ID OPD */}
            <div className="mb-4">
              <p className="mb-1.5 text-[13px] font-medium text-slate-500">
                ID OPD
              </p>

              <div className="w-full px-3 py-3 text-sm border bg-slate-100 border-slate-200 rounded-[10px] text-slate-500">
                {opd?.opd_id || "-"}
              </div>
            </div>

            {/* NAMA */}
            <div className="mb-5">
              <label
                htmlFor="edit-opd-nama"
                className="block mb-1.5 text-[13px] font-medium text-slate-700"
              >
                Nama OPD
              </label>

              <input
                id="edit-opd-nama"
                type="text"
                value={namaOpd}
                onChange={(e) => setNamaOpd(e.target.value)}
                placeholder="Masukkan nama OPD"
                disabled={saving}
                className="w-full px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              />
            </div>
            <div className="pt-4 mb-5 border-t border-slate-100">
              <p className="mb-4 text-sm font-bold text-slate-700">
                Profil Pimpinan
              </p>

              <div className="mb-4">
                <label className="block mb-1.5 text-[13px] font-medium text-slate-700">
                  Lokasi
                </label>

                <input
                  type="text"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  placeholder="Contoh: Tahuna"
                  disabled={saving}
                  className="w-full px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1.5 text-[13px] font-medium text-slate-700">
                  Jabatan Pimpinan
                </label>

                <select
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  disabled={saving}
                  className="w-full px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                >
                  <option value="">Pilih jabatan</option>

                  {PILIHAN_JABATAN.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-1.5 text-[13px] font-medium text-slate-700">
                  Nama Pimpinan
                </label>

                <input
                  type="text"
                  value={namaPimpinan}
                  onChange={(e) => setNamaPimpinan(e.target.value)}
                  placeholder="Nama lengkap"
                  disabled={saving}
                  className="w-full px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1.5 text-[13px] font-medium text-slate-700">
                  Pangkat / Golongan
                </label>

                <select
                  value={pangkat}
                  onChange={(e) => setPangkat(e.target.value)}
                  disabled={saving}
                  className="w-full px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                >
                  <option value="">Pilih pangkat / golongan</option>

                  {PILIHAN_PANGKAT.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1.5 text-[13px] font-medium text-slate-700">
                  NIP
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  value={nip}
                  onChange={(e) => setNip(formatNip(e.target.value))}
                  placeholder="Contoh: 19700101 199001 1 001"
                  disabled={saving}
                  className="w-full px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                />
              </div>
            </div>

            {/* LOKASI */}
            <p className="mb-1.5 text-[13px] font-medium text-slate-700">
              Lokasi Kantor
            </p>

            <div className="p-3 mb-3 border bg-slate-50 border-slate-200 rounded-xl">
              {koordinat ? (
                <>
                  <p className="text-xs font-semibold text-slate-700">
                    📍 Lokasi kantor
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Lat:{" "}
                    <span className="font-semibold text-slate-700">
                      {koordinat.latitude.toFixed(7)}
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Lng:{" "}
                    <span className="font-semibold text-slate-700">
                      {koordinat.longitude.toFixed(7)}
                    </span>
                  </p>
                </>
              ) : (
                <p className="text-xs text-slate-400">
                  Lokasi kantor belum dipilih.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowPeta(true)}
              disabled={saving}
              className="w-full py-3 mb-4 text-sm font-bold text-blue-600 transition border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 disabled:opacity-60"
            >
              🗺️ {koordinat ? "Ubah Lokasi di Peta" : "Pilih Lokasi di Peta"}
            </button>

            {/* RADIUS */}
            <label
              htmlFor="edit-opd-radius"
              className="block mb-1.5 text-[13px] font-medium text-slate-700"
            >
              Radius Absensi
            </label>

            <div className="flex items-center gap-2 mb-5">
              <input
                id="edit-opd-radius"
                type="number"
                min="1"
                max="5000"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="Contoh: 200"
                disabled={saving}
                className="flex-1 px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              />

              <span className="text-sm text-slate-500">meter</span>
            </div>

            {/* JAM SESI */}
            <p className="mb-1 text-[13px] font-medium text-slate-700">
              Jam Sesi Absensi
            </p>

            {HARI_SESI.map((hari) => (
              <div key={hari} className="mb-3">
                <h3 className="mt-2 mb-1 text-sm font-bold text-blue-600">
                  {hari}
                </h3>

                {DAFTAR_SESI.filter((item) => item.hari === hari).map(
                  (item) => (
                    <div
                      key={item.mulai}
                      className="flex items-center justify-between py-2.5 border-b border-slate-100"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {item.label}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {menitKeJam(sesi[item.mulai])} -{" "}
                          {menitKeJam(sesi[item.selesai])}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUbahSesi(item)}
                        disabled={saving}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-600 transition border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 disabled:opacity-60"
                      >
                        Ubah
                      </button>
                    </div>
                  ),
                )}
              </div>
            ))}

            {/* TOMBOL */}
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={handleBatal}
                disabled={saving}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 rounded-xl text-slate-500 font-bold text-sm transition"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSimpan}
                disabled={saving}
                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl text-white font-bold text-sm transition"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PETA */}
      <PetaModal
        visible={showPeta}
        koordinatAwal={koordinat}
        onSimpan={handleSimpanLokasi}
        onBatal={() => setShowPeta(false)}
      />

      {/* JAM SESI */}
      <SesiModal
        visible={modalSesi.visible}
        sesi={modalSesi.sesi}
        onSimpan={handleSimpanSesi}
        onBatal={() =>
          setModalSesi({
            visible: false,
            sesi: null,
            keyMulai: "",
            keySelesai: "",
          })
        }
      />
    </>
  );
}
