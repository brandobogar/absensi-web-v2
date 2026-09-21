import { useEffect, useState } from "react";
import { callApi } from "../../api";

function Absen({ userData, onAbsenSuccess }) {
  const [sesiAktif, setSesiAktif] = useState(null);

  const [gpsStatus, setGpsStatus] = useState("Mengecek sesi waktu...");

  const [jarakMeter, setJarakMeter] = useState(null);
  const [isLokasiValid, setIsLokasiValid] = useState(false);

  const [loadingSesi, setLoadingSesi] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [sudahAbsen, setSudahAbsen] = useState(false);

  const [loadingGPS, setLoadingGPS] = useState(false);
  const [loadingAbsen, setLoadingAbsen] = useState(false);

  // =========================
  // KONFIGURASI KANTOR
  // =========================

  const [configKantor, setConfigKantor] = useState({
    radius: null,
    kantorLat: null,
    kantorLng: null,
  });

  const [loadingConfig, setLoadingConfig] = useState(true);

  // =========================
  // CEK HARI
  // =========================

  const isJumat = new Date().getDay() === 5;

  // =========================
  // LOAD KONFIGURASI KANTOR
  // =========================

  useEffect(() => {
    loadConfigKantor();
  }, []);

  const loadConfigKantor = async () => {
    setLoadingConfig(true);

    try {
      const result = await callApi("getConfig", {
        opdId: userData.opd_id,
        session_token: userData.session_token,
      });

      if (result) {
        setConfigKantor({
          radius: parseFloat(result.radius || 0),
          kantorLat: parseFloat(result.kantorLat || 0),
          kantorLng: parseFloat(result.kantorLng || 0),
        });
      }
    } catch (error) {
      console.error("Gagal mengambil konfigurasi kantor:", error);

      setGpsStatus("❌ Gagal mengambil konfigurasi kantor.");
    } finally {
      setLoadingConfig(false);
    }
  };

  // =========================
  // CEK SESI ABSENSI
  // =========================

  useEffect(() => {
    cekSesiWaktu();
  }, []);

  const cekSesiWaktu = async () => {
    setLoadingSesi(true);
    setSudahAbsen(false);

    try {
      const res = await callApi("getSesi", {
        opdId: userData.opd_id,
        session_token: userData.session_token,
      });

      if (res && res.sesi) {
        const sesi = res.sesi;

        setSesiAktif(sesi);

        await cekStatusAbsen(sesi);
      } else {
        setSesiAktif(null);
        setGpsStatus("⏰ Saat ini berada di luar jam absen.");
      }
    } catch (error) {
      console.error("Gagal mengecek sesi:", error);

      setSesiAktif(null);
      setGpsStatus("❌ Gagal mengecek sesi absensi.");
    } finally {
      setLoadingSesi(false);
    }
  };

  // =========================
  // CEK STATUS ABSEN HARI INI
  // =========================

  const cekStatusAbsen = async (sesi) => {
    setLoadingStatus(true);

    try {
      const result = await callApi("getStatusAbsen", {
        id_pegawai: userData.id_pegawai,
        session_token: userData.session_token,
      });

      if (result && result[sesi] && result[sesi] !== "-") {
        setSudahAbsen(true);
        setIsLokasiValid(false);
        setJarakMeter(null);

        setGpsStatus(
          `✅ Anda sudah melakukan absen ${sesi} pada pukul ${result[sesi]}.`,
        );

        window.alert(
          `Anda sudah melakukan absen ${sesi} pada pukul ${result[sesi]}.`,
        );
      } else {
        setSudahAbsen(false);

        setGpsStatus(`Sesi aktif: ${sesi}. Silakan verifikasi posisi Anda.`);
      }
    } catch (error) {
      console.error("Gagal mengecek status absensi:", error);

      setSudahAbsen(false);

      setGpsStatus("❌ Gagal mengecek status absensi.");
    } finally {
      setLoadingStatus(false);
    }
  };

  // =========================
  // HITUNG JARAK GPS
  // =========================

  const hitungJarak = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;

    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // =========================
  // CEK LOKASI GPS
  // =========================

  const cekLokasiGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus("❌ Browser tidak mendukung GPS.");
      return;
    }

    if (
      !configKantor.kantorLat ||
      !configKantor.kantorLng ||
      !configKantor.radius
    ) {
      setGpsStatus("❌ Konfigurasi lokasi kantor belum tersedia.");
      return;
    }

    setLoadingGPS(true);

    setGpsStatus("⏳ Mendeteksi lokasi GPS...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;

        const userLng = position.coords.longitude;

        const distance = hitungJarak(
          userLat,
          userLng,
          configKantor.kantorLat,
          configKantor.kantorLng,
        );

        const roundedDist = Math.round(distance);

        // Lokasi dan jarak tetap dicatat,
        // termasuk pada hari Jumat/WFH.

        setJarakMeter({
          lat: userLat,
          lng: userLng,
          jarak: roundedDist,
        });

        // =========================
        // ATURAN LOKASI
        // =========================
        //
        // Jumat = WFH
        // Radius tidak digunakan untuk
        // menentukan valid/tidaknya lokasi.
        //
        // Senin-Kamis:
        // Radius tetap berlaku.
        // =========================

        if (isJumat) {
          setIsLokasiValid(true);

          setGpsStatus(
            `✅ WFH Jumat. Lokasi tercatat. Jarak: ${roundedDist} meter dari kantor.`,
          );
        } else if (roundedDist <= configKantor.radius) {
          setIsLokasiValid(true);

          setGpsStatus(
            `✅ Lokasi Valid! Jarak: ${roundedDist} meter dari kantor.`,
          );
        } else {
          setIsLokasiValid(false);

          setGpsStatus(`❌ Di luar area kantor! Jarak: ${roundedDist} meter.`);
        }

        setLoadingGPS(false);
      },

      (error) => {
        console.error("GPS Error:", error);

        let pesan = "❌ Gagal mengambil GPS.";

        if (error.code === 1) {
          pesan =
            "❌ Izin akses lokasi ditolak. Silakan izinkan lokasi pada browser.";
        } else if (error.code === 2) {
          pesan =
            "❌ Lokasi tidak tersedia. Pastikan GPS/lokasi perangkat aktif.";
        } else if (error.code === 3) {
          pesan = "❌ Waktu pengambilan lokasi habis. Silakan coba lagi.";
        }

        setGpsStatus(pesan);
        setLoadingGPS(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  // =========================
  // SIMPAN ABSENSI
  // =========================

  const submitAbsenFinal = async () => {
    if (!jarakMeter || !sesiAktif) {
      return;
    }

    setLoadingAbsen(true);

    setGpsStatus("⏳ Menyimpan absensi...");

    try {
      const result = await callApi("simpanAbsensi", {
        id_pegawai: userData.id_pegawai,

        nama: userData.nama,

        opd_id: userData.opd_id,

        sesi: sesiAktif,

        lat: jarakMeter.lat,

        lng: jarakMeter.lng,

        jarak: jarakMeter.jarak,

        session_token: userData.session_token,
      });

      if (result && result.status === "APPROVED") {
        window.alert(`Absen ${sesiAktif} Berhasil Disimpan!`);

        if (onAbsenSuccess) {
          onAbsenSuccess();
        }

        return;
      }

      const pesanError =
        result && result.message
          ? result.message
          : "Absensi ditolak atau jarak melebihi batas.";

      window.alert(`Gagal Ditolak\n\n${pesanError}`);

      setGpsStatus(`❌ ${pesanError}`);
    } catch (error) {
      console.error("Gagal menyimpan absensi:", error);

      setGpsStatus("❌ Terjadi kesalahan saat menyimpan absensi.");

      window.alert("Gagal menyimpan absensi. Silakan coba lagi.");
    } finally {
      setLoadingAbsen(false);
    }
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="p-4 min-h-[calc(100vh-80px)] flex items-center">
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          {/* HEADER */}

          <div className="text-center mb-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <span className="text-3xl">📍</span>
            </div>

            <h1 className="text-xl font-bold text-slate-800">Absensi GPS</h1>

            <p className="text-sm text-slate-500 mt-1">
              {userData?.nama || "-"}
            </p>
          </div>

          {/* INFORMASI WFH JUMAT */}

          {isJumat && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🏠</span>
                </div>

                <div>
                  <p className="text-sm font-bold text-amber-700">WFH Jumat</p>

                  <p className="text-xs text-amber-600 mt-0.5">
                    Lokasi tetap dicatat, tetapi radius kantor tidak berlaku.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SESI */}

          {sesiAktif && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs font-medium text-blue-500 mb-1">
                Sesi Absensi
              </p>

              <p className="text-lg font-bold text-blue-700">{sesiAktif}</p>
            </div>
          )}

          {/* STATUS */}

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
            <p className="text-sm text-slate-600 text-center leading-6">
              {loadingSesi || loadingConfig || loadingStatus ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                  Memuat...
                </span>
              ) : (
                gpsStatus
              )}
            </p>
          </div>

          {/* TOMBOL GPS */}

          {sesiAktif && !sudahAbsen && !isLokasiValid && (
            <button
              type="button"
              onClick={cekLokasiGPS}
              disabled={loadingGPS || loadingConfig || loadingStatus}
              className="
                w-full
                py-3.5
                px-4
                bg-blue-600
                text-white
                rounded-xl
                font-semibold
                text-sm
                hover:bg-blue-700
                active:bg-blue-800
                disabled:bg-blue-300
                transition
              "
            >
              {loadingGPS ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Mendeteksi Lokasi...
                </span>
              ) : (
                "📍 Check In (Verifikasi GPS)"
              )}
            </button>
          )}

          {/* JARAK */}

          {jarakMeter && !sudahAbsen && (
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-500">Jarak dari kantor</p>

              <p className="text-lg font-bold text-slate-800 mt-1">
                {jarakMeter.jarak} meter
              </p>

              <p className="text-xs text-slate-400 mt-1">
                {isJumat
                  ? "WFH Jumat — radius kantor tidak berlaku"
                  : `Radius yang diizinkan: ${configKantor.radius} meter`}
              </p>
            </div>
          )}

          {/* TOMBOL KIRIM ABSEN */}

          {isLokasiValid && !sudahAbsen && (
            <button
              type="button"
              onClick={submitAbsenFinal}
              disabled={loadingAbsen}
              className="
                w-full
                mt-4
                py-3.5
                px-4
                bg-green-600
                text-white
                rounded-xl
                font-semibold
                text-sm
                hover:bg-green-700
                active:bg-green-800
                disabled:bg-green-300
                transition
              "
            >
              {loadingAbsen ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Menyimpan Absensi...
                </span>
              ) : (
                "✅ Kirim Absen Sekarang"
              )}
            </button>
          )}

          {/* JIKA SUDAH ABSEN */}

          {!loadingSesi && !loadingStatus && sesiAktif && sudahAbsen && (
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-green-600">
                ✅ Anda sudah melakukan absen pada sesi ini.
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Tidak perlu melakukan absensi kembali.
              </p>
            </div>
          )}

          {/* JIKA DI LUAR SESI */}

          {!loadingSesi && !sesiAktif && (
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-400">
                Silakan kembali pada jam absensi yang telah ditentukan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Absen;
