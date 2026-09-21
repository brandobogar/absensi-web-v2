import { useEffect, useState } from "react";
import EditProfileModal from "../../components/user/EditProfileModal";
import { callApi } from "../../api";

function Beranda({
  userData,
  onLogout,
  onProfileUpdated,
  refreshTrigger,
}) {
  const [statusAbsen, setStatusAbsen] = useState({
    Masuk: "-",
    Istirahat: "-",
    Pulang: "-",
  });

  const [loadingStatus, setLoadingStatus] = useState(true);

  // =========================
  // MODAL EDIT PROFILE
  // =========================
  const [showEditProfile, setShowEditProfile] = useState(false);

  // =========================
  // DATA JADWAL SESI
  // =========================
  const [jamSesi, setJamSesi] = useState(null);
  const [loadingSesi, setLoadingSesi] = useState(true);

  const [namaOpd, setNamaOpd] = useState("-");

  // =========================
  // LOAD STATUS ABSEN HARI INI
  // =========================
  useEffect(() => {
    loadStatusHariIni();
  }, [userData, refreshTrigger]);

  const loadStatusHariIni = async () => {
    if (!userData?.id_pegawai) {
      setLoadingStatus(false);
      return;
    }

    setLoadingStatus(true);

    try {
      const res = await callApi("getStatusAbsen", {
        id_pegawai: userData.id_pegawai,
        session_token: userData.session_token,
      });
      console.log("HASIL getStatusAbsen BERANDA:", res);
      if (res) {
        setStatusAbsen(res);
      }
    } catch (error) {
      console.error("Gagal mengambil status absen:", error);
    } finally {
      setLoadingStatus(false);
    }
  };

  // =========================
  // LOAD KONFIGURASI JAM SESI
  // =========================
  useEffect(() => {
    if (userData?.opd_id) {
      loadJamSesi();
    }
  }, [userData]);

  const loadJamSesi = async () => {
    setLoadingSesi(true);

    console.log("USERDATA BERANDA:", userData);
    console.log("SESSION TOKEN BERANDA:", userData?.session_token);

    try {
      const result = await callApi("getConfig", {
        opdId: userData.opd_id,
        session_token: userData.session_token,
      });

      console.log("HASIL getConfig BERANDA:", result);

      if (result) {
        setJamSesi({
          senin_masuk_mulai: parseInt(result.senin_masuk_mulai || 420),
          senin_masuk_selesai: parseInt(result.senin_masuk_selesai || 540),

          senin_istirahat_mulai: parseInt(result.senin_istirahat_mulai || 750),
          senin_istirahat_selesai: parseInt(
            result.senin_istirahat_selesai || 840,
          ),

          senin_pulang_mulai: parseInt(result.senin_pulang_mulai || 1020),
          senin_pulang_selesai: parseInt(result.senin_pulang_selesai || 1200),

          jumat_masuk_mulai: parseInt(result.jumat_masuk_mulai || 390),
          jumat_masuk_selesai: parseInt(result.jumat_masuk_selesai || 510),

          jumat_istirahat_mulai: parseInt(result.jumat_istirahat_mulai || 780),
          jumat_istirahat_selesai: parseInt(
            result.jumat_istirahat_selesai || 870,
          ),

          jumat_pulang_mulai: parseInt(result.jumat_pulang_mulai || 1020),
          jumat_pulang_selesai: parseInt(result.jumat_pulang_selesai || 1200),
        });
        setNamaOpd(result.nama_opd || "-");
      }
    } catch (error) {
      console.error("Gagal mengambil konfigurasi jam sesi:", error);
    } finally {
      setLoadingSesi(false);
    }
  };

  // =========================
  // KONVERSI MENIT → JAM
  // =========================
  const menitKeJam = (menit) => {
    const j = Math.floor(menit / 60);
    const m = menit % 60;

    return `${String(j).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  // =========================
  // TENTUKAN JADWAL HARI INI
  // =========================
  const getJadwalHariIni = () => {
    if (!jamSesi) {
      return null;
    }

    const hari = new Date().getDay();

    // Senin - Kamis
    if (hari >= 1 && hari <= 4) {
      return {
        namaHari: "Senin - Kamis",
        sesi: [
          {
            label: "Masuk",
            mulai: jamSesi.senin_masuk_mulai,
            selesai: jamSesi.senin_masuk_selesai,
          },
          {
            label: "Istirahat",
            mulai: jamSesi.senin_istirahat_mulai,
            selesai: jamSesi.senin_istirahat_selesai,
          },
          {
            label: "Pulang",
            mulai: jamSesi.senin_pulang_mulai,
            selesai: jamSesi.senin_pulang_selesai,
          },
        ],
      };
    }

    // Jumat
    if (hari === 5) {
      return {
        namaHari: "Jumat",
        sesi: [
          {
            label: "Masuk",
            mulai: jamSesi.jumat_masuk_mulai,
            selesai: jamSesi.jumat_masuk_selesai,
          },
          {
            label: "Istirahat",
            mulai: jamSesi.jumat_istirahat_mulai,
            selesai: jamSesi.jumat_istirahat_selesai,
          },
          {
            label: "Pulang",
            mulai: jamSesi.jumat_pulang_mulai,
            selesai: jamSesi.jumat_pulang_selesai,
          },
        ],
      };
    }

    // Sabtu & Minggu
    return null;
  };

  // =========================
  // TANGGAL HARI INI
  // =========================
  const getTanggalHariIni = () => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return new Date().toLocaleDateString("id-ID", options);
  };

  const jadwalHariIni = getJadwalHariIni();

  return (
    <div className="p-4">
      {/* =========================
          HEADER / PROFILE
      ========================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-4">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-2xl">👤</span>
          </div>

          {/* PROFILE INFO */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-slate-800 truncate">
              Halo {userData?.nama || "-"}
            </h1>

            <p className="text-xs text-slate-500 mt-0.5">
              NIP: {userData?.nip || "-"}
            </p>

            <p className="text-xs text-slate-500 mt-0.5 truncate">{namaOpd}</p>

            <p className="text-xs text-blue-600 font-medium mt-1">
              {getTanggalHariIni()}
            </p>
          </div>

          {/* EDIT PROFILE */}
          <button
            type="button"
            onClick={() => setShowEditProfile(true)}
            className="
              w-10
              h-10
              rounded-full
              bg-blue-50
              border
              border-blue-200
              flex
              items-center
              justify-center
              shrink-0
              hover:bg-blue-100
              active:bg-blue-200
              transition
            "
            aria-label="Edit profile"
          >
            <span className="text-lg">✏️</span>
          </button>
        </div>
      </div>

      {/* =========================
          JADWAL ABSENSI HARI INI
      ========================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🕐</span>

          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Jadwal Absensi Hari Ini
            </h2>

            {jadwalHariIni && (
              <p className="text-xs text-slate-400 mt-0.5">
                {jadwalHariIni.namaHari}
              </p>
            )}
          </div>
        </div>

        {loadingSesi ? (
          <div className="flex justify-center py-3">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : jadwalHariIni ? (
          <div className="space-y-2">
            {jadwalHariIni.sesi.map((item) => (
              <div
                key={item.label}
                className="
                  flex
                  items-center
                  justify-between
                  bg-slate-50
                  border
                  border-slate-200
                  rounded-xl
                  px-3
                  py-3
                "
              >
                <span className="text-sm font-medium text-slate-600">
                  {item.label}
                </span>

                <span className="text-sm font-bold text-slate-800">
                  {menitKeJam(item.mulai)} - {menitKeJam(item.selesai)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-4 text-center">
            <p className="text-sm text-slate-500">Tidak ada jadwal absensi</p>
          </div>
        )}
      </div>

      {/* =========================
          STATUS ABSEN
      ========================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-4">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">
          Status Absen Hari Ini
        </h2>

        <div className="grid grid-cols-3 gap-2">
          {/* MASUK */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 text-center">
            <p className="text-xs font-medium text-slate-500 mb-2">Masuk</p>

            {loadingStatus ? (
              <div className="h-4 flex justify-center">
                <div className="w-4 h-4 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : (
              <p
                className={`text-sm font-bold ${
                  statusAbsen.Masuk !== "-"
                    ? "text-green-600"
                    : "text-slate-400"
                }`}
              >
                {statusAbsen.Masuk}
              </p>
            )}
          </div>

          {/* ISTIRAHAT */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 text-center">
            <p className="text-xs font-medium text-slate-500 mb-2">Istirahat</p>

            {loadingStatus ? (
              <div className="h-4 flex justify-center">
                <div className="w-4 h-4 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : (
              <p
                className={`text-sm font-bold ${
                  statusAbsen.Istirahat !== "-"
                    ? "text-green-600"
                    : "text-slate-400"
                }`}
              >
                {statusAbsen.Istirahat}
              </p>
            )}
          </div>

          {/* PULANG */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 text-center">
            <p className="text-xs font-medium text-slate-500 mb-2">Pulang</p>

            {loadingStatus ? (
              <div className="h-4 flex justify-center">
                <div className="w-4 h-4 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : (
              <p
                className={`text-sm font-bold ${
                  statusAbsen.Pulang !== "-"
                    ? "text-green-600"
                    : "text-slate-400"
                }`}
              >
                {statusAbsen.Pulang}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* =========================
          LOGOUT
      ========================= */}
      <button
        type="button"
        onClick={onLogout}
        className="
          w-full
          py-3
          px-4
          bg-red-50
          text-red-600
          border
          border-red-200
          rounded-xl
          font-semibold
          text-sm
          hover:bg-red-100
          active:bg-red-200
          transition
        "
      >
        🚪 Keluar Akun
      </button>

      {/* =========================
          EDIT PROFILE MODAL
      ========================= */}
      <EditProfileModal
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        userData={userData}
        onProfileUpdated={onProfileUpdated}
      />
    </div>
  );
}

export default Beranda;