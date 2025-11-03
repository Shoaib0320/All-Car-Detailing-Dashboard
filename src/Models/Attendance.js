// /models/Attendance.js
import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shift: { type: mongoose.Schema.Types.ObjectId, ref: "Shift", required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    checkInTime: { type: Date, default: null },
    checkOutTime: { type: Date, default: null },

    checkInLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
    checkOutLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },

    status: { type: String, enum: ["present", "absent", "leave", 'late'], default: "present" },

    isLate: { type: Boolean, default: false },
    lateMinutes: { type: Number, default: 0 },

    isOvertime: { type: Boolean, default: false },
    overtimeMinutes: { type: Number, default: 0 },

    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
