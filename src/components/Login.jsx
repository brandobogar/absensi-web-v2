import { useEffect, useState } from "react";
import logoDaerah from "../assets/logo-daerah.png";
import { callApi } from "../api";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [namaOpd, setNamaOpd] = useState("Instansi");
  const [loadingConfig, setLoadingConfig] = useState(false);
  

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      alert("Username dan password wajib diisi!");
      return;
    }

    setLoading(true);

    const deviceId = getDeviceId();

    try {
      // =========================
      // COBA LOGIN ADMIN
      // =========================
      const adminResult = await callApi("loginAdmin", {
        username,
        password,
        device_id: deviceId,
      });

      console.log("HASIL LOGIN ADMIN:", adminResult);

      if (adminResult?.status === "berhasil" || adminResult?.status === true) {
        onLoginSuccess({
          username: adminResult.username,
          nama: "Administrator",
          role: adminResult.role,
          opd_id: adminResult.opd_id,
        });

        return;
      }

      // =========================
      // JIKA BUKAN ADMIN
      // COBA LOGIN PEGAWAI
      // =========================
      const result = await callApi("loginPegawai", {
        username,
        password,
        device_id: deviceId,
      });

      console.log("HASIL LOGIN PEGAWAI:", result);

      if (result?.status === "nonaktif") {
        alert(
          result.message ||
            "Akun Anda sedang dinonaktifkan. Silakan hubungi administrator.",
        );
      } else if (result?.nama) {
        onLoginSuccess(result);
      } else {
        alert("Username atau password salah!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };
  const getDeviceId = () => {
    let deviceId = localStorage.getItem("absensi_device_id");

    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("absensi_device_id", deviceId);
    }
    console.log("DEVICE ID:", deviceId);

    return deviceId;
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-slate-100">
      {/* MOBILE CONTAINER */}
      <div className="w-full max-w-[430px]">
        {/* LOGIN CARD */}
        <div className="px-6 py-8 bg-white shadow-lg rounded-3xl sm:px-8">
          {/* LOGO */}
          <div className="flex justify-center mb-5">
            <div className="flex items-center justify-center w-24 h-24">
              <img
                src={logoDaerah}
                alt={`Logo ${namaOpd}`}
                className="object-contain w-full h-full"
              />
            </div>
          </div>

          {/* TITLE */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-800">Absensi</h1>

            {/* <p className="mt-1 text-sm text-slate-500">
              {loadingConfig ? "Memuat..." : namaOpd}
            </p> */}
          </div>

          <form onSubmit={handleLogin}>
            {/* USERNAME */}
            <div className="mb-5">
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-semibold text-slate-700"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={loading}
                className="
                  w-full
                  px-4
                  py-3.5
                  text-base
                  text-slate-800
                  bg-white
                  border
                  border-slate-300
                  rounded-xl
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                  disabled:bg-slate-100
                  disabled:cursor-not-allowed
                "
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                autoComplete="current-password"
                disabled={loading}
                className="
                  w-full
                  px-4
                  py-3.5
                  text-base
                  text-slate-800
                  bg-white
                  border
                  border-slate-300
                  rounded-xl
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                  disabled:bg-slate-100
                  disabled:cursor-not-allowed
                "
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                py-3.5
                px-4
                bg-blue-600
                text-white
                text-base
                font-semibold
                rounded-xl
                transition
                hover:bg-blue-700
                active:bg-blue-800
                disabled:bg-blue-400
                disabled:cursor-not-allowed
              "
            >
              {loading ? "Memverifikasi..." : "Login"}
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <p className="px-4 mt-5 text-xs text-center text-slate-400">
          Sistem Absensi
        </p>
      </div>
    </div>
  );
}

export default Login;
