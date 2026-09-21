import { useEffect, useState } from "react";

export default function TambahAdminModal({
  visible,
  opdId,
  onSimpan,
  onBatal,
  saving,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  useEffect(() => {
    if (!visible) return;

    setUsername("");
    setPassword("");
    setKonfirmasiPassword("");
  }, [visible]);

  const handleSimpan = () => {
    const usernameClean = username.trim();

    if (!usernameClean) {
      alert("Username wajib diisi.");
      return;
    }

    if (!password) {
      alert("Password wajib diisi.");
      return;
    }

    if (password !== konfirmasiPassword) {
      alert("Konfirmasi password tidak sama.");
      return;
    }

    onSimpan({
      opdId,
      username: usernameClean,
      password,
    });
  };

  const handleBatal = () => {
    if (saving) return;

    setUsername("");
    setPassword("");
    setKonfirmasiPassword("");

    onBatal();
  };

  useEffect(() => {
    if (!visible) return;

    setUsername("");
    setPassword("");
    setKonfirmasiPassword("");
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5 bg-black/50">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-[20px]">
        <h2 className="mb-1 text-lg font-bold text-center text-slate-800">
          Tambah Admin
        </h2>

        <p className="mb-5 text-xs text-center text-slate-400">
          Tambahkan akun admin untuk OPD ini
        </p>

        {/* OPD */}
        <div className="mb-4">
          <p className="mb-1.5 text-[13px] font-medium text-slate-500">OPD</p>

          <div className="w-full px-3 py-3 text-sm border bg-slate-100 border-slate-200 rounded-[10px] text-slate-500">
            {opdId || "-"}
          </div>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label
            htmlFor="tambah-admin-username"
            className="block mb-1.5 text-[13px] font-medium text-slate-700"
          >
            Username
          </label>

          <input
            id="tambah-admin-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan username"
            autoComplete="off"
            disabled={saving}
            autoFocus
            className="w-full px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="tambah-admin-password"
            className="block mb-1.5 text-[13px] font-medium text-slate-700"
          >
            Password
          </label>

          <input
            id="tambah-admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            autoComplete="new-password"
            disabled={saving}
            className="w-full px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
          />
        </div>

        {/* Konfirmasi Password */}
        <div className="mb-5">
          <label
            htmlFor="tambah-admin-konfirmasi"
            className="block mb-1.5 text-[13px] font-medium text-slate-700"
          >
            Konfirmasi Password
          </label>

          <input
            id="tambah-admin-konfirmasi"
            type="password"
            autoComplete="new-password"
            value={konfirmasiPassword}
            onChange={(e) => setKonfirmasiPassword(e.target.value)}
            placeholder="Ulangi password"
            disabled={saving}
            className="w-full px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
          />
        </div>

        {/* Tombol */}
        <div className="flex gap-3">
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
  );
}
