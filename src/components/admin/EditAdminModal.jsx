import { useEffect, useState } from "react";

export default function EditAdminModal({
  visible,
  admin,
  onSimpan,
  onBatal,
  saving,
}) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!visible) return;

    setUsername(admin?.username || "");
  }, [visible, admin]);

  const handleSimpan = () => {
    const usernameClean = username.trim();

    if (!usernameClean) {
      alert("Username wajib diisi.");
      return;
    }

    onSimpan({
      usernameLama: admin?.username,
      username: usernameClean,
    });
  };

  const handleBatal = () => {
    if (saving) return;

    setUsername("");
    onBatal();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5 bg-black/50">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-[20px]">
        <h2 className="mb-5 text-lg font-bold text-center text-slate-800">
          Edit Admin
        </h2>

        {/* Username Lama */}
        <div className="mb-4">
          <p className="mb-1.5 text-[13px] font-medium text-slate-500">
            Username
          </p>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan username"
            disabled={saving}
            autoFocus
            className="w-full px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
          />
        </div>

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
