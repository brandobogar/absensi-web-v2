
import React from "react";

export default function ResetPasswordModal({
  visible,
  pegawai,
  onKonfirmasi,
  onBatal,
  saving = false,
}) {
  if (!visible || !pegawai) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl">
            🔑
          </div>
        </div>

        {/* Judul */}
        <h2 className="mb-2 text-center text-lg font-bold text-gray-800">
          Reset Password?
        </h2>

        {/* Pesan */}
        <p className="mb-4 text-center text-sm text-gray-600">
          Password pegawai berikut akan dikembalikan ke password default:
        </p>

        <div className="mb-5 rounded-xl bg-gray-50 px-4 py-3 text-center">
          <p className="font-semibold text-gray-800">
            {pegawai.nama}
          </p>

          <p className="text-sm text-gray-500">
            @{pegawai.username}
          </p>

          <div className="mt-3 rounded-lg bg-blue-50 px-3 py-2">
            <span className="text-xs text-gray-500">
              Password baru
            </span>

            <p className="font-mono font-bold text-blue-600">
              user1234
            </p>
          </div>
        </div>

        <p className="mb-5 text-center text-xs text-gray-400">
          Pegawai harus menggunakan password tersebut untuk login
          berikutnya.
        </p>

        {/* Tombol */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBatal}
            disabled={saving}
            className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onKonfirmasi}
            disabled={saving}
            className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Memproses...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
