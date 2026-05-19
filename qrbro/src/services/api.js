export const sendAttendance = async (data, photoBlob) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("studentId", data.studentId);
    formData.append("status", data.status);
    formData.append("time", data.time);

    if (photoBlob) {
      formData.append("photo", photoBlob, `${data.studentId}_${Date.now()}.jpg`);
    }

    const response = await fetch("http://localhost:5000/notify", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("API error:", err);
  }
};