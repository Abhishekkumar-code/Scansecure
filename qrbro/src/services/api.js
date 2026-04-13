// services/api.js
export const sendAttendance = async (data) => {
  try {
    await fetch("http://localhost:5000/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error("API error:", err);
  }
};
