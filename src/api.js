const API_URL =
  "https://script.google.com/macros/s/AKfycbwwL139UAZwQ0yuQTAaEv9SKRskDimsX4QRfRNAnqfqdnTookMW-aKN1R3eH7GdFmJ55A/exec";

export async function callApi(action, data = {}) {
  try {
    let sessionToken = null;

    try {
      const session = JSON.parse(
        localStorage.getItem("@user_session") || "null",
      );

      sessionToken = session?.session_token || null;
    } catch (error) {
      console.warn("Gagal membaca session:", error);
    }

    const requestData = {
      action,
      ...data,
      ...(sessionToken ? { session_token: sessionToken } : {}),
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (typeof result === "string") {
      try {
        return JSON.parse(result);
      } catch (error) {
        return result;
      }
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);

    return {
      error: error.message,
    };
  }
}
