import { useEffect, useState } from "react";

import TambahAdminModal from "../../components/admin/TambahAdminModal";
import EditAdminModal from "../../components/admin/EditAdminModal";
import ResetPasswordAdminModal from "../../components/admin/ResetPasswordAdminModal";

export default function ManajemenAdmin({
  callApi,
  opdId,
  onKembali,
  userData,
}) {
  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modal tambah
  const [showTambah, setShowTambah] = useState(false);

  // Modal edit
  const [showEdit, setShowEdit] = useState(false);
  const [adminEdit, setAdminEdit] = useState(null);

  // Modal reset password
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [adminReset, setAdminReset] = useState(null);

  // =========================================================
  // AMBIL DATA ADMIN
  // =========================================================
  const fetchAdmin = async () => {
    if (!opdId) return;

    setLoading(true);

    try {
      const result = await callApi("getAdmin", {
        opdId,
        session_token: userData?.session_token,
      });

      console.log("DAFTAR ADMIN:", result);

      if (Array.isArray(result)) {
        setAdminList(result);
      } else {
        alert("Gagal memuat data admin.");
      }
    } catch (error) {
      console.error("fetchAdmin:", error);
      alert("Terjadi kesalahan saat memuat data admin.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD DATA SAAT OPD BERUBAH
  // =========================================================
  useEffect(() => {
    fetchAdmin();
  }, [opdId]);

  // =========================================================
  // TAMBAH ADMIN
  // =========================================================
  const handleTambahAdmin = async ({ opdId, username, password }) => {
    setSaving(true);

    try {
      const result = await callApi("tambahAdmin", {
        opdId,
        username,
        password,
        session_token: userData?.session_token,
      });

      console.log("HASIL TAMBAH ADMIN:", result);

      if (result?.status !== "berhasil") {
        alert(result?.message || "Gagal menambahkan admin.");
        return;
      }

      setShowTambah(false);

      alert("Admin berhasil ditambahkan.");

      await fetchAdmin();
    } catch (error) {
      console.error("handleTambahAdmin:", error);

      alert("Terjadi kesalahan saat menambahkan admin.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // EDIT USERNAME ADMIN
  // =========================================================
  const handleEditAdmin = async ({ usernameLama, username }) => {
    setSaving(true);

    try {
      const result = await callApi("updateAdmin", {
        opdId,
        usernameLama,
        usernameBaru: username,
        session_token: userData?.session_token,
      });

      console.log("HASIL EDIT ADMIN:", result);

      if (result?.status !== "berhasil") {
        alert(result?.message || "Gagal memperbarui admin.");
        return;
      }

      setShowEdit(false);
      setAdminEdit(null);

      alert("Username admin berhasil diperbarui.");

      await fetchAdmin();
    } catch (error) {
      console.error("handleEditAdmin:", error);

      alert("Terjadi kesalahan saat memperbarui admin.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // RESET PASSWORD ADMIN
  // =========================================================
  const handleResetPassword = async ({ username, passwordBaru }) => {
    setSaving(true);

    try {
      const result = await callApi("resetPasswordAdmin", {
        opdId,
        username,
        passwordBaru,
        session_token: userData?.session_token,
      });

      console.log("HASIL RESET PASSWORD ADMIN:", result);

      if (result?.status !== "berhasil") {
        alert(result?.message || "Gagal mereset password admin.");
        return;
      }

      setShowResetPassword(false);
      setAdminReset(null);

      alert("Password admin berhasil direset.");

      await fetchAdmin();
    } catch (error) {
      console.error("handleResetPassword:", error);

      alert("Terjadi kesalahan saat mereset password admin.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // TOGGLE STATUS ADMIN
  // =========================================================
  const handleToggleStatus = async (admin) => {
    if (!admin?.username) return;

    const statusSekarang = String(admin.status || "")
      .trim()
      .toLowerCase();

    const statusBaru = statusSekarang === "aktif" ? "nonaktif" : "aktif";

    const konfirmasi = window.confirm(
      `Apakah Anda yakin ingin mengubah status admin "${admin.username}" menjadi ${statusBaru}?`,
    );

    if (!konfirmasi) return;

    setSaving(true);

    try {
      const result = await callApi("updateStatusAdmin", {
        opdId,
        username: admin.username,
        status: statusBaru,
        session_token: userData?.session_token,
      });

      console.log("HASIL UPDATE STATUS ADMIN:", result);

      if (result?.status !== "berhasil") {
        alert(result?.message || "Gagal mengubah status admin.");
        return;
      }

      alert(`Status admin berhasil diubah menjadi ${statusBaru}.`);

      await fetchAdmin();
    } catch (error) {
      console.error("handleToggleStatus:", error);

      alert("Terjadi kesalahan saat mengubah status admin.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className="min-h-screen bg-slate-100">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm border-slate-200">
        <div className="max-w-5xl px-4 py-4 mx-auto sm:px-6">
          <div className="grid items-center grid-cols-3 gap-4">
            {/* KIRI */}
            <div className="flex justify-start">
              <button
                type="button"
                onClick={onKembali}
                disabled={saving}
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 disabled:opacity-50 whitespace-nowrap"
              >
                ← Kembali
              </button>
            </div>

            {/* TENGAH */}
            <div className="flex justify-center">
              <h1 className="text-base font-bold text-slate-800 sm:text-lg whitespace-nowrap">
                Manajemen Admin
              </h1>
            </div>

            {/* KANAN */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowTambah(true)}
                disabled={saving}
                className="px-3 py-2 text-xs font-bold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 whitespace-nowrap"
              >
                + Tambah
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <main className="max-w-5xl px-4 py-5 mx-auto sm:px-6">
        {/* INFORMASI OPD */}
        <div className="p-4 mb-4 bg-white border shadow-sm rounded-2xl border-slate-200">
          <p className="text-xs text-slate-400">OPD</p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            {opdId || "-"}
          </p>
        </div>

        {/* JUMLAH ADMIN + REFRESH */}
        {!loading && (
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                {adminList.length}
              </span>{" "}
              admin terdaftar
            </p>

            <button
              type="button"
              onClick={fetchAdmin}
              disabled={loading || saving}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              ↻ Refresh
            </button>
          </div>
        )}

        {/* =====================================================
            LOADING
        ===================================================== */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="border-4 rounded-full h-9 w-9 animate-spin border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">Memuat data admin...</p>
          </div>
        ) : adminList.length === 0 ? (
          /* ===================================================
             BELUM ADA ADMIN
          =================================================== */
          <div className="px-6 py-12 text-center bg-white border rounded-2xl border-slate-200">
            <div className="mb-3 text-4xl">👤</div>

            <p className="text-sm font-semibold text-slate-700">
              Belum ada admin
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Belum ada akun admin untuk OPD ini.
            </p>
          </div>
        ) : (
          /* ===================================================
             DAFTAR ADMIN
          =================================================== */
          <div className="space-y-3">
            {adminList.map((admin, index) => {
              const statusAktif =
                String(admin.status || "")
                  .trim()
                  .toLowerCase() === "aktif";

              return (
                <div
                  key={admin.username || index}
                  className="p-4 bg-white border shadow-sm rounded-2xl border-slate-200 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* INFORMASI ADMIN */}
                    <div className="flex items-center min-w-0 gap-3">
                      <div className="flex items-center justify-center w-10 h-10 text-lg rounded-full bg-blue-50">
                        👤
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800">
                          {admin.username || "-"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {admin.role || "-"}
                        </p>
                      </div>
                    </div>

                    {/* STATUS + AKSI */}
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {/* STATUS */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(admin)}
                        disabled={saving}
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition disabled:opacity-50 ${
                          statusAktif
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                        title="Klik untuk mengubah status"
                      >
                        {admin.status || "-"}
                      </button>

                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={() => {
                          setAdminEdit(admin);
                          setShowEdit(true);
                        }}
                        disabled={saving}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-600 transition border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
                      >
                        ✏️ Edit
                      </button>

                      {/* RESET PASSWORD */}
                      <button
                        type="button"
                        onClick={() => {
                          setAdminReset(admin);
                          setShowResetPassword(true);
                        }}
                        disabled={saving}
                        className="px-3 py-1.5 text-xs font-semibold text-orange-600 transition border border-orange-200 rounded-lg bg-orange-50 hover:bg-orange-100 disabled:opacity-50"
                      >
                        🔐 Reset
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* =====================================================
          MODAL TAMBAH ADMIN
      ===================================================== */}
      <TambahAdminModal
        visible={showTambah}
        opdId={opdId}
        onSimpan={handleTambahAdmin}
        onBatal={() => setShowTambah(false)}
        saving={saving}
      />

      {/* =====================================================
          MODAL EDIT ADMIN
      ===================================================== */}
      <EditAdminModal
        visible={showEdit}
        admin={adminEdit}
        onSimpan={handleEditAdmin}
        onBatal={() => {
          setShowEdit(false);
          setAdminEdit(null);
        }}
        saving={saving}
      />

      {/* =====================================================
          MODAL RESET PASSWORD
      ===================================================== */}
      <ResetPasswordAdminModal
        visible={showResetPassword}
        admin={adminReset}
        onSimpan={handleResetPassword}
        onBatal={() => {
          setShowResetPassword(false);
          setAdminReset(null);
        }}
        saving={saving}
      />
    </div>
  );
}