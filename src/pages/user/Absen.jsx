import { useEffect, useState } from "react";
import { callApi } from "../../api";

function Absen({ userData, onAbsenSuccess }) {
  const [sesiAktif, setSesiAktif] = useState(null);

  const [gpsStatus, setGpsStatus] = useState(
    "Mengecek sesi waktu..."
  );

  const [jarakMeter, setJarakMeter] = useState(null);
  const [isLokasiValid, setIsLokasiValid] = useState(false);

  const [loadingSesi, setLoadingSesi] = useState(true);
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
  // LOAD KONFIGURASI KANTOR
  // =========================
  useEffect(() => {
    loadConfigKantor();
  }, []);

  const loadConfigKantor = async () => {
    setLoadingConfig(true);

    try {
      const result = await callApi("getConfig", {});

      if (result) {
        setConfigKantor({
          radius: parseFloat(result.radius || 0),
          kantorLat: parseFloat(result.kantorLat || 0),
          kantorLng: parseFloat(result.kantorLng || 0),
        });
      }
    } catch (error) {
      console.error(
        "Gagal mengambil konfigurasi kantor:",
        error
      );

      setGpsStatus(
        "❌ Gagal mengambil konfigurasi kantor."
      );
    } finally {
      setLoadingConfig(false);
    }
  };

  // =========================
  // CEK SESI ABSEN
  // =========================
  useEffect(() => {
    cekSesiWaktu();
  }, []);

  const cekSesiWaktu = async () => {
    setLoadingSesi(true);

    try {
      const res = await callApi("getSesi");

      if (res && res.sesi) {
        setSesiAktif(res.sesi);

        setGpsStatus(
          `Sesi aktif: ${res.sesi}. Silakan verifikasi posisi Anda.`
        );
      } else {
        setSesiAktif(null);

        setGpsStatus(
          "⏰ Saat ini berada di luar jam absen."
        );
      }
    } catch (error) {
      console.error(
        "Gagal mengecek sesi:",
        error
      );

      setSesiAktif(null);

      setGpsStatus(
        "❌ Gagal mengecek sesi absensi."
      );
    } finally {
      setLoadingSesi(false);
    }
  };

  // =========================
  // HITUNG JARAK
  // =========================
  const hitungJarak = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {
    const R = 6371000;

    const dLat =
      ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
      ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;
  };

  // =========================
  // CEK LOKASI GPS
  // =========================
  const cekLokasiGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus(
        "❌ Browser tidak mendukung GPS."
      );

      return;
    }

    // Pastikan konfigurasi sudah tersedia
    if (
      !configKantor.kantorLat ||
      !configKantor.kantorLng ||
      !configKantor.radius
    ) {
      setGpsStatus(
        "❌ Konfigurasi lokasi kantor belum tersedia."
      );

      return;
    }

    setLoadingGPS(true);
    setGpsStatus(
      "⏳ Mendeteksi lokasi GPS..."
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat =
          position.coords.latitude;

        const userLng =
          position.coords.longitude;

        const distance = hitungJarak(
          userLat,
          userLng,
          configKantor.kantorLat,
          configKantor.kantorLng
        );

        const roundedDist =
          Math.round(distance);

        setJarakMeter({
          lat: userLat,
          lng: userLng,
          jarak: roundedDist,
        });

        // =========================
        // VALIDASI BERDASARKAN
        // RADIUS DARI CONFIG ADMIN
        // =========================
        if (
          roundedDist <=
          configKantor.radius
        ) {
          setIsLokasiValid(true);

          setGpsStatus(
            `✅ Lokasi Valid! Jarak: ${roundedDist} meter dari kantor.`
          );
        } else {
          setIsLokasiValid(false);

          setGpsStatus(
            `❌ Di luar area kantor! Jarak: ${roundedDist} meter.`
          );
        }

        setLoadingGPS(false);
      },
      (error) => {
        console.error(
          "GPS Error:",
          error
        );

        let pesan =
          "❌ Gagal mengambil GPS.";

        if (error.code === 1) {
          pesan =
            "❌ Izin akses lokasi ditolak. Silakan izinkan lokasi pada browser.";
        } else if (error.code === 2) {
          pesan =
            "❌ Lokasi tidak tersedia. Pastikan GPS/lokasi perangkat aktif.";
        } else if (error.code === 3) {
          pesan =
            "❌ Waktu pengambilan lokasi habis. Silakan coba lagi.";
        }

        setGpsStatus(pesan);
        setLoadingGPS(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // =========================
  // KIRIM ABSEN
  // =========================
  const submitAbsenFinal = async () => {
    if (
      !jarakMeter ||
      !sesiAktif
    ) {
      return;
    }

    setLoadingAbsen(true);

    setGpsStatus(
      "⏳ Menyimpan absensi..."
    );

    try {
      const result = await callApi(
        "simpanAbsensi",
        {
          nama: userData.nama,
          sesi: sesiAktif,
          lat: jarakMeter.lat,
          lng: jarakMeter.lng,
          jarak: jarakMeter.jarak,
        }
      );

      // =========================
      // ABSEN BERHASIL
      // =========================
      if (
        result &&
        result.status === "APPROVED"
      ) {
        window.alert(
          `Absen ${sesiAktif} Berhasil Disimpan!`
        );

        if (onAbsenSuccess) {
          onAbsenSuccess();
        }

        return;
      }

      // =========================
      // ABSEN DITOLAK
      // =========================
      const pesanError =
        result && result.message
          ? result.message
          : "Absensi ditolak atau jarak melebihi batas.";

      window.alert(
        `Gagal Ditolak\n\n${pesanError}`
      );

      setGpsStatus(
        `❌ ${pesanError}`
      );
    } catch (error) {
      console.error(
        "Gagal menyimpan absensi:",
        error
      );

      setGpsStatus(
        "❌ Terjadi kesalahan saat menyimpan absensi."
      );

      window.alert(
        "Gagal menyimpan absensi. Silakan coba lagi."
      );
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
              <span className="text-3xl">
                📍
              </span>
            </div>

            <h1 className="text-xl font-bold text-slate-800">
              Absensi GPS
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              {userData?.nama || "-"}
            </p>
          </div>

          {/* SESI */}
          {sesiAktif && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs font-medium text-blue-500 mb-1">
                Sesi Absensi
              </p>

              <p className="text-lg font-bold text-blue-700">
                {sesiAktif}
              </p>
            </div>
          )}

          {/* STATUS */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
            <p className="text-sm text-slate-600 text-center leading-6">
              {loadingSesi || loadingConfig ? (
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
          {sesiAktif &&
            !isLokasiValid && (
              <button
                type="button"
                onClick={cekLokasiGPS}
                disabled={
                  loadingGPS ||
                  loadingConfig
                }
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
          {jarakMeter && (
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-500">
                Jarak dari kantor
              </p>

              <p className="text-lg font-bold text-slate-800 mt-1">
                {jarakMeter.jarak} meter
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Radius yang diizinkan:{" "}
                {configKantor.radius} meter
              </p>
            </div>
          )}

          {/* TOMBOL KIRIM ABSEN */}
          {isLokasiValid && (
            <button
              type="button"
              onClick={
                submitAbsenFinal
              }
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

          {/* JIKA DI LUAR SESI */}
          {!loadingSesi &&
            !sesiAktif && (
              <div className="mt-4 text-center">
                <p className="text-xs text-slate-400">
                  Silakan kembali pada jam
                  absensi yang telah
                  ditentukan.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Absen;
