const API_URL =
  "https://script.google.com/macros/s/AKfycbwwL139UAZwQ0yuQTAaEv9SKRskDimsX4QRfRNAnqfqdnTookMW-aKN1R3eH7GdFmJ55A/exec";

export async function callApi(action, data = {}) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action,
        ...data,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);

    return {
      error: error.message,
    };
  }
}