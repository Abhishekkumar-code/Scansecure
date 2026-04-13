import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import notifyRoute from "./routes/notify.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB(); 

app.use("/notify", notifyRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});