import { useEffect, useState } from "react";

export default function TambahPegawaiModal({
  visible,
  onSimpan,
  onBatal,
  isSuperAdmin = false,
  opdList = [],
  defaultOpdId = "",
  saving = false,
}) {
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [nip, setNip] = useState("");
  const [opdId, setOpdId] = useState(defaultOpdId);

  useEffect(() => {
    if (visible) {
      setNama("");
      setUsername("");
      setNip("");
      setOpdId(defaultOpdId || "");
    }
  }, [visible, defaultOpdId]);

  if (!visible) return null;

  const handleSimpan = () => {
    const namaBersih = nama.trim();
    const usernameBersih = username.trim();
    const nipBersih = nip.trim();

    if (!namaBersih) {
      alert("Nama lengkap wajib diisi.");
      return;
    }

    if (!usernameBersih) {
      alert("Username wajib diisi.");
      return;
    }

    if (isSuperAdmin && !opdId) {
      alert("Silakan pilih OPD terlebih dahulu.");
      return;
    }

    onSimpan({
      nama: namaBersih,
      username: usernameBersih,
      nip: nipBersih,
      opdId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Tambah Pegawai
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Tambahkan data pegawai baru
            </p>
          </div>

          <button
            type="button"
            onClick={onBatal}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="px-6 py-5 space-y-4">
          {/* OPD - KHUSUS SUPER ADMIN */}
          {isSuperAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih OPD
              </label>

              <select
                value={opdId}
                onChange={(e) => setOpdId(e.target.value)}
                disabled={saving}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg
                           bg-white text-sm text-gray-700
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:border-blue-500"
              >
                <option value="">-- Pilih OPD --</option>

                {opdList
                  .filter((opd) => opd.opd_id !== "OPD000")
                  .map((opd) => (
                    <option key={opd.opd_id} value={opd.opd_id}>
                      {opd.opd_id} - {opd.nama_opd}
                      {String(opd.status_opd).toLowerCase() !== "aktif"
                        ? " (Nonaktif)"
                        : ""}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* NAMA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>

            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              disabled={saving}
              placeholder="Masukkan nama lengkap"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg
                         text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500"
            />
          </div>

          {/* USERNAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={saving}
              autoComplete="off"
              placeholder="Masukkan username"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg
                         text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500"
            />
          </div>

          {/* NIP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIP
            </label>

            <input
              type="text"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              disabled={saving}
              placeholder="Masukkan NIP"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg
                         text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-blue-500"
            />
          </div>

          {/* INFO PASSWORD */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
            <p className="text-xs text-blue-700">
              Password awal pegawai akan dibuat otomatis:
              <span className="font-semibold"> user1234</span>
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onBatal}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-gray-700
                       bg-white border border-gray-300 rounded-lg
                       hover:bg-gray-100 disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSimpan}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white
                       bg-blue-600 rounded-lg
                       hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Pegawai"}
          </button>
        </div>
      </div>
    </div>
  );
}