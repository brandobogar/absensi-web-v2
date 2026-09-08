import { useState } from "react";

function UserLayout({ children, activeTab = "beranda", onTabChange }) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabChange = (tab) => {
    setCurrentTab(tab);

    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* =========================
          MOBILE CONTAINER
      ========================= */}
      <div className="mx-auto w-full max-w-[480px] min-h-screen bg-slate-50 flex flex-col">
        {/* =========================
            CONTENT
        ========================= */}
        <main className="flex-1 pb-20">{children}</main>

        {/* =========================
            BOTTOM NAVIGATION
        ========================= */}
        <nav
          className="
            fixed
            bottom-0
            left-1/2
            -translate-x-1/2
            w-full
            max-w-[480px]
            bg-white
            border-t
            border-slate-200
            z-50
          "
        >
          <div className="flex items-center justify-around h-16">
            {/* BERANDA */}
            <button
              type="button"
              onClick={() => handleTabChange("beranda")}
              className="
                flex
                flex-col
                items-center
                justify-center
                w-full
                h-full
                transition
              "
            >
              <span
                className={`text-xl leading-none ${
                  currentTab === "beranda" ? "opacity-100" : "opacity-50"
                }`}
              >
                🏠
              </span>

              <span
                className={`text-xs mt-1 ${
                  currentTab === "beranda"
                    ? "text-blue-600 font-semibold"
                    : "text-slate-400"
                }`}
              >
                Beranda
              </span>
            </button>

            {/* ABSEN */}
            <button
              type="button"
              onClick={() => handleTabChange("absen")}
              className="
                flex
                flex-col
                items-center
                justify-center
                w-full
                h-full
                transition
              "
            >
              <span
                className={`text-xl leading-none ${
                  currentTab === "absen" ? "opacity-100" : "opacity-50"
                }`}
              >
                📍
              </span>

              <span
                className={`text-xs mt-1 ${
                  currentTab === "absen"
                    ? "text-blue-600 font-semibold"
                    : "text-slate-400"
                }`}
              >
                Absen
              </span>
            </button>

            {/* RIWAYAT */}
            <button
              type="button"
              onClick={() => handleTabChange("riwayat")}
              className="
                flex
                flex-col
                items-center
                justify-center
                w-full
                h-full
                transition
              "
            >
              <span
                className={`text-xl leading-none ${
                  currentTab === "riwayat" ? "opacity-100" : "opacity-50"
                }`}
              >
                📅
              </span>

              <span
                className={`text-xs mt-1 ${
                  currentTab === "riwayat"
                    ? "text-blue-600 font-semibold"
                    : "text-slate-400"
                }`}
              >
                Riwayat
              </span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default UserLayout;
