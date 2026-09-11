import { useEffect, useState } from "react";

export default function ResetPasswordAdminModal({
  visible,
  admin,
  onSimpan,
  onBatal,
  saving,
}) {
  const [passwordBaru, setPasswordBaru] =
    useState("");

  const [konfirmasiPassword, setKonfirmasiPassword] =
    useState("");

  useEffect(() => {
    if (!visible) return;

    setPasswordBaru("");
    setKonfirmasiPassword("");
  }, [visible, admin]);

  // =========================================================
  // SIMPAN
  // =========================================================
  const handleSimpan = () => {
    if (!passwordBaru) {
      alert("Password baru wajib diisi.");
      return;
    }

    if (passwordBaru.length < 4) {
      alert(
        "Password minimal 4 karakter."
      );
      return;
    }

    if (!konfirmasiPassword) {
      alert(
        "Konfirmasi password wajib diisi."
      );
      return;
    }

    if (
      passwordBaru !==
      konfirmasiPassword
    ) {
      alert(
        "Konfirmasi password tidak sama."
      );
      return;
    }

    onSimpan({
      username: admin?.username,
      passwordBaru,
    });
  };

  // =========================================================
  // BATAL
  // =========================================================
  const handleBatal = () => {
    if (saving) return;

    setPasswordBaru("");
    setKonfirmasiPassword("");

    onBatal();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5 bg-black/50">

      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-[20px]">

        {/* HEADER */}
        <h2 className="mb-1 text-lg font-bold text-center text-slate-800">
          Reset Password Admin
        </h2>

        <p className="mb-5 text-xs text-center text-slate-400">
          Atur password baru untuk akun admin
        </p>

        {/* USERNAME */}
        <div className="mb-4">

          <p className="mb-1.5 text-[13px] font-medium text-slate-500">
            Username
          </p>

          <div className="w-full px-3 py-3 text-sm border bg-slate-100 border-slate-200 rounded-[10px] text-slate-500">
            {admin?.username || "-"}
          </div>

        </div>

        {/* PASSWORD BARU */}
        <div className="mb-4">

          <label
            htmlFor="reset-admin-password"
            className="block mb-1.5 text-[13px] font-medium text-slate-700"
          >
            Password Baru
          </label>

          <input
            id="reset-admin-password"
            type="password"
            value={passwordBaru}
            onChange={(e) =>
              setPasswordBaru(
                e.target.value
              )
            }
            placeholder="Masukkan password baru"
            disabled={saving}
            autoFocus
            className="w-full px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
          />

        </div>

        {/* KONFIRMASI */}
        <div className="mb-5">

          <label
            htmlFor="reset-admin-konfirmasi"
            className="block mb-1.5 text-[13px] font-medium text-slate-700"
          >
            Konfirmasi Password
          </label>

          <input
            id="reset-admin-konfirmasi"
            type="password"
            value={konfirmasiPassword}
            onChange={(e) =>
              setKonfirmasiPassword(
                e.target.value
              )
            }
            placeholder="Ulangi password baru"
            disabled={saving}
            className="w-full px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
          />

        </div>

        {/* BUTTON */}
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
            {saving
              ? "Menyimpan..."
              : "Reset Password"}
          </button>

        </div>

      </div>

    </div>
  );
}