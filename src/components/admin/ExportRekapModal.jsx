import { useEffect, useState } from "react";

export default function ExportRekapModal({
  visible,
  isSuperAdmin,
  daftarOpd = [],
  selectedOpdId,
  onExport,
  onBatal,
  exporting = false,
}) {
  const sekarang = new Date();

  const [bulan, setBulan] = useState(sekarang.getMonth() + 1);
  const [tahun, setTahun] = useState(sekarang.getFullYear());
  const [opdId, setOpdId] = useState(selectedOpdId || "");

  const daftarBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const daftarTahun = [];

  for (
    let i = sekarang.getFullYear() - 2;
    i <= sekarang.getFullYear() + 1;
    i++
  ) {
    daftarTahun.push(i);
  }

  useEffect(() => {
    if (visible) {
      setBulan(sekarang.getMonth() + 1);
      setTahun(sekarang.getFullYear());
      setOpdId(selectedOpdId || "");
    }
  }, [visible, selectedOpdId]);

  if (!visible) {
    return null;
  }

  const handleExport = () => {
    if (isSuperAdmin && !opdId) {
      alert("Silakan pilih instansi / OPD terlebih dahulu.");
      return;
    }

    onExport({
      opdId,
      bulan,
      tahun,
    });
  };

  const handleBatal = () => {
    if (exporting) return;

    onBatal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5">
          <h2 className="text-center text-lg font-bold text-gray-800">
            Export Rekap Absensi
          </h2>

          <p className="mt-1 text-center text-xs text-gray-500">
            Pilih periode yang ingin diekspor.
          </p>
        </div>

        {/* Pilihan OPD untuk Superadmin */}
        {isSuperAdmin && (
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Instansi / OPD
            </label>

            <select
              value={opdId}
              onChange={(e) => setOpdId(e.target.value)}
              disabled={exporting}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">-- Pilih Instansi --</option>

              {daftarOpd.map((opd) => (
                <option key={opd.opd_id} value={opd.opd_id}>
                  {opd.nama_opd} ({opd.opd_id})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Bulan */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Bulan
          </label>

          <select
            value={bulan}
            onChange={(e) => setBulan(Number(e.target.value))}
            disabled={exporting}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {daftarBulan.map((namaBulan, index) => (
              <option key={index + 1} value={index + 1}>
                {namaBulan}
              </option>
            ))}
          </select>
        </div>

        {/* Tahun */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Tahun
          </label>

          <select
            value={tahun}
            onChange={(e) => setTahun(Number(e.target.value))}
            disabled={exporting}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {daftarTahun.map((tahunItem) => (
              <option key={tahunItem} value={tahunItem}>
                {tahunItem}
              </option>
            ))}
          </select>
        </div>

        {/* Tombol */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleBatal}
            disabled={exporting}
            className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {exporting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Mengekspor...
              </span>
            ) : (
              "Export"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
