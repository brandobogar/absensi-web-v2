import { useEffect, useState } from "react";
import Riwayat from "./pages/user/Riwayat";
import Login from "./components/Login";
import UserLayout from "./layouts/UserLayout";
import Beranda from "./pages/user/Beranda";
import Absen from "./pages/user/Absen";
import Admin from "./pages/admin/Admin";

function App() {
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [activeTab, setActiveTab] = useState("beranda");

  const [initializing, setInitializing] = useState(true);

  // Digunakan untuk memicu refresh status absensi di Beranda
  const [refreshBeranda, setRefreshBeranda] = useState(0);

  // =========================
  // LOAD SESSION
  // =========================
  useEffect(() => {
    const loadSession = () => {
      try {
        const savedUser = localStorage.getItem("@user_session");

        const savedIsAdmin = localStorage.getItem("@is_admin");

        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);

          setUserData(parsedUser);
          setIsAdmin(savedIsAdmin === "true");
        }
      } catch (error) {
        console.error("Gagal memuat sesi:", error);

        localStorage.removeItem("@user_session");

        localStorage.removeItem("@is_admin");
      } finally {
        setInitializing(false);
      }
    };

    loadSession();
  }, []);

  // =========================
  // LOGIN BERHASIL
  // =========================
  const handleLoginSuccess = (data) => {
    const adminStatus = data?.role === "admin";

    setUserData(data);
    setIsAdmin(adminStatus);
    setActiveTab("beranda");

    try {
      localStorage.setItem("@user_session", JSON.stringify(data));

      localStorage.setItem("@is_admin", adminStatus ? "true" : "false");
    } catch (error) {
      console.error("Gagal menyimpan sesi:", error);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    try {
      localStorage.removeItem("@user_session");

      localStorage.removeItem("@is_admin");
    } catch (error) {
      console.error("Gagal menghapus sesi:", error);
    }

    setUserData(null);
    setIsAdmin(false);
    setActiveTab("beranda");
  };

  // =========================
  // ABSEN BERHASIL
  // =========================
  const handleAbsenSuccess = () => {
    // Kembali ke Beranda
    setActiveTab("beranda");

    // Memicu Beranda mengambil status terbaru
    setRefreshBeranda((prev) => prev + 1);
  };

  // =========================
  // LOADING SESSION
  // =========================
  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-3 text-sm text-slate-500">Memuat...</p>
        </div>
      </div>
    );
  }

  // =========================
  // BELUM LOGIN
  // =========================
  if (!userData) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // =========================
  // ADMIN
  // =========================
  if (isAdmin) {
    return (
      <Admin
        onLogout={handleLogout}
        onManajemenPegawai={() => {
          alert(
            "Manajemen Pegawai akan kita migrasikan pada tahap berikutnya.",
          );
        }}
      />
    );
  }

  // =========================
  // USER CONTENT
  // =========================
  const renderUserContent = () => {
    // BERANDA
    if (activeTab === "beranda") {
      return (
        <Beranda
          userData={userData}
          onLogout={handleLogout}
          refreshTrigger={refreshBeranda}
          onProfileUpdated={handleProfileUpdated}
        />
      );
    }

    // ABSEN
    if (activeTab === "absen") {
      return <Absen userData={userData} onAbsenSuccess={handleAbsenSuccess} />;
    }

    // RIWAYAT
    if (activeTab === "riwayat") {
      return <Riwayat userData={userData} />;
    }

    return null;
  };

  const handleProfileUpdated = (updatedUser) => {
    setUserData(updatedUser);

    try {
      localStorage.setItem("@user_session", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Gagal memperbarui sesi:", error);
    }
  };

  return (
    <UserLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderUserContent()}
    </UserLayout>
  );
}

export default App;
