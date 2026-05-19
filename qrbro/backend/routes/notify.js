import express from "express";
import multer from "multer";
import Attendence from "../models/attendence.js";
import { sendTelegramPhoto } from "../services/telegram.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("photo"), async (req, res) => {
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

    res.status(200).json({
      success: true,
      message: "Attendance saved",
      data: newEntry,
    });

    if (req.file) {
      const caption =
        `📌 QR Attendance Alert\n` +
        `👤 Name: ${name}\n` +
        `🆔 ID: ${studentId}\n` +
        `🚪 Status: ${status}\n` +
        `⏰ Time: ${time}`;

      await sendTelegramPhoto(req.file.buffer, caption);
    }

  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ success: false });
  }
});

export default router;