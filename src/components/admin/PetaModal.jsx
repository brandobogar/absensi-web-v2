import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// =====================================================
// FIX ICON MARKER LEAFLET
// =====================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// =====================================================
// KLIK PETA
// =====================================================

function MapClickHandler({ onLocationChange }) {
  useMapEvents({
    click(e) {
      onLocationChange({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
    },
  });

  return null;
}

// =====================================================
// KONTROL PETA
// =====================================================

function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.setView(
      [position.latitude, position.longitude],
      map.getZoom()
    );
  }, [position, map]);

  return null;
}

// =====================================================
// PETA MODAL
// =====================================================

export default function PetaModal({
  visible,
  koordinatAwal,
  onSimpan,
  onBatal,
}) {
  const defaultKoordinat = koordinatAwal || {
    latitude: 3.6096906,
    longitude: 125.5056118,
  };

  const [markerPos, setMarkerPos] =
    useState(defaultKoordinat);

  const [loadingLokasi, setLoadingLokasi] =
    useState(false);

  // ===================================================
  // RESET KOORDINAT SAAT MODAL DIBUKA
  // ===================================================

  useEffect(() => {
    if (!visible) return;

    setMarkerPos(
      koordinatAwal || {
        latitude: 3.6096906,
        longitude: 125.5056118,
      }
    );
  }, [visible, koordinatAwal]);

  // ===================================================
  // AMBIL LOKASI SAYA
  // ===================================================

  const keLokasiSaya = () => {
    if (!navigator.geolocation) {
      alert(
        "Browser Anda tidak mendukung fitur lokasi."
      );
      return;
    }

    setLoadingLokasi(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPos = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setMarkerPos(newPos);

        setLoadingLokasi(false);
      },

      (error) => {
        console.error(
          "Gagal mengambil lokasi:",
          error
        );

        let pesan =
          "Tidak dapat mengambil lokasi Anda.";

        if (error.code === 1) {
          pesan =
            "Izin lokasi ditolak. Silakan izinkan akses lokasi pada browser.";
        }

        if (error.code === 2) {
          pesan =
            "Lokasi Anda tidak tersedia.";
        }

        if (error.code === 3) {
          pesan =
            "Waktu pengambilan lokasi habis.";
        }

        alert(pesan);

        setLoadingLokasi(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // ===================================================
  // SIMPAN
  // ===================================================

  const handleSimpan = () => {
    onSimpan(markerPos);
  };

  // ===================================================
  // JANGAN RENDER JIKA MODAL TIDAK AKTIF
  // ===================================================

  if (!visible) {
    return null;
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">

      {/* MODAL */}
      <div
        className="
          w-full
          h-full
          sm:w-[95vw]
          sm:h-[90vh]
          sm:max-w-6xl
          bg-white
          sm:rounded-2xl
          overflow-hidden
          shadow-2xl
          flex
          flex-col
        "
      >

        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className="
            h-14
            sm:h-16
            px-4
            flex
            items-center
            justify-between
            border-b
            border-gray-200
            bg-white
            shrink-0
          "
        >

          {/* BATAL */}

          <button
            type="button"
            onClick={onBatal}
            className="
              text-sm
              font-semibold
              text-red-500
              hover:text-red-600
              transition
            "
          >
            ✕ Batal
          </button>

          {/* JUDUL */}

          <h2
            className="
              text-sm
              sm:text-base
              font-bold
              text-gray-800
            "
          >
            Pilih Lokasi Kantor
          </h2>

          {/* SIMPAN */}

          <button
            type="button"
            onClick={handleSimpan}
            className="
              text-sm
              font-semibold
              text-blue-600
              hover:text-blue-700
              transition
            "
          >
            Simpan ✓
          </button>

        </div>

        {/* =================================================
            PETA
        ================================================== */}

        <div className="flex-1 min-h-0">

          <MapContainer
            center={[
              markerPos.latitude,
              markerPos.longitude,
            ]}
            zoom={17}
            className="w-full h-full"
          >

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* KLIK PETA */}

            <MapClickHandler
              onLocationChange={setMarkerPos}
            />

            {/* PINDAHKAN VIEW PETA */}

            <MapController
              position={markerPos}
            />

            {/* MARKER */}

            <Marker
              position={[
                markerPos.latitude,
                markerPos.longitude,
              ]}
              draggable={true}
              eventHandlers={{
                dragend: (event) => {
                  const marker = event.target;

                  const position =
                    marker.getLatLng();

                  setMarkerPos({
                    latitude: position.lat,
                    longitude: position.lng,
                  });
                },
              }}
            />

          </MapContainer>

        </div>

        {/* =================================================
            INFORMASI KOORDINAT
        ================================================== */}

        <div
          className="
            bg-white
            border-t
            border-gray-200
            p-4
            shrink-0
          "
        >

          <div
            className="
              text-sm
              font-bold
              text-gray-800
              mb-1
            "
          >
            📍 Koordinat Dipilih:
          </div>

          <div className="text-xs text-gray-500">
            Lat: {markerPos.latitude.toFixed(7)}
          </div>

          <div className="text-xs text-gray-500">
            Lng: {markerPos.longitude.toFixed(7)}
          </div>

          {/* LOKASI SAYA */}

          <button
            type="button"
            onClick={keLokasiSaya}
            disabled={loadingLokasi}
            className="
              w-full
              mt-3
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              disabled:bg-blue-400
              text-white
              text-sm
              font-bold
              transition
              flex
              items-center
              justify-center
            "
          >
            {loadingLokasi ? (
              <>
                <span className="mr-2 animate-spin">
                  ⏳
                </span>

                Mengambil Lokasi...
              </>
            ) : (
              "🎯 Ke Lokasi Saya"
            )}
          </button>

        </div>

      </div>
    </div>
  );
}
