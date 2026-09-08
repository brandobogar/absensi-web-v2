import { useEffect, useState } from "react";

const menitKeJam = (menit) => {
  const nilai = Number(menit) || 0;

  const jam = Math.floor(nilai / 60);
  const menitSisa = nilai % 60;

  return `${String(jam).padStart(2, "0")}:${String(menitSisa).padStart(
    2,
    "0",
  )}`;
};

const jamKeMenit = (jam) => {
  if (!jam || !jam.includes(":")) {
    return null;
  }

  const [jamBagian, menitBagian] = jam.split(":").map(Number);

  if (Number.isNaN(jamBagian) || Number.isNaN(menitBagian)) {
    return null;
  }

  if (jamBagian < 0 || jamBagian > 23 || menitBagian < 0 || menitBagian > 59) {
    return null;
  }

  return jamBagian * 60 + menitBagian;
};

export default function SesiModal({ visible, sesi, onSimpan, onBatal }) {
  const [mulai, setMulai] = useState("");
  const [selesai, setSelesai] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!visible || !sesi) {
      return;
    }

    setMulai(menitKeJam(sesi.mulai));
    setSelesai(menitKeJam(sesi.selesai));
    setError("");
  }, [visible, sesi]);

  if (!visible || !sesi) {
    return null;
  }

  const handleSimpan = () => {
    setError("");

    const menitMulai = jamKeMenit(mulai);
    const menitSelesai = jamKeMenit(selesai);

    if (menitMulai === null) {
      setError("Jam mulai tidak valid. Gunakan format HH:MM.");
      return;
    }

    if (menitSelesai === null) {
      setError("Jam selesai tidak valid. Gunakan format HH:MM.");
      return;
    }

    if (menitMulai >= menitSelesai) {
      setError("Jam mulai harus lebih kecil dari jam selesai.");
      return;
    }

    onSimpan({
      mulai: menitMulai,
      selesai: menitSelesai,
    });
  };

  const handleInputJam = (value, setter) => {
    // Hanya angka dan titik dua
    let hasil = value.replace(/[^\d:]/g, "");

    // Maksimal 5 karakter: HH:MM
    hasil = hasil.slice(0, 5);

    setter(hasil);

    if (error) {
      setError("");
    }
  };

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
      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-2xl
          shadow-2xl
          overflow-hidden
        "
      >
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Ubah Jam Sesi</h2>

          <p className="text-sm text-slate-500 mt-1">
            {sesi.hari} • {sesi.label}
          </p>
        </div>

        {/* CONTENT */}
        <div className="p-5">
          {/* JAM MULAI */}
          <div className="mb-4">
            <label
              htmlFor="jam-mulai"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Jam Mulai
            </label>

            <input
              id="jam-mulai"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={mulai}
              onChange={(e) => handleInputJam(e.target.value, setMulai)}
              placeholder="07:00"
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-slate-300
                bg-white
                text-base
                text-slate-800
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />

            <p className="text-xs text-slate-400 mt-1">Format: HH:MM</p>
          </div>

          {/* JAM SELESAI */}
          <div className="mb-4">
            <label
              htmlFor="jam-selesai"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Jam Selesai
            </label>

            <input
              id="jam-selesai"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={selesai}
              onChange={(e) => handleInputJam(e.target.value, setSelesai)}
              placeholder="09:00"
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-slate-300
                bg-white
                text-base
                text-slate-800
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />

            <p className="text-xs text-slate-400 mt-1">Format: HH:MM</p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-3 py-2">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* BUTTON */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBatal}
              className="
                flex-1
                py-3
                rounded-xl
                bg-slate-100
                hover:bg-slate-200
                text-slate-700
                text-sm
                font-semibold
                transition
              "
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSimpan}
              className="
                flex-1
                py-3
                rounded-xl
                bg-blue-600
                hover:bg-blue-700
                text-white
                text-sm
                font-bold
                transition
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
