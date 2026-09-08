import { useState } from "react";
import logoDaerah from "../assets/logo-daerah.png";
import { callApi } from "../api";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      alert("Username dan password wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      // =========================
      // LOGIN ADMIN
      // =========================
      if (username.toLowerCase() === "admin") {
        const result = await callApi("loginAdmin", {
          username,
          password,
        });

        if (result?.status === true) {
          onLoginSuccess({
            nama: "Administrator",
            role: "admin",
          });
        } else {
          alert("Username atau password admin salah!");
        }

        return;
      }

      // =========================
      // LOGIN PEGAWAI
      // =========================
      const result = await callApi("loginPegawai", {
        username,
        password,
      });

      console.log("HASIL LOGIN PEGAWAI:", result);

      if (result?.status === "nonaktif") {
        alert(
          result.message ||
            "Akun Anda sedang dinonaktifkan. Silakan hubungi administrator."
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

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      {/* MOBILE CONTAINER */}
      <div className="w-full max-w-[430px]">

        {/* LOGIN CARD */}
        <div className="bg-white rounded-3xl shadow-lg px-6 py-8 sm:px-8">

          {/* LOGO */}
          <div className="flex justify-center mb-5">
            <div className="w-24 h-24 flex items-center justify-center">
              <img
                src={logoDaerah}
                alt="Logo Kabupaten Kepulauan Sangihe"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* TITLE */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800">
              Absensi PPPK
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Inspektorat Kabupaten Sangihe
            </p>
          </div>

          <form onSubmit={handleLogin}>

            {/* USERNAME */}
            <div className="mb-5">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-slate-700 mb-2"
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
                className="block text-sm font-semibold text-slate-700 mb-2"
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
        <p className="text-center text-xs text-slate-400 mt-5 px-4">
          Sistem Absensi Inspektorat Kabupaten Sangihe
        </p>
      </div>
    </div>
  );
}

export default Login;

