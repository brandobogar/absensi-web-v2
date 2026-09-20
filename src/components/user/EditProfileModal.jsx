import { useEffect, useState } from "react";
import { callApi } from "../../api";

function EditProfileModal({ visible, onClose, userData, onProfileUpdated }) {
  const [username, setUsername] = useState("");

  // PASSWORD
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // RESET FORM SAAT MODAL DIBUKA
  // =========================
  useEffect(() => {
    if (visible) {
      setUsername(userData?.username || "");
      setShowPasswordForm(false);

      setPasswordLama("");
      setPasswordBaru("");
      setKonfirmasiPassword("");
    }
  }, [visible, userData]);

  // =========================
  // SIMPAN USERNAME
  // =========================
  const handleSimpan = async () => {
    const usernameBaru = username.trim();
    const usernameLama = String(userData?.username || "").trim();

    if (!usernameBaru) {
      alert("Username wajib diisi.");
      return;
    }

    if (usernameBaru === usernameLama) {
      alert("Username belum diubah.");
      return;
    }

    setLoading(true);

    try {
      const result = await callApi("updateUsernamePegawai", {
        usernameLama,
        usernameBaru,
        session_token: userData?.session_token,
      });

      if (result?.status === "berhasil") {
        alert("Username berhasil diperbarui.");

        const updatedUser = {
          ...userData,
          username: usernameBaru,
        };

        if (onProfileUpdated) {
          onProfileUpdated(updatedUser);
        }

        onClose();
      } else {
        alert(result?.message || "Username gagal diperbarui.");
      }
    } catch (error) {
      console.error("Gagal update username:", error);

      alert("Terjadi kesalahan saat memperbarui username.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SIMPAN PASSWORD
  // =========================
  const handleSimpanPassword = async () => {
    if (!passwordLama) {
      alert("Password lama wajib diisi.");
      return;
    }

    if (!passwordBaru) {
      alert("Password baru wajib diisi.");
      return;
    }

    if (passwordBaru.length < 6) {
      alert("Password baru minimal 6 karakter.");
      return;
    }

    if (!konfirmasiPassword) {
      alert("Konfirmasi password baru wajib diisi.");
      return;
    }

    if (passwordBaru !== konfirmasiPassword) {
      alert("Konfirmasi password tidak sama dengan password baru.");
      return;
    }

    setLoading(true);

    try {
      const result = await callApi("updatePasswordPegawai", {
        username: userData?.username,
        passwordLama,
        passwordBaru,
        session_token: userData?.session_token,
      });

      if (result?.status === "berhasil") {
        alert("Password berhasil diperbarui.");

        setPasswordLama("");
        setPasswordBaru("");
        setKonfirmasiPassword("");
        setShowPasswordForm(false);
      } else {
        alert(result?.message || "Password gagal diperbarui.");
      }
    } catch (error) {
      console.error("Gagal update password:", error);

      alert("Terjadi kesalahan saat memperbarui password.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // BATAL PASSWORD
  // =========================
  const handleBatalPassword = () => {
    setPasswordLama("");
    setPasswordBaru("");
    setKonfirmasiPassword("");

    setShowPasswordForm(false);
  };

  // =========================
  // MODAL TIDAK DITAMPILKAN
  // =========================
  if (!visible) {
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
        p-4
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-[440px]
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          bg-white
          p-5
          shadow-2xl
        "
        onMouseDown={(e) => e.stopPropagation()}
      >
        {!showPasswordForm ? (
          <>
            {/* =========================
                EDIT PROFILE
            ========================= */}

            <h2 className="text-center text-xl font-bold text-slate-800">
              Edit Profile
            </h2>

            <p className="mt-1 text-center text-sm text-slate-500">
              Ubah informasi akun Anda
            </p>

            {/* NAMA */}
            <div className="mt-5">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Nama Lengkap
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-3">
                <p className="text-sm text-slate-500">
                  {userData?.nama || "-"}
                </p>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                🔒 Nama lengkap tidak dapat diubah
              </p>
            </div>

            {/* NIP */}
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                NIP
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-3">
                <p className="text-sm text-slate-500">{userData?.nip || "-"}</p>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                🔒 NIP tidak dapat diubah
              </p>
            </div>

            {/* USERNAME */}
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-3
                  py-3
                  text-sm
                  text-slate-800
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                  disabled:bg-slate-100
                "
              />
            </div>

            {/* GANTI PASSWORD */}
            <button
              type="button"
              onClick={() => setShowPasswordForm(true)}
              disabled={loading}
              className="
                mt-5
                w-full
                rounded-xl
                border
                border-blue-200
                bg-blue-50
                px-4
                py-3
                text-sm
                font-semibold
                text-blue-600
                transition
                hover:bg-blue-100
                disabled:opacity-50
              "
            >
              🔑 Ganti Password
            </button>

            {/* BUTTON */}
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="
                  flex-1
                  rounded-xl
                  bg-slate-100
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-slate-600
                  transition
                  hover:bg-slate-200
                  disabled:opacity-50
                "
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSimpan}
                disabled={loading}
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
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* =========================
                GANTI PASSWORD
            ========================= */}

            <h2 className="text-center text-xl font-bold text-slate-800">
              Ganti Password
            </h2>

            <p className="mt-1 text-center text-sm text-slate-500">
              Masukkan password lama dan password baru
            </p>

            {/* PASSWORD LAMA */}
            <div className="mt-5">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Password Lama
              </label>

              <input
                type="password"
                value={passwordLama}
                onChange={(e) => setPasswordLama(e.target.value)}
                placeholder="Masukkan password lama"
                autoComplete="current-password"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-3
                  py-3
                  text-sm
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                  disabled:bg-slate-100
                "
              />
            </div>

            {/* PASSWORD BARU */}
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Password Baru
              </label>

              <input
                type="password"
                value={passwordBaru}
                onChange={(e) => setPasswordBaru(e.target.value)}
                placeholder="Masukkan password baru"
                autoComplete="new-password"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-3
                  py-3
                  text-sm
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                  disabled:bg-slate-100
                "
              />

              <p className="mt-1 text-xs text-slate-400">
                Password minimal 6 karakter
              </p>
            </div>

            {/* KONFIRMASI */}
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Konfirmasi Password Baru
              </label>

              <input
                type="password"
                value={konfirmasiPassword}
                onChange={(e) => setKonfirmasiPassword(e.target.value)}
                placeholder="Ulangi password baru"
                autoComplete="new-password"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-3
                  py-3
                  text-sm
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                  disabled:bg-slate-100
                "
              />
            </div>

            {/* BUTTON PASSWORD */}
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={handleBatalPassword}
                disabled={loading}
                className="
                  flex-1
                  rounded-xl
                  bg-slate-100
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-slate-600
                  transition
                  hover:bg-slate-200
                  disabled:opacity-50
                "
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSimpanPassword}
                disabled={loading}
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
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? "Menyimpan..." : "Simpan Password"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EditProfileModal;
