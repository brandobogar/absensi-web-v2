import { useEffect, useState } from "react";

import { callApi } from "./api";

import Riwayat from "./pages/user/Riwayat";

import Login from "./components/Login";

import UserLayout from "./layouts/UserLayout";

import Beranda from "./pages/user/Beranda";

import Absen from "./pages/user/Absen";

import Admin from "./pages/admin/Admin";

import ManajemenPegawai from "./pages/admin/ManajemenPegawai";
import ManajemenOpd from "./pages/admin/ManajemenOpd";
function App() {
  const [userData, setUserData] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);

  const [activeTab, setActiveTab] = useState("beranda");

  // Halaman yang sedang dibuka di sisi Admin
  const [adminPage, setAdminPage] = useState("dashboard");

  const [initializing, setInitializing] = useState(true);

  // Digunakan untuk memicu refresh status absensi di Beranda
  const [refreshBeranda, setRefreshBeranda] = useState(0);

  // =========================
  // OPD YANG SEDANG DIPILIH
  // =========================
  const [selectedOpdId, setSelectedOpdId] = useState(null);

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

          // Default OPD sesuai akun
          setSelectedOpdId(parsedUser?.opd_id || null);
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
    const role = String(data?.role || "")
      .trim()
      .toLowerCase();

    const adminStatus =
      role === "admin" ||
      role === "superadmin" ||
      role === "super_admin" ||
      role === "admin_kepegawaian" ||
      role === "admin_monitoring";

    setUserData(data);

    setIsAdmin(adminStatus);

    // OPD awal
    setSelectedOpdId(data?.opd_id || null);

    // Setelah login, mulai dari halaman utama
    setActiveTab("beranda");

    setAdminPage("dashboard");

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
    setSelectedOpdId(null);
    setActiveTab("beranda");
    setAdminPage("dashboard");
  };

  // =========================
  // ABSEN BERHASIL
  // =========================
  const handleAbsenSuccess = () => {
    setActiveTab("beranda");

    setRefreshBeranda((prev) => prev + 1);
  };

  // =========================
  // PROFILE BERHASIL DIUPDATE
  // =========================
  const handleProfileUpdated = (updatedUser) => {
    setUserData(updatedUser);

    try {
      localStorage.setItem("@user_session", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Gagal memperbarui sesi:", error);
    }
  };

  // =========================
  // LOADING SESSION
  // =========================
  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin" />

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
    const role = String(userData?.role || "")
      .trim()
      .toLowerCase();

    const isSuperAdmin = role === "superadmin" || role === "super_admin";

    // =========================
    // OPD ADMIN
    // =========================
    const opdId = isSuperAdmin ? selectedOpdId : userData?.opd_id;

    // -------------------------
    // HALAMAN MANAJEMEN PEGAWAI
    // -------------------------
    if (adminPage === "pegawai") {
      return (
        <ManajemenPegawai
          callApi={callApi}
          opdId={opdId}
          role={role}
          isSuperAdmin={isSuperAdmin}
          selectedOpdId={selectedOpdId}
          setSelectedOpdId={setSelectedOpdId}
          onKembali={() => setAdminPage("dashboard")}
          userData={userData}
        />
      );
    }

    if (adminPage === "opd") {
      return (
        <ManajemenOpd
          callApi={callApi}
          onKembali={() => setAdminPage("dashboard")}
          userData={userData}
        />
      );
    }

    // -------------------------
    // DASHBOARD ADMIN
    // -------------------------
    return (
      <Admin
        userData={userData}
        opdId={opdId}
        role={role}
        isSuperAdmin={isSuperAdmin}
        selectedOpdId={selectedOpdId}
        setSelectedOpdId={setSelectedOpdId}
        onLogout={handleLogout}
        onManajemenPegawai={() => setAdminPage("pegawai")}
        onManajemenOpd={() => setAdminPage("opd")}
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

  // =========================
  // USER LAYOUT
  // =========================
  return (
    <UserLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderUserContent()}
    </UserLayout>
  );
}

export default App;
