import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const sendTelegramMessage = async (text) => {
  try {
    const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

    await axios.post(url, {
      chat_id: process.env.CHAT_ID,
      text,
    });
  } catch (error) {
    console.error("Telegram Error:", error.message);
  }
};