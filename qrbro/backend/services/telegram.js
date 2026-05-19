import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

export const sendTelegramMessage = async (text) => {
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text,
    });
  } catch (error) {
    console.error("Telegram Text Error:", error.message);
  }
};

export const sendTelegramPhoto = async (imageBuffer, caption) => {
  try {
    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("caption", caption);
    form.append("photo", imageBuffer, {
      filename: `attendance_${Date.now()}.jpg`,
      contentType: "image/jpeg",
    });

    const response = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
      form,
      { headers: form.getHeaders() }
    );

    const photos = response.data.result.photo;
    const fileId = photos[photos.length - 1].file_id;

    const fileRes = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
    );
    const filePath = fileRes.data.result.file_path;
    const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    return { imageUrl, fileId };
  } catch (error) {
    console.error("Telegram Photo Error:", error.message);
    return { imageUrl: null, fileId: null };
  }
};