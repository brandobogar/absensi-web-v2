import { useEffect, useState } from "react";

// ============================================================
// KONVERSI TOTAL MENIT → JAM & MENIT
// ============================================================
const menitKeJam = (totalMenit) => {
  const nilai = Number(totalMenit) || 0;

  const jam = Math.floor(nilai / 60);
  const menit = nilai % 60;

  return {
    jam: String(jam).padStart(2, "0"),
    menit: String(menit).padStart(2, "0"),
  };
};

// ============================================================
// INPUT WAKTU
// Diletakkan DI LUAR SesiModal agar input tidak dibuat ulang
// setiap kali state berubah.
// ============================================================
const InputWaktu = ({
  labelJam,
  jam,
  setJam,
  menit,
  setMenit,
  disabled = false,
  error = false,
}) => {
  // ----------------------------------------------------------
  // PERUBAHAN INPUT JAM
  // ----------------------------------------------------------
  const handleJamChange = (e) => {
    const angka = e.target.value.replace(/\D/g, "").substring(0, 2);

    if (angka === "") {
      setJam("");
      return;
    }

    const nilai = parseInt(angka, 10);

    if (nilai > 23) {
      setJam("23");
      return;
    }

    setJam(angka);
  };

  // ----------------------------------------------------------
  // PERUBAHAN INPUT MENIT
  // ----------------------------------------------------------
  const handleMenitChange = (e) => {
    const angka = e.target.value.replace(/\D/g, "").substring(0, 2);

    if (angka === "") {
      setMenit("");
      return;
    }

    const nilai = parseInt(angka, 10);

    if (nilai > 59) {
      setMenit("59");
      return;
    }

    setMenit(angka);
  };

  // ----------------------------------------------------------
  // FORMAT SAAT SELESAI EDIT
  // 7 → 07
  // 8 → 08
  // ----------------------------------------------------------
  const formatJam = () => {
    if (jam !== "") {
      setJam(jam.padStart(2, "0"));
    }
  };

  const formatMenit = () => {
    if (menit !== "") {
      setMenit(menit.padStart(2, "0"));
    }
  };

  return (
    <div>
      {" "}
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {labelJam}{" "}
      </label>
      <div className="flex items-center justify-center gap-2">
        {/* JAM */}
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={2}
          value={jam}
          onChange={handleJamChange}
          onBlur={formatJam}
          placeholder="00"
          disabled={disabled}
          className={`
        w-20
        rounded-xl
        border
        bg-white
        px-3
        py-3
        text-center
        text-2xl
        font-bold
        text-slate-800
        outline-none
        transition
        ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }
        disabled:cursor-not-allowed
        disabled:bg-slate-100
        disabled:opacity-60
      `}
        />

        <span className="text-2xl font-bold text-slate-600">:</span>

        {/* MENIT */}
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={2}
          value={menit}
          onChange={handleMenitChange}
          onBlur={formatMenit}
          placeholder="00"
          disabled={disabled}
          className={`
        w-20
        rounded-xl
        border
        bg-white
        px-3
        py-3
        text-center
        text-2xl
        font-bold
        text-slate-800
        outline-none
        transition
        ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }
        disabled:cursor-not-allowed
        disabled:bg-slate-100
        disabled:opacity-60
      `}
        />
      </div>
    </div>
  );
};

// ============================================================
// SESI MODAL
// ============================================================
export default function SesiModal({ visible, sesi, onSimpan, onBatal }) {
  const [mulaiJam, setMulaiJam] = useState("07");
  const [mulaiMenit, setMulaiMenit] = useState("00");

  const [selesaiJam, setSelesaiJam] = useState("09");
  const [selesaiMenit, setSelesaiMenit] = useState("00");

  const [error, setError] = useState("");

  // ==========================================================
  // LOAD DATA SESI
  // ==========================================================
  useEffect(() => {
    if (visible && sesi) {
      const mulai = menitKeJam(sesi.mulai || 0);
      const selesai = menitKeJam(sesi.selesai || 0);

      setMulaiJam(mulai.jam);
      setMulaiMenit(mulai.menit);

      setSelesaiJam(selesai.jam);
      setSelesaiMenit(selesai.menit);

      setError("");
    }
  }, [visible, sesi]);

  // ==========================================================
  // SIMPAN
  // ==========================================================
  const handleSimpan = () => {
    setError("");

    // --------------------------------------------------------
    // Pastikan semua field terisi
    // --------------------------------------------------------
    if (
      mulaiJam === "" ||
      mulaiMenit === "" ||
      selesaiJam === "" ||
      selesaiMenit === ""
    ) {
      setError("Jam dan menit harus diisi.");
      return;
    }

    // --------------------------------------------------------
    // KONVERSI KE ANGKA
    // --------------------------------------------------------
    const jamMulai = parseInt(mulaiJam, 10);
    const menitMulai = parseInt(mulaiMenit, 10);

    const jamSelesai = parseInt(selesaiJam, 10);
    const menitSelesai = parseInt(selesaiMenit, 10);

    // --------------------------------------------------------
    // VALIDASI JAM MULAI
    // --------------------------------------------------------
    if (Number.isNaN(jamMulai) || jamMulai < 0 || jamMulai > 23) {
      setError("Jam mulai harus berada antara 00 sampai 23.");
      return;
    }

    // --------------------------------------------------------
    // VALIDASI JAM SELESAI
    // --------------------------------------------------------
    if (Number.isNaN(jamSelesai) || jamSelesai < 0 || jamSelesai > 23) {
      setError("Jam selesai harus berada antara 00 sampai 23.");
      return;
    }

    // --------------------------------------------------------
    // VALIDASI MENIT MULAI
    // --------------------------------------------------------
    if (Number.isNaN(menitMulai) || menitMulai < 0 || menitMulai > 59) {
      setError("Menit mulai harus berada antara 00 sampai 59.");
      return;
    }

    // --------------------------------------------------------
    // VALIDASI MENIT SELESAI
    // --------------------------------------------------------
    if (Number.isNaN(menitSelesai) || menitSelesai < 0 || menitSelesai > 59) {
      setError("Menit selesai harus berada antara 00 sampai 59.");
      return;
    }

    // --------------------------------------------------------
    // KONVERSI KE TOTAL MENIT
    // --------------------------------------------------------
    const totalMulai = jamMulai * 60 + menitMulai;

    const totalSelesai = jamSelesai * 60 + menitSelesai;

    // --------------------------------------------------------
    // VALIDASI URUTAN WAKTU
    // --------------------------------------------------------
    if (totalMulai >= totalSelesai) {
      setError("Jam mulai harus lebih awal dari jam selesai!");
      return;
    }

    // --------------------------------------------------------
    // KIRIM KE BACKEND
    // Struktur tetap:
    // mulai = total menit
    // selesai = total menit
    // --------------------------------------------------------
    onSimpan({
      mulai: totalMulai,
      selesai: totalSelesai,
    });
  };

  if (!visible || !sesi) {
    return null;
  }

  return (
    <div
      className="
fixed
inset-0
z-[100]
flex
items-center
justify-center
bg-black/50
px-4
"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onBatal();
        }
      }}
    >
      {" "}
      <div
        className="
       w-full
       max-w-md
       overflow-hidden
       rounded-2xl
       bg-white
       shadow-2xl
     "
      >
        {/* HEADER */}{" "}
        <div className="border-b border-slate-200 px-5 py-4">
          {" "}
          <h2 className="text-center text-lg font-bold text-slate-800">
            Ubah Jam {sesi.label}{" "}
          </h2>
          <p className="mt-1 text-center text-sm text-slate-500">{sesi.hari}</p>
        </div>
        {/* CONTENT */}
        <div className="p-5">
          {/* JAM MULAI */}
          <div className="mb-5">
            <InputWaktu
              labelJam="Jam Mulai"
              jam={mulaiJam}
              setJam={setMulaiJam}
              menit={mulaiMenit}
              setMenit={setMulaiMenit}
              error={Boolean(error)}
            />
          </div>

          {/* JAM SELESAI */}
          <div className="mb-5">
            <InputWaktu
              labelJam="Jam Selesai"
              jam={selesaiJam}
              setJam={setSelesaiJam}
              menit={selesaiMenit}
              setMenit={setSelesaiMenit}
              error={Boolean(error)}
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
              <p className="text-center text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* BUTTON */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBatal}
              className="
            flex-1
            rounded-xl
            bg-slate-100
            px-4
            py-3
            text-sm
            font-bold
            text-slate-600
            transition
            hover:bg-slate-200
          "
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSimpan}
              className="
            flex-1
            rounded-xl
            bg-blue-600
            px-4
            py-3
            text-sm
            font-bold
            text-white
            transition
            hover:bg-blue-700
          "
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
