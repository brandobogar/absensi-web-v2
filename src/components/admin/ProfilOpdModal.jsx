import { useEffect, useState } from "react";
import { callApi } from "../../api";

// ============================================================
// PROFIL OPD MODAL
//
// Untuk diisi Admin OPD (profil OPD miliknya sendiri).
// Data ini dipakai mengisi blok tanda tangan pada ekspor rekap.
//
// Props:
//   visible  : modal tampil atau tidak
//   opdId    : OPD yang profilnya diedit
//   userData : perlu userData.session_token
//   onBatal  : () => void, dipanggil setelah simpan berhasil juga
// ============================================================
export default function ProfilOpdModal({ visible, opdId, userData, onBatal }) {
  const [kota, setKota] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [namaPimpinan, setNamaPimpinan] = useState("");
  const [pangkat, setPangkat] = useState("");
  const [nip, setNip] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ==========================================================
  // MUAT PROFIL SAAT MODAL DIBUKA
  // ==========================================================
  useEffect(() => {
    if (!visible || !opdId) return;

    let batal = false;

    const muat = async () => {
      setLoading(true);

      try {
        const result = await callApi("getProfilOpd", {
          opdId,
          session_token: userData?.session_token,
        });

        if (!batal && result && !result.status) {
          setKota(result.kota || "");
          setJabatan(result.jabatan || "");
          setNamaPimpinan(result.nama_pimpinan || "");
          setPangkat(result.pangkat || "");
          setNip(result.nip || "");
        } else if (!batal) {
          alert(result?.message || "Gagal memuat profil OPD.");
        }
      } catch (error) {
        console.error("Muat profil OPD:", error);
        if (!batal) alert("Terjadi kesalahan saat memuat profil OPD.");
      } finally {
        if (!batal) setLoading(false);
      }
    };

    muat();

    return () => {
      batal = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, opdId]);

  // ==========================================================
  // SIMPAN
  // ==========================================================
  const handleSimpan = async () => {
    setSaving(true);

    try {
      const result = await callApi("updateProfilOpd", {
        opdId,
        data: {
          kota: kota.trim(),
          jabatan: jabatan.trim(),
          nama_pimpinan: namaPimpinan.trim(),
          pangkat: pangkat.trim(),
          nip: nip.trim(),
        },
        session_token: userData?.session_token,
      });

      if (result?.status === "berhasil") {
        alert("Profil OPD berhasil disimpan.");
        onBatal();
      } else {
        alert(result?.message || "Gagal menyimpan profil OPD.");
      }
    } catch (error) {
      console.error("Simpan profil OPD:", error);
      alert("Terjadi kesalahan saat menyimpan profil OPD.");
    } finally {
      setSaving(false);
    }
  };

  if (!visible) {
    return null;
  }

  const disabled = loading || saving;

  return (
    <div className="fixed inset-0 z-[1000] overflow-y-auto bg-black/50">
      <div className="flex items-center justify-center min-h-full p-5">
        <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-[20px]">
          <h2 className="mb-1 text-lg font-bold text-center text-slate-800">
            Profil OPD
          </h2>

         

          {loading ? (
            <p className="py-6 text-sm text-center text-slate-400">
              Memuat profil...
            </p>
          ) : (
            <>
              <div className="mb-4">
                <label className="block mb-1.5 text-[13px] font-medium text-slate-700">
                  Kota
                </label>

                <input
                  type="text"
                  value={kota}
                  onChange={(e) => setKota(e.target.value)}
                  placeholder="Contoh: Tahuna"
                  disabled={disabled}
                  className="w-full px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1.5 text-[13px] font-medium text-slate-700">
                  Jabatan Pimpinan
                </label>

                <input
                  type="text"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  placeholder="Contoh: Kepala Dinas Kesehatan"
                  disabled={disabled}
                  className="w-full px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1.5 text-[13px] font-medium text-slate-700">
                  Nama Pimpinan
                </label>

                <input
                  type="text"
                  value={namaPimpinan}
                  onChange={(e) => setNamaPimpinan(e.target.value)}
                  placeholder="Nama lengkap"
                  disabled={disabled}
                  className="w-full px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1.5 text-[13px] font-medium text-slate-700">
                  Pangkat / Golongan
                </label>

                <input
                  type="text"
                  value={pangkat}
                  onChange={(e) => setPangkat(e.target.value)}
                  placeholder="Contoh: Pembina / IV-a"
                  disabled={disabled}
                  className="w-full px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                />
              </div>

              <div className="mb-5">
                <label className="block mb-1.5 text-[13px] font-medium text-slate-700">
                  NIP
                </label>

                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="Contoh: 19700101 199001 1 001"
                  disabled={disabled}
                  className="w-full px-3 py-3 text-sm border outline-none bg-slate-50 border-slate-300 rounded-[10px] text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                />
              </div>
            </>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBatal}
              disabled={saving}
              className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 rounded-xl text-slate-500 font-bold text-sm transition"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSimpan}
              disabled={disabled}
              className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl text-white font-bold text-sm transition"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}