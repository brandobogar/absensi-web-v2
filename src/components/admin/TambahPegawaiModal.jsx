import { useEffect, useState } from "react";

export default function TambahPegawaiModal({ visible, onSimpan, onBatal }) {
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [nip, setNip] = useState("");

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (visible) {
      setNama("");
      setUsername("");
      setNip("");
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  const handleSimpan = () => {
    // Sesuai dengan versi React Native:
    // Nama dan username wajib diisi.
    if (!nama.trim() || !username.trim()) {
      alert("Nama dan username wajib diisi!");
      return;
    }

    onSimpan({
      nama: nama.trim(),
      username: username.trim(),
      nip: nip.trim(),
    });

    // Reset form setelah dikirim
    setNama("");
    setUsername("");
    setNip("");
  };

  const handleBatal = () => {
    setNama("");
    setUsername("");
    setNip("");

    onBatal();
  };

  const handleNipChange = (e) => {
    // Hanya angka
    const hanyaAngka = e.target.value.replace(/[^0-9]/g, "");

    // Maksimal 18 digit
    setNip(hanyaAngka.slice(0, 18));
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[1000]
        bg-black/50
        overflow-y-auto
      "
      onMouseDown={(e) => {
        // Jangan tutup modal ketika area dalam modal diklik.
        // Modal hanya ditutup melalui tombol Batal.
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
    >
      <div
        className="flex items-center justify-center min-h-full p-5 "
      >
        <div
          className="
            w-full
            max-w-md
            bg-white
            rounded-[20px]
            shadow-xl
            p-6
          "
        >
          {/* JUDUL */}
          <h2
            className="mb-5 text-lg font-bold text-center  text-slate-800"
          >
            Tambah Pegawai Baru
          </h2>

          {/* NAMA */}
          <label
            htmlFor="tambah-nama"
            className="
              block
              text-[13px]
              font-medium
              text-slate-700
              mb-1.5
            "
          >
            Nama Lengkap
          </label>

          <input
            id="tambah-nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="contoh: Brando Bogar"
            className="
              w-full
              border
              border-slate-300
              rounded-[10px]
              px-3
              py-3
              text-sm
              bg-slate-50
              text-slate-700
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
              mb-3.5
            "
          />

          {/* USERNAME */}
          <label
            htmlFor="tambah-username"
            className="
              block
              text-[13px]
              font-medium
              text-slate-700
              mb-1.5
            "
          >
            Username
          </label>

          <input
            id="tambah-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="contoh: brandobogar"
            autoCapitalize="none"
            autoCorrect="off"
            className="
              w-full
              border
              border-slate-300
              rounded-[10px]
              px-3
              py-3
              text-sm
              bg-slate-50
              text-slate-700
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
              mb-3.5
            "
          />

          {/* NIP */}
          <label
            htmlFor="tambah-nip"
            className="
              block
              text-[13px]
              font-medium
              text-slate-700
              mb-1.5
            "
          >
            NIP
          </label>

          <input
            id="tambah-nip"
            type="text"
            inputMode="numeric"
            value={nip}
            onChange={handleNipChange}
            placeholder="contoh: 199001012020121001"
            maxLength={18}
            className="
              w-full
              border
              border-slate-300
              rounded-[10px]
              px-3
              py-3
              text-sm
              bg-slate-50
              text-slate-700
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
              mb-3.5
            "
          />

          {/* INFO PASSWORD */}
          <div
            className="
              text-xs
              text-slate-500
              text-center
              mb-4
              bg-green-50
              px-2.5
              py-2.5
              rounded-lg
            "
          >
            🔑 Password default:{" "}
            <span className="font-bold text-slate-700">user1234</span>
          </div>

          {/* BUTTON */}
          <div className="flex gap-3">
            {/* BATAL */}
            <button
              type="button"
              onClick={handleBatal}
              className="
                flex-1
                bg-slate-100
                hover:bg-slate-200
                rounded-xl
                py-3.5
                text-slate-500
                font-bold
                text-sm
                transition
              "
            >
              Batal
            </button>

            {/* SIMPAN */}
            <button
              type="button"
              onClick={handleSimpan}
              className="
                flex-1
                bg-blue-600
                hover:bg-blue-700
                rounded-xl
                py-3.5
                text-white
                font-bold
                text-sm
                transition
              "
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
