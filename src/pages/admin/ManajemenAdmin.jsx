import { useEffect, useState } from "react";

export default function ManajemenAdmin({
  callApi,
  opdId,
  onKembali,
}) {
  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdmin = async () => {
    if (!opdId) return;

    setLoading(true);

    try {
      const result = await callApi("getAdmin", {
        opdId,
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

  useEffect(() => {
    fetchAdmin();
  }, [opdId]);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm border-slate-200">
        <div className="max-w-5xl px-4 py-4 mx-auto sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onKembali}
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              ← Kembali
            </button>

            <h1 className="text-base font-bold sm:text-lg text-slate-800">
              Manajemen Admin
            </h1>

            <div className="w-16" />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-5xl px-4 py-5 mx-auto sm:px-6">
        <div className="p-4 mb-4 bg-white border shadow-sm rounded-2xl border-slate-200">
          <p className="text-xs text-slate-400">
            OPD
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            {opdId || "-"}
          </p>
        </div>

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
              disabled={loading}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              ↻ Refresh
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="border-4 rounded-full h-9 w-9 animate-spin border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Memuat data admin...
            </p>
          </div>
        ) : adminList.length === 0 ? (
          <div className="px-6 py-12 text-center bg-white border rounded-2xl border-slate-200">
            <div className="mb-3 text-4xl">
              👤
            </div>

            <p className="text-sm font-semibold text-slate-700">
              Belum ada admin
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Belum ada akun admin untuk OPD ini.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {adminList.map((admin, index) => (
              <div
                key={admin.username || index}
                className="p-4 bg-white border shadow-sm rounded-2xl border-slate-200 sm:p-5"
              >
                <div className="flex items-start justify-between gap-4">
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

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                      String(admin.status || "")
                        .toLowerCase()
                        .trim() === "aktif"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {admin.status || "-"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}