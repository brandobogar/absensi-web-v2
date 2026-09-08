import { useEffect, useState } from "react";

export default function EditPegawaiModal({
  visible,
  pegawai,
  onSimpan,
  onBatal,
  saving,
}) {
  const [nama, setNama] = useState("");
  const [nip, setNip] = useState("");

  // Isi form setiap kali pegawai yang diedit berubah
  useEffect(() => {
    if (pegawai) {
      setNama(String(pegawai.nama || ""));
      setNip(String(pegawai.nip || ""));
    }
  }, [pegawai]);

  const handleSimpan = () => {
    const namaBersih = String(nama || "").trim();
    const nipBersih = String(nip || "").trim();

    if (!namaBersih) {
      alert("Nama lengkap wajib diisi!");
      return;
    }

    onSimpan({
      username: pegawai.username,
      nama: namaBersih,
      nip: nipBersih,
    });
  };

  const handleBatal = () => {
    if (saving) return;

    setNama("");
    setNip("");
    onBatal();
  };

  // Jangan tampilkan modal kalau belum ada pegawai
  if (!pegawai || !visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        {/* TITLE */}
        <h2 className="mb-5 text-center text-lg font-bold text-gray-800">
          Edit Data Pegawai
        </h2>

        {/* NAMA */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Nama Lengkap
          </label>

          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama Lengkap"
            disabled={saving}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* NIP */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            NIP
          </label>

          <input
            type="text"
            value={nip}
            onChange={(e) => {
              // Hanya angka
              setNip(e.target.value.replace(/[^0-9]/g, ""));
            }}
            placeholder="NIP"
            inputMode="numeric"
            maxLength={18}
            disabled={saving}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* USERNAME */}
        <div className="mb-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Username
          </label>

          <input
            type="text"
            value={pegawai.username || ""}
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-3 py-3 text-sm text-gray-500"
          />
        </div>

        {/* INFO */}
        <p className="mb-5 text-xs text-gray-400">
          🔒 Username tidak dapat diubah
        </p>

        {/* BUTTON */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleBatal}
            disabled={saving}
            className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSimpan}
            disabled={saving}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Menyimpan...
              </span>
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
