import mongoose from "mongoose";

const checkInSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shift: { type: mongoose.Schema.Types.ObjectId, ref: "Shift", required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

export default mongoose.models.CheckIn || mongoose.model("CheckIn", checkInSchema);
