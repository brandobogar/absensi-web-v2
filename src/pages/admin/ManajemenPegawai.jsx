import { useEffect, useState } from "react";
import EditPegawaiModal from "../../components/admin/EditPegawaiModal";
import TambahPegawaiModal from "../../components/admin/TambahPegawaiModal";

export default function ManajemenPegawai({ callApi, opdId, role, onKembali }) {
  const [pegawaiList, setPegawaiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(null);

  // Pencarian
  const [search, setSearch] = useState("");

  // Modal tambah
  const [showTambah, setShowTambah] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modal edit
  const [showEdit, setShowEdit] = useState(false);
  const [pegawaiEdit, setPegawaiEdit] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // ============================================================
  // AMBIL DATA PEGAWAI
  // ============================================================

  const fetchPegawai = async () => {
    setLoading(true);

    try {
      const result = await callApi("getPegawai", { role, opdId });

      if (Array.isArray(result)) {
        setPegawaiList(result);
      } else {
        alert("Gagal memuat data pegawai.");
      }
    } catch (error) {
      console.error("fetchPegawai:", error);
      alert("Terjadi kesalahan saat memuat data pegawai.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!opdId) return;

    fetchPegawai();
  }, [opdId]);

  // ============================================================
  // FILTER PENCARIAN
  // ============================================================

  const pegawaiFiltered = pegawaiList.filter((pegawai) => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return true;

    return (
      String(pegawai.nama || "")
        .toLowerCase()
        .includes(keyword) ||
      String(pegawai.username || "")
        .toLowerCase()
        .includes(keyword) ||
      String(pegawai.nip || "")
        .toLowerCase()
        .includes(keyword)
    );
  });

  // ============================================================
  // TOGGLE STATUS / BYPASS
  // ============================================================

  const handleToggle = async (username, field, nilaiSekarang) => {
    const nilaiBaru = !nilaiSekarang;

    const labelField = {
      status_aktif: "Status Aktif",
      bypass_radius: "Bypass Radius",
      bypass_sesi: "Bypass Sesi",
    };

    const konfirmasi = window.confirm(
      `Ubah ${labelField[field]} untuk ${username} menjadi ${
        nilaiBaru ? "Aktif" : "Nonaktif"
      }?`,
    );

    if (!konfirmasi) return;

    setUpdating(username + field);

    try {
      const result = await callApi("updateStatusPegawai", {
        opdId,
        username,
        field,
        value: nilaiBaru,
      });

      if (result?.status === "berhasil") {
        setPegawaiList((prev) =>
          prev.map((p) =>
            p.username === username
              ? {
                  ...p,
                  [field]: nilaiBaru,
                }
              : p,
          ),
        );
      } else {
        alert(result?.message || "Gagal mengubah status pegawai.");
      }
    } catch (error) {
      console.error("handleToggle:", error);
      alert("Terjadi kesalahan saat mengubah status pegawai.");
    } finally {
      setUpdating(null);
    }
  };

  // ============================================================
  // TAMBAH PEGAWAI
  // ============================================================

  const handleTambahPegawai = async ({ nama, username, nip }) => {
    setSaving(true);

    try {
      const result = await callApi("tambahPegawai", {
        opdId,
        nama,
        username,
        nip,
      });

      console.log("HASIL TAMBAH PEGAWAI:", result);

      if (result?.status === "berhasil") {
        setShowTambah(false);

        alert(
          `Pegawai ${username} berhasil ditambahkan!\n\nPassword default: user1234`,
        );

        await fetchPegawai();
      } else {
        alert(result?.message || "Gagal menambahkan pegawai.");
        console.log("gagas TAMBAH PEGAWAI:", result);
      }
    } catch (error) {
      console.error("handleTambahPegawai:", error);
      alert("Terjadi kesalahan saat menambahkan pegawai.");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // BUKA MODAL EDIT
  // ============================================================

  const handleBukaEdit = (pegawai) => {
    setPegawaiEdit(pegawai);
    setShowEdit(true);
  };

  // ============================================================
  // BATAL EDIT
  // ============================================================

  const handleBatalEdit = () => {
    if (savingEdit) return;

    setShowEdit(false);
    setPegawaiEdit(null);
  };

  // ============================================================
  // SIMPAN EDIT PEGAWAI
  // ============================================================

  const handleEditPegawai = async ({ id_pegawai, nama, nip, password }) => {
    setSavingEdit(true);

    try {
      console.log("DATA EDIT:", {
        opdId,
        id_pegawai,
        nama,
        nip,
        password,
      });

      const result = await callApi("updatePegawai", {
        opdId,
        id_pegawai,
        nama,
        nip,
        password,
      });

      console.log("HASIL UPDATE PEGAWAI:", result);

      if (result?.status === "berhasil") {
        setPegawaiList((prev) =>
          prev.map((p) =>
            p.id_pegawai === id_pegawai
              ? {
                  ...p,
                  nama,
                  nip,
                }
              : p,
          ),
        );

        setShowEdit(false);
        setPegawaiEdit(null);

        alert(`Data pegawai ${id_pegawai} berhasil diperbarui.`);
      } else {
        alert(result?.message || "Gagal memperbarui data pegawai.");
      }
    } catch (error) {
      console.error("handleEditPegawai:", error);
      alert("Terjadi kesalahan saat memperbarui data pegawai.");
    } finally {
      setSavingEdit(false);
    }
  };
  // ============================================================
  // RESET PASSWORD
  // ============================================================

  const handleResetPassword = (username) => {
    const konfirmasi = window.confirm(
      `Reset password ${username} ke "user1234"?`,
    );

    if (!konfirmasi) return;

    setUpdating(username + "reset");

    const prosesReset = async () => {
      try {
        const result = await callApi("resetPassword", {
          opdId,
          username,
        });

        if (result?.status === "berhasil") {
          alert(`Password ${username} berhasil direset ke "user1234"!`);
        } else {
          alert(result?.message || "Gagal mereset password.");
        }
      } catch (error) {
        console.error("handleResetPassword:", error);
        alert("Terjadi kesalahan saat mereset password.");
      } finally {
        setUpdating(null);
      }
    };

    prosesReset();
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ======================================================
          HEADER
      ======================================================= */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm border-slate-200">
        <div className="max-w-5xl px-4 py-4 mx-auto sm:px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Kembali */}
            <button
              type="button"
              onClick={onKembali}
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              ← Kembali
            </button>

            {/* Judul */}
            <h1 className="text-base font-bold sm:text-lg text-slate-800">
              Manajemen Pegawai
            </h1>

            {/* Tambah */}
            <button
              type="button"
              onClick={() => setShowTambah(true)}
              className="text-sm font-semibold text-green-600 transition hover:text-green-700"
            >
              + Tambah
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================
          CONTENT
      ======================================================= */}
      <main className="max-w-5xl px-4 py-5 mx-auto sm:px-6">
        {/* ====================================================
            PENCARIAN
        ===================================================== */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, username, atau NIP..."
              className="w-full px-4 py-3 pr-10 text-sm transition bg-white border outline-none rounded-xl border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute text-lg -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-slate-600"
                title="Hapus pencarian"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* ====================================================
            INFO HASIL
        ===================================================== */}
        {!loading && pegawaiList.length > 0 && (
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500">
              Menampilkan{" "}
              <span className="font-semibold text-slate-700">
                {pegawaiFiltered.length}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-slate-700">
                {pegawaiList.length}
              </span>{" "}
              pegawai
            </p>

            <button
              type="button"
              onClick={fetchPegawai}
              disabled={loading}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              ↻ Refresh
            </button>
          </div>
        )}

        {/* ====================================================
            LOADING
        ===================================================== */}
        {loading && pegawaiList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="border-4 rounded-full h-9 w-9 animate-spin border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Memuat data pegawai...
            </p>
          </div>
        ) : pegawaiList.length === 0 ? (
          /* ==================================================
             DATA KOSONG
          =================================================== */
          <div className="px-6 py-12 text-center bg-white border rounded-2xl border-slate-200">
            <div className="mb-3 text-4xl">👥</div>

            <p className="text-sm font-semibold text-slate-700">
              Belum ada data pegawai
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Silakan tambahkan pegawai baru.
            </p>

            <button
              type="button"
              onClick={() => setShowTambah(true)}
              className="px-4 py-2 mt-5 text-sm font-semibold text-white transition bg-green-600 rounded-lg hover:bg-green-700"
            >
              + Tambah Pegawai
            </button>
          </div>
        ) : pegawaiFiltered.length === 0 ? (
          /* ==================================================
             HASIL PENCARIAN KOSONG
          =================================================== */
          <div className="px-6 text-center bg-white border rounded-2xl border-slate-200 py-14">
            <div className="mb-3 text-4xl">🔎</div>

            <p className="text-sm font-bold text-slate-700">
              Pegawai tidak ditemukan
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Tidak ada pegawai yang cocok dengan "{search}".
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Hapus pencarian
            </button>
          </div>
        ) : (
          /* ==================================================
             DAFTAR PEGAWAI
          =================================================== */
          <div className="space-y-3">
            {pegawaiFiltered.map((pegawai, index) => {
              const updatingStatus =
                updating === pegawai.username + "status_aktif";

              const updatingRadius =
                updating === pegawai.username + "bypass_radius";

              const updatingSesi =
                updating === pegawai.username + "bypass_sesi";

              const updatingReset = updating === pegawai.username + "reset";

              return (
                <div
                  key={pegawai.username || index}
                  className="p-4 bg-white border shadow-sm rounded-2xl border-slate-200 sm:p-5"
                >
                  {/* ==========================================
                      HEADER CARD
                  =========================================== */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate sm:text-base text-slate-800">
                        {pegawai.nama || "-"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        @{pegawai.username}
                      </p>

                      {pegawai.nip ? (
                        <p className="mt-1 text-xs text-slate-400">
                          NIP: {pegawai.nip}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs italic text-slate-300">
                          NIP belum diisi
                        </p>
                      )}
                    </div>

                    {/* STATUS BADGE */}
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        pegawai.status_aktif
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {pegawai.status_aktif ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>

                  {/* ==========================================
                      TOGGLE STATUS AKTIF
                  =========================================== */}
                  <div className="flex items-center justify-between gap-4 py-3 border-b border-slate-50">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700">
                        Status Aktif
                      </p>

                      <p className="text-xs text-slate-400 mt-0.5">
                        Izinkan pegawai untuk login
                      </p>
                    </div>

                    {updatingStatus ? (
                      <div className="w-5 h-5 border-2 rounded-full animate-spin border-slate-200 border-t-blue-600 shrink-0" />
                    ) : (
                      <button
                        type="button"
                        role="switch"
                        aria-checked={pegawai.status_aktif === true}
                        onClick={() =>
                          handleToggle(
                            pegawai.username,
                            "status_aktif",
                            pegawai.status_aktif,
                          )
                        }
                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                          pegawai.status_aktif ? "bg-blue-600" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                            pegawai.status_aktif ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* ==========================================
                      TOGGLE BYPASS RADIUS
                  =========================================== */}
                  <div className="flex items-center justify-between gap-4 py-3 border-b border-slate-50">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700">
                        Bypass Radius
                      </p>

                      <p className="text-xs text-slate-400 mt-0.5">
                        Absen dari mana saja
                      </p>
                    </div>

                    {updatingRadius ? (
                      <div className="w-5 h-5 border-2 rounded-full animate-spin border-slate-200 border-t-blue-600 shrink-0" />
                    ) : (
                      <button
                        type="button"
                        role="switch"
                        aria-checked={pegawai.bypass_radius === true}
                        onClick={() =>
                          handleToggle(
                            pegawai.username,
                            "bypass_radius",
                            pegawai.bypass_radius,
                          )
                        }
                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                          pegawai.bypass_radius
                            ? "bg-amber-500"
                            : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                            pegawai.bypass_radius ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* ==========================================
                      TOGGLE BYPASS SESI
                  =========================================== */}
                  <div className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700">
                        Bypass Sesi
                      </p>

                      <p className="text-xs text-slate-400 mt-0.5">
                        Absen di luar jam sesi
                      </p>
                    </div>

                    {updatingSesi ? (
                      <div className="w-5 h-5 border-2 rounded-full animate-spin border-slate-200 border-t-blue-600 shrink-0" />
                    ) : (
                      <button
                        type="button"
                        role="switch"
                        aria-checked={pegawai.bypass_sesi === true}
                        onClick={() =>
                          handleToggle(
                            pegawai.username,
                            "bypass_sesi",
                            pegawai.bypass_sesi,
                          )
                        }
                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                          pegawai.bypass_sesi ? "bg-amber-500" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                            pegawai.bypass_sesi ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* ==========================================
                      AKSI PEGAWAI
                  =========================================== */}
                  <div className="grid grid-cols-1 gap-2 pt-3 mt-2 border-t sm:grid-cols-2 border-slate-100">
                    {/* EDIT */}
                    <button
                      type="button"
                      onClick={() => handleBukaEdit(pegawai)}
                      className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition"
                    >
                      ✏️ Edit Data
                    </button>

                    {/* RESET PASSWORD */}
                    <button
                      type="button"
                      onClick={() => handleResetPassword(pegawai.username)}
                      disabled={updatingReset}
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60 transition"
                    >
                      {updatingReset ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-red-200 rounded-full animate-spin border-t-red-600" />
                          Memproses...
                        </span>
                      ) : (
                        "🔑 Reset Password"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ======================================================
          MODAL TAMBAH PEGAWAI
      ======================================================= */}
      <TambahPegawaiModal
        visible={showTambah}
        onSimpan={handleTambahPegawai}
        onBatal={() => {
          if (saving) return;
          setShowTambah(false);
        }}
        saving={saving}
      />

      {/* ======================================================
          MODAL EDIT PEGAWAI
      ======================================================= */}
      <EditPegawaiModal
        visible={showEdit}
        pegawai={pegawaiEdit}
        onSimpan={handleEditPegawai}
        onBatal={handleBatalEdit}
        saving={savingEdit}
      />

      {/* ======================================================
          LOADING OVERLAY SAAT TAMBAH
      ======================================================= */}
      {saving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center py-6 shadow-xl rounded-2xl bg-slate-900/90 px-7">
            <div className="border-4 rounded-full h-9 w-9 animate-spin border-white/30 border-t-white" />

            <p className="mt-3 text-sm font-medium text-white">Menyimpan...</p>
          </div>
        </div>
      )}
    </div>
  );
}
