import mongoose from "mongoose";

const attendenceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["ENTRY", "EXIT"],
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    telegramFileId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Attendence = mongoose.model("Attendence", attendenceSchema);

export default Attendence;