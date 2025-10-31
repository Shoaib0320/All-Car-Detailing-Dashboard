// import mongoose from "mongoose";

// const shiftSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     startTime: { type: String, required: true },
//     endTime: { type: String, required: true },
//     manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Shift || mongoose.model("Shift", shiftSchema);


// /models/Shift.js
import mongoose from "mongoose";

const ShiftSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true },   // "17:00"
    days: { type: [String], default: [] },       // ["Mon","Tue"...] or ["Mon-Fri"]
  },
  { timestamps: true }
);

export default mongoose.models.Shift || mongoose.model("Shift", ShiftSchema);
