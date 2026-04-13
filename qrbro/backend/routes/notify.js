import express from "express";
import Attendence from "../models/attendence.js";
import { sendTelegramMessage } from "../services/telegram.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, studentId, status, time } = req.body;

    if (!name || !studentId || !status || !time) {
      return res.status(400).json({ error: "Missing fields" });
    }

  
    const newEntry = await Attendence.create({
      name,
      studentId,
      status,
      time,
    });

    const message = `
📌 QR Attendence Alert
👤 Name: ${name}
🆔 ID: ${studentId}
🚪 Status: ${status}
⏰ Time: ${time}
    `;

  
    await sendTelegramMessage(message);

    res.status(200).json({
      success: true,
      message: "Attendence saved & notification sent",
      data: newEntry,
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ success: false });
  }
});

export default router;