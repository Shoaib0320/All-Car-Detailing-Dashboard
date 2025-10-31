// /app/api/attendance/checkout/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Shift from "@/models/Shift";
import { verifyToken } from "@/lib/jwt";

function parseShiftDateTime(baseDate, timeStr) {
  const [hh, mm] = timeStr.split(":").map(Number);
  const dt = new Date(baseDate);
  dt.setHours(hh, mm, 0, 0);
  return dt;
}

export async function POST(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });

    const body = await request.json();
    const { attendanceId, location } = body;

    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0,0,0,0);
    const todayEnd = new Date(todayStart); todayEnd.setDate(todayEnd.getDate() + 1);

    let attendance;
    if (attendanceId) {
      attendance = await Attendance.findById(attendanceId).populate("shift");
    } else {
      attendance = await Attendance.findOne({
        user: decoded.userId,
        checkInTime: { $gte: todayStart, $lt: todayEnd },
      }).populate("shift");
    }

    if (!attendance || !attendance.checkInTime) {
      return NextResponse.json({ success: false, message: "No check-in found for today." }, { status: 400 });
    }

    if (attendance.checkOutTime) {
      return NextResponse.json({ success: false, message: "Already checked-out." }, { status: 400 });
    }

    attendance.checkOutTime = now;
    attendance.checkOutLocation = location || null;

    // compute overtime by comparing to shift end for the check-in day
    const checkInDate = new Date(attendance.checkInTime);
    const shift = await Shift.findById(attendance.shift);
    const shiftStart = parseShiftDateTime(checkInDate, shift.startTime);
    let shiftEnd = parseShiftDateTime(checkInDate, shift.endTime);
    if (shiftEnd <= shiftStart) shiftEnd.setDate(shiftEnd.getDate() + 1); // overnight

    if (attendance.checkOutTime > shiftEnd) {
      const diffMs = attendance.checkOutTime.getTime() - shiftEnd.getTime();
      const diffMin = Math.ceil(diffMs / (60 * 1000));
      attendance.isOvertime = true;
      attendance.overtimeMinutes = diffMin;
    } else {
      attendance.isOvertime = false;
      attendance.overtimeMinutes = 0;
    }

    await attendance.save();

    const populated = await Attendance.findById(attendance._id)
      .populate("user", "firstName lastName email")
      .populate("shift", "name startTime endTime hours days")
      .populate("manager", "firstName lastName email");

    return NextResponse.json({ success: true, message: "Checked-out", data: populated });
  } catch (error) {
    console.error("POST /api/attendance/checkout error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
