const API_URL = import.meta.env.VITE_API_URL;

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
