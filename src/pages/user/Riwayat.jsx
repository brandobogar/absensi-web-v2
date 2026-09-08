import { useState } from "react";
import { callApi } from "../../api";

function Riwayat({ userData }) {
  // =========================
  // TANGGAL DEFAULT
  // =========================
  const today = new Date();

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const tanggalHariIni = `${yyyy}-${mm}-${dd}`;
  const tanggalAwalBulan = `${yyyy}-${mm}-01`;

  const [dari, setDari] = useState(tanggalAwalBulan);
  const [sampai, setSampai] = useState(tanggalHariIni);

  const [riwayatData, setRiwayatData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sudahDicari, setSudahDicari] = useState(false);

  // =========================
  // CARI RIWAYAT
  // =========================
  const handleCariRiwayat = async () => {
    if (!dari || !sampai) {
      alert("Silakan pilih tanggal terlebih dahulu.");
      return;
    }

    if (dari > sampai) {
      alert("Tanggal mulai tidak boleh lebih besar dari tanggal selesai.");
      return;
    }

    setLoading(true);
    setSudahDicari(true);

    try {
      const res = await callApi("getRiwayat", {
        nama: userData.nama,
        tanggalMulai: dari,
        tanggalSelesai: sampai,
      });

      if (Array.isArray(res)) {
        setRiwayatData(res);
      } else {
        setRiwayatData([]);
      }
    } catch (error) {
      console.error("Gagal mengambil riwayat:", error);
      setRiwayatData([]);
      alert("Gagal mengambil data riwayat.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORMAT TANGGAL
  // =========================
  const formatTanggal = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // FORMAT JAM
  // =========================
  const formatJam = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 pb-24">
      <div className="mx-auto w-full max-w-[480px]">
        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-slate-800">Riwayat Absensi</h1>

          <p className="mt-1 text-sm text-slate-500">{userData?.nama}</p>
        </div>

        {/* =========================
            FILTER TANGGAL
        ========================= */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-800">
            Pilih Periode
          </h2>

          <div className="space-y-4">
            {/* DARI */}
            <div>
              <label
                htmlFor="tanggal-dari"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Dari tanggal
              </label>

              <input
                id="tanggal-dari"
                type="date"
                value={dari}
                max={tanggalHariIni}
                onChange={(e) => setDari(e.target.value)}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-3
                  py-3
                  text-sm
                  text-slate-700
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>

            {/* SAMPAI */}
            <div>
              <label
                htmlFor="tanggal-sampai"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Sampai tanggal
              </label>

              <input
                id="tanggal-sampai"
                type="date"
                value={sampai}
                min={dari}
                max={tanggalHariIni}
                onChange={(e) => setSampai(e.target.value)}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-3
                  py-3
                  text-sm
                  text-slate-700
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>

            {/* TOMBOL CARI */}
            <button
              type="button"
              onClick={handleCariRiwayat}
              disabled={loading}
              className="
                flex
                w-full
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                px-4
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-blue-700
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Memuat...
                </>
              ) : (
                <>🔍 Cari Riwayat</>
              )}
            </button>
          </div>
        </div>

        {/* =========================
            HASIL RIWAYAT
        ========================= */}
        <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800">
              Hasil Riwayat
            </h2>

            {sudahDicari && (
              <span className="text-xs text-slate-400">
                {riwayatData.length} data
              </span>
            )}
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="py-8 text-center">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-3 text-sm text-slate-400">Mengambil data...</p>
            </div>
          ) : riwayatData.length === 0 ? (
            /* EMPTY */
            <div className="py-8 text-center">
              <div className="text-4xl">📋</div>

              <p className="mt-3 text-sm font-medium text-slate-600">
                {sudahDicari
                  ? "Tidak ada data absensi."
                  : "Belum ada data yang dicari."}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Silakan pilih periode tanggal kemudian tekan Cari Riwayat.
              </p>
            </div>
          ) : (
            /* DATA */
            <div className="divide-y divide-slate-100">
              {riwayatData.map((row, index) => {
                const status = row[6];

                const isApproved = status === "APPROVED";

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    {/* INFORMASI ABSENSI */}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800">
                        {formatTanggal(row[0])}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Sesi: {row[2] || "-"}
                      </p>

                      {formatJam(row[0]) && (
                        <p className="mt-0.5 text-xs text-slate-400">
                          Waktu: {formatJam(row[0])}
                        </p>
                      )}
                    </div>

                    {/* STATUS */}
                    <span
                      className={`
                        shrink-0
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        ${
                          isApproved
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {status || "UNKNOWN"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Riwayat;
