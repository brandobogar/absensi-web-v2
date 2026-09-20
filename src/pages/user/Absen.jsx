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

  const [configKantor, setConfigKantor] = useState({
    radius: null,
    kantorLat: null,
    kantorLng: null,
  });

  const [loadingConfig, setLoadingConfig] = useState(true);

  // =========================
  // AMBIL KONFIGURASI KANTOR
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

      console.log("STATUS ABSEN HARI INI:", result);

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

        // Simpan lokasi GPS dan jarak.
        // Data ini tetap dicatat meskipun hari Jumat/WFH.
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
        // Radius TIDAK digunakan untuk
        // menentukan valid/tidaknya lokasi.
        //
        // Senin-Kamis:
        // Radius tetap berlaku.
        // =========================

        const isJumat = new Date().getDay() === 5;

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
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto w-full max-w-md">
        {/* HEADER */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Absensi GPS</h1>

          <p className="mt-1 text-sm text-gray-500">
            Silakan lakukan verifikasi lokasi sebelum absen.
          </p>
        </div>

        {/* SESI */}
        <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Sesi Absensi
          </p>

          {loadingSesi ? (
            <p className="text-sm text-gray-500">⏳ Mengecek sesi...</p>
          ) : sesiAktif ? (
            <p className="text-xl font-bold text-blue-600">{sesiAktif}</p>
          ) : (
            <p className="text-sm font-medium text-gray-500">
              Tidak ada sesi aktif
            </p>
          )}
        </div>

        {/* STATUS */}
        <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Status
          </p>

          <p className="text-sm leading-relaxed text-gray-700">
            {loadingStatus ? "⏳ Mengecek status absensi..." : gpsStatus}
          </p>
        </div>

        {/* KONFIGURASI */}
        {!loadingConfig && configKantor.radius && (
          <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Area Absensi
            </p>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Radius kantor</span>

              <span className="font-semibold text-gray-800">
                {configKantor.radius} meter
              </span>
            </div>
          </div>
        )}

        {/* TOMBOL GPS */}
        {sesiAktif && !sudahAbsen && !isLokasiValid && (
          <button
            type="button"
            onClick={cekLokasiGPS}
            disabled={loadingGPS || loadingAbsen}
            className="mb-4 w-full rounded-2xl bg-blue-600 px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingGPS ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Mendeteksi Lokasi...
              </span>
            ) : (
              "📍 Verifikasi Lokasi"
            )}
          </button>
        )}

        {/* HASIL GPS */}
        {jarakMeter && !sudahAbsen && (
          <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Lokasi GPS
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Latitude</span>

                <span className="font-mono text-gray-700">
                  {jarakMeter.lat}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Longitude</span>

                <span className="font-mono text-gray-700">
                  {jarakMeter.lng}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Jarak dari kantor</span>

                <span className="font-bold text-gray-800">
                  {jarakMeter.jarak} meter
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TOMBOL ABSEN */}
        {isLokasiValid && !sudahAbsen && sesiAktif && (
          <button
            type="button"
            onClick={submitAbsenFinal}
            disabled={loadingAbsen}
            className="w-full rounded-2xl bg-green-600 px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingAbsen ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Menyimpan...
              </span>
            ) : (
              `✅ Absen ${sesiAktif}`
            )}
          </button>
        )}

        {/* SUDAH ABSEN */}
        {sudahAbsen && (
          <div className="rounded-2xl bg-green-50 p-5 text-center">
            <p className="text-sm font-semibold text-green-700">
              ✅ Absensi untuk sesi ini sudah tercatat.
            </p>
          </div>
        )}

        {/* DI LUAR SESI */}
        {!loadingSesi && !sesiAktif && (
          <div className="rounded-2xl bg-yellow-50 p-5 text-center">
            <p className="text-sm font-medium text-yellow-700">
              ⏰ Saat ini tidak ada sesi absensi yang aktif.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Absen;
