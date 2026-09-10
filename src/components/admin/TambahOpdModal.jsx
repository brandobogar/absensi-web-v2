import { useEffect, useState } from "react";
import PetaModal from "./PetaModal";

export default function TambahOpdModal({
  visible,
  onSimpan,
  onBatal,
  saving,
}) {
  const [namaOpd, setNamaOpd] = useState("");
  const [radius, setRadius] = useState("100");
  const [koordinat, setKoordinat] = useState(null);

  const [showPeta, setShowPeta] = useState(false);

  // =====================================================
  // RESET FORM SAAT MODAL DIBUKA
  // =====================================================
  useEffect(() => {
    if (!visible) return;

    setNamaOpd("");
    setRadius("100");
    setKoordinat(null);
    setShowPeta(false);
  }, [visible]);

  // =====================================================
  // SIMPAN
  // =====================================================
  const handleSimpan = () => {
    const nama = namaOpd.trim();
    const nilaiRadius = Number(radius);

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
      nilaiRadius <= 0
    ) {
      alert("Masukkan radius yang valid.");
      return;
    }

    onSimpan({
      namaOpd: nama,
      kantorLat: koordinat.latitude,
      kantorLng: koordinat.longitude,
      radius: nilaiRadius,
    });
  };

  // =====================================================
  // HASIL DARI PETA
  // =====================================================
  const handleSimpanLokasi = (lokasiBaru) => {
    if (!lokasiBaru) return;

    setKoordinat({
      latitude: lokasiBaru.latitude,
      longitude: lokasiBaru.longitude,
    });

    setShowPeta(false);
  };

  // =====================================================
  // BATAL
  // =====================================================
  const handleBatal = () => {
    if (saving) return;

    setNamaOpd("");
    setRadius("100");
    setKoordinat(null);
    setShowPeta(false);

    onBatal();
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      <div
        className="
          fixed
          inset-0
          z-[1000]
          bg-black/50
          overflow-y-auto
        "
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            e.preventDefault();
          }
        }}
      >
        <div className="flex items-center justify-center min-h-full p-5">
          <div
            className="
              w-full
              max-w-md
              bg-white
              rounded-[20px]
              shadow-xl
              p-6
            "
          >
            {/* JUDUL */}
            <h2 className="mb-5 text-lg font-bold text-center text-slate-800">
              Tambah OPD Baru
            </h2>

            {/* NAMA OPD */}
            <label
              htmlFor="tambah-opd-nama"
              className="
                block
                text-[13px]
                font-medium
                text-slate-700
                mb-1.5
              "
            >
              Nama OPD
            </label>

            <input
              id="tambah-opd-nama"
              type="text"
              value={namaOpd}
              onChange={(e) => setNamaOpd(e.target.value)}
              placeholder="Contoh: Dinas Sosial"
              disabled={saving}
              className="
                w-full
                border
                border-slate-300
                rounded-[10px]
                px-3
                py-3
                text-sm
                bg-slate-50
                text-slate-700
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
                mb-4
                disabled:opacity-60
              "
            />

            {/* LOKASI */}
            <label
              className="
                block
                text-[13px]
                font-medium
                text-slate-700
                mb-1.5
              "
            >
              Lokasi Kantor
            </label>

            {koordinat ? (
              <div className="p-3 mb-3 border bg-slate-50 border-slate-200 rounded-xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      📍 Lokasi kantor dipilih
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
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 mb-3 border bg-slate-50 border-slate-200 rounded-xl">
                <p className="text-xs text-slate-400">
                  Lokasi kantor belum dipilih.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowPeta(true)}
              disabled={saving}
              className="
                w-full
                py-3
                mb-4
                rounded-xl
                border
                border-blue-200
                bg-blue-50
                hover:bg-blue-100
                disabled:opacity-60
                text-blue-600
                text-sm
                font-bold
                transition
              "
            >
              🗺️ {koordinat ? "Ubah Lokasi di Peta" : "Pilih Lokasi di Peta"}
            </button>

            {/* RADIUS */}
            <label
              htmlFor="tambah-opd-radius"
              className="
                block
                text-[13px]
                font-medium
                text-slate-700
                mb-1.5
              "
            >
              Radius Absensi
            </label>

            <div className="flex items-center gap-2 mb-5">
              <input
                id="tambah-opd-radius"
                type="number"
                min="1"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder="Contoh: 200"
                disabled={saving}
                className="
                  flex-1
                  border
                  border-slate-300
                  rounded-[10px]
                  px-3
                  py-3
                  text-sm
                  bg-slate-50
                  text-slate-700
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                  disabled:opacity-60
                "
              />

              <span className="text-sm text-slate-500">
                meter
              </span>
            </div>

            {/* INFO */}
            <div className="p-3 mb-5 text-xs text-slate-500 bg-blue-50 rounded-xl">
              ℹ️ Jam sesi absensi akan menggunakan pengaturan
              default sistem dan dapat diubah setelah OPD dibuat.
            </div>

            {/* BUTTON */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBatal}
                disabled={saving}
                className="
                  flex-1
                  bg-slate-100
                  hover:bg-slate-200
                  disabled:opacity-60
                  rounded-xl
                  py-3.5
                  text-slate-500
                  font-bold
                  text-sm
                  transition
                "
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSimpan}
                disabled={saving}
                className="
                  flex-1
                  bg-blue-600
                  hover:bg-blue-700
                  disabled:bg-blue-400
                  rounded-xl
                  py-3.5
                  text-white
                  font-bold
                  text-sm
                  transition
                "
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
    </>
  );
}