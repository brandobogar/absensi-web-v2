function AbsenStatusModal({ type, userData, sesi, waktu, message, onClose }) {
  const isSuccess = type === "success";

  const configMap = {
    success: {
      title: "Absen Berhasil",
      description: "Absensi Anda berhasil dicatat.",
      status: "Tercatat di sistem",
      icon: "✓",
      iconBg: "bg-green-100",
      iconColor: "bg-green-500",
      textColor: "text-green-600",
      buttonColor: "bg-green-600 hover:bg-green-700 active:bg-green-800",
    },

    already: {
      title: "Sudah Absen",
      description: "Absensi untuk sesi ini sudah tercatat.",
      status: "Absensi sudah tercatat",
      icon: "✓",
      iconBg: "bg-blue-100",
      iconColor: "bg-blue-500",
      textColor: "text-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
    },

    rejected: {
      title: "Absen Ditolak",
      description: "Absensi tidak dapat diproses.",
      status: "Absensi ditolak oleh sistem",
      icon: "!",
      iconBg: "bg-red-100",
      iconColor: "bg-red-500",
      textColor: "text-red-600",
      buttonColor: "bg-red-600 hover:bg-red-700 active:bg-red-800",
    },

    error: {
      title: "Terjadi Kesalahan",
      description: "Absensi tidak dapat diproses.",
      status: "Silakan coba lagi",
      icon: "!",
      iconBg: "bg-orange-100",
      iconColor: "bg-orange-500",
      textColor: "text-orange-600",
      buttonColor: "bg-orange-500 hover:bg-orange-600 active:bg-orange-700",
    },
  };

  const config = configMap[type] || configMap.error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6">
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-20 h-20 rounded-full ${config.iconBg} flex items-center justify-center`}
          >
            <div
              className={`w-14 h-14 rounded-full ${config.iconColor} flex items-center justify-center`}
            >
              <span className="text-3xl text-white font-bold">
                {config.icon}
              </span>
            </div>
          </div>
        </div>

        {/* JUDUL */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800">{config.title}</h2>

          <p className="text-sm text-slate-500 mt-1">{config.description}</p>
        </div>

        {/* DETAIL ABSEN */}
        <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Pegawai</p>

            <p className="font-semibold text-slate-800">
              {userData?.nama || "-"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">Sesi</p>

              <p className="font-bold text-blue-600">{sesi || "-"}</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">Waktu</p>

              <p className="font-bold text-slate-700">{waktu || "-"}</p>
            </div>
          </div>
        </div>
        {message && (
          <div className="mt-3 bg-white border border-slate-200 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-1">Keterangan</p>

            <p className="text-sm text-slate-600 leading-5">{message}</p>
          </div>
        )}

        {/* STATUS */}
        <div
          className={`mt-4 flex items-center justify-center gap-2 text-sm ${config.textColor} font-medium`}
        >
          <span>{config.icon}</span>
          <span>{config.status}</span>
        </div>

        {/* BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className={`
            w-full
            mt-5
            py-3
            px-4
            text-white
            rounded-xl
            font-semibold
            text-sm
            transition
            ${config.buttonColor}
          `}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

export default AbsenStatusModal;
