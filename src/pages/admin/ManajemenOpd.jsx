import { useEffect, useState } from "react";
import TambahOpdModal from "../../components/admin/TambahOpdModal";
import EditOpdModal from "../../components/admin/EditOpdModal";
import ManajemenAdmin from "./ManajemenAdmin";

export default function ManajemenOpd({ callApi, onKembali, userData }) {
  const [opdList, setOpdList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showTambah, setShowTambah] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [opdEdit, setOpdEdit] = useState(null);
  const [configEdit, setConfigEdit] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [opdAdmin, setOpdAdmin] = useState(null);

  // Pencarian
  const [search, setSearch] = useState("");

  // ============================================================
  // AMBIL DATA OPD
  // ============================================================

  const fetchOpd = async () => {
    setLoading(true);

    try {
      const result = await callApi("getDaftarOpd", {
        session_token: userData?.session_token,
      });

      console.log("DAFTAR OPD:", result);

      if (Array.isArray(result)) {
        setOpdList(result);
      } else {
        alert("Gagal memuat data OPD.");
      }
    } catch (error) {
      console.error("fetchOpd:", error);
      alert("Terjadi kesalahan saat memuat data OPD.");
    } finally {
      setLoading(false);
    }
  };

  const handleTambahOpd = async ({ namaOpd, kantorLat, kantorLng, radius }) => {
    setSaving(true);

    try {
      const result = await callApi("tambahOpd", {
        namaOpd,
        kantorLat,
        kantorLng,
        radius,
        session_token: userData?.session_token,
      });

      console.log("HASIL TAMBAH OPD:", result);

      if (result?.status === "berhasil") {
        setShowTambah(false);

        alert(
          `OPD berhasil ditambahkan!\n\n${result.opd_id} - ${result.nama_opd}`,
        );

        await fetchOpd();
      } else {
        alert(result?.message || "Gagal menambahkan OPD.");
      }
    } catch (error) {
      console.error("handleTambahOpd:", error);
      alert("Terjadi kesalahan saat menambahkan OPD.");
    } finally {
      setSaving(false);
    }
  };

  // Ambil pengaturan (jam sesi) OPD lalu buka form Edit
  const bukaEdit = async (opd) => {
    setLoadingEdit(true);

    try {
      const config = await callApi("getConfig", {
        opdId: opd.opd_id,
        session_token: userData?.session_token,
      });

      if (
        config &&
        typeof config === "object" &&
        config.senin_masuk_mulai !== undefined
      ) {
        setConfigEdit(config);
        setOpdEdit(opd);
        setShowEdit(true);
      } else {
        alert(config?.message || "Gagal memuat pengaturan OPD.");
      }
    } catch (error) {
      console.error("bukaEdit:", error);
      alert("Terjadi kesalahan saat memuat pengaturan OPD.");
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleEditOpd = async ({ opdId, namaOpd, namaBerubah, dataConfig }) => {
    setSaving(true);

    try {
      const adaConfig = Object.keys(dataConfig || {}).length > 0;

      // 1) Pengaturan (radius, lokasi, jam sesi) - satu panggilan
      if (adaConfig) {
        const hasilConfig = await callApi("updateConfigOpd", {
          opdId,
          data: dataConfig,
          session_token: userData?.session_token,
        });

        if (hasilConfig?.status !== "berhasil") {
          alert(hasilConfig?.message || "Gagal menyimpan pengaturan OPD.");
          return;
        }
      }

      // 2) Nama OPD
      if (namaBerubah) {
        const hasilNama = await callApi("updateOpd", {
          opdId,
          namaOpd,
          session_token: userData?.session_token,
        });

        if (hasilNama?.status !== "berhasil") {
          alert(
            adaConfig
              ? `Pengaturan tersimpan, tetapi nama OPD gagal diperbarui: ${
                  hasilNama?.message || "terjadi kesalahan"
                }`
              : hasilNama?.message || "Gagal memperbarui OPD.",
          );

          if (adaConfig) {
            await fetchOpd();
          }

          return;
        }
      }

      setShowEdit(false);
      setOpdEdit(null);
      setConfigEdit(null);

      alert("Perubahan OPD berhasil disimpan.");

      await fetchOpd();
    } catch (error) {
      console.error("handleEditOpd:", error);
      alert("Terjadi kesalahan saat memperbarui OPD.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchOpd();
  }, []);

  // ============================================================
  // FILTER PENCARIAN
  // ============================================================

  const opdFiltered = opdList.filter((opd) => {
    // OPD000 adalah environment Super Admin, tidak ditampilkan
    if (String(opd.opd_id || "").trim() === "OPD000") {
      return false;
    }

    const keyword = search.toLowerCase().trim();

    if (!keyword) return true;

    return (
      String(opd.nama_opd || "")
        .toLowerCase()
        .includes(keyword) ||
      String(opd.opd_id || "")
        .toLowerCase()
        .includes(keyword)
    );
  });

  // ============================================================
  // RENDER
  // ============================================================

  if (opdAdmin) {
    return (
      <ManajemenAdmin
        callApi={callApi}
        opdId={opdAdmin.opd_id}
        onKembali={() => setOpdAdmin(null)}
        userData={userData}
      />
    );
  }

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
              Manajemen OPD
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
        {/* PENCARIAN */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama OPD atau ID OPD..."
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

        {/* INFO */}
        {!loading && opdList.length > 0 && (
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500">
              Menampilkan{" "}
              <span className="font-semibold text-slate-700">
                {opdFiltered.length}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-slate-700">
                {opdList.length - 1}
              </span>{" "}
              OPD
            </p>

            <button
              type="button"
              onClick={fetchOpd}
              disabled={loading}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              ↻ Refresh
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading && opdList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="border-4 rounded-full h-9 w-9 animate-spin border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">Memuat data OPD...</p>
          </div>
        ) : opdList.length === 0 ? (
          <div className="px-6 py-12 text-center bg-white border rounded-2xl border-slate-200">
            <div className="mb-3 text-4xl">🏢</div>

            <p className="text-sm font-semibold text-slate-700">
              Belum ada data OPD
            </p>
          </div>
        ) : opdFiltered.length === 0 ? (
          <div className="px-6 text-center bg-white border rounded-2xl border-slate-200 py-14">
            <div className="mb-3 text-4xl">🔎</div>

            <p className="text-sm font-bold text-slate-700">
              OPD tidak ditemukan
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
             DAFTAR OPD
          =================================================== */
          <div className="space-y-3">
            {opdFiltered.map((opd, index) => (
              <div
                key={opd.opd_id || index}
                className="p-4 bg-white border shadow-sm rounded-2xl border-slate-200 sm:p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold sm:text-base text-slate-800">
                      {opd.nama_opd || "-"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      ID: {opd.opd_id || "-"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        String(opd.status_opd || "")
                          .toLowerCase()
                          .trim() === "aktif"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {opd.status_opd || "-"}
                    </span>

                    <button
                      type="button"
                      onClick={() => bukaEdit(opd)}
                      disabled={loadingEdit}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-600 transition border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 disabled:opacity-60"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpdAdmin(opd)}
                      className="px-3 py-1.5 text-xs font-semibold text-purple-600 transition border border-purple-200 rounded-lg bg-purple-50 hover:bg-purple-100"
                    >
                      👤 Admin
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-4 mt-4 border-t sm:grid-cols-3 border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400">Radius</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {opd.radius ?? "-"} meter
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Latitude</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {opd.kantorLat != null
                        ? Number(opd.kantorLat).toFixed(6)
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Longitude</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {opd.kantorLng != null
                        ? Number(opd.kantorLng).toFixed(6)
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <TambahOpdModal
        visible={showTambah}
        onSimpan={handleTambahOpd}
        onBatal={() => {
          if (saving) return;
          setShowTambah(false);
        }}
        saving={saving}
      />

      <EditOpdModal
        visible={showEdit}
        opd={opdEdit}
        config={configEdit}
        onSimpan={handleEditOpd}
        onBatal={() => {
          if (saving) return;

          setShowEdit(false);
          setOpdEdit(null);
          setConfigEdit(null);
        }}
        saving={saving}
      />

      {loadingEdit && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center px-7 py-6 shadow-xl rounded-2xl bg-slate-900/90">
            <div className="w-9 h-9 border-4 border-white/30 rounded-full animate-spin border-t-white" />

            <p className="mt-3 text-sm font-medium text-white">
              Memuat pengaturan OPD...
            </p>
          </div>
        </div>
      )}

      {saving && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center px-7 py-6 shadow-xl rounded-2xl bg-slate-900/90">
            <div className="w-9 h-9 border-4 border-white/30 rounded-full animate-spin border-t-white" />

            <p className="mt-3 text-sm font-medium text-white">
              Menyimpan perubahan...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
