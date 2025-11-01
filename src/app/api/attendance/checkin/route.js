// /app/api/attendance/checkin/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Attendance from "@/Models/Attendance";
import Shift from "@/Models/Shift";
import { verifyToken } from "@/lib/jwt";

function parseShiftDateTime(baseDate, timeStr) {
  // baseDate: Date (midnight of the day), timeStr: "HH:MM"
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
    const { shiftId, location } = body;
    if (!shiftId) return NextResponse.json({ success: false, message: "shiftId required" }, { status: 400 });

    const shift = await Shift.findById(shiftId).populate("manager", "firstName lastName email");
    if (!shift) return NextResponse.json({ success: false, message: "Shift not found" }, { status: 404 });

    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0,0,0,0);
    const shiftStart = parseShiftDateTime(todayStart, shift.startTime);
    let shiftEnd = parseShiftDateTime(todayStart, shift.endTime);
    if (shiftEnd <= shiftStart) shiftEnd.setDate(shiftEnd.getDate() + 1); // overnight

    // allowed checkin window: from shiftStart -15min up to shiftEnd
    const earliestCheckin = new Date(shiftStart.getTime() - 15 * 60 * 1000);
    const latestCheckin = new Date(shiftEnd.getTime());

    if (now < earliestCheckin) {
      return NextResponse.json({
        success: false,
        message: `Check-in allowed from ${earliestCheckin.toLocaleTimeString()}`,
      }, { status: 400 });
    }
    if (now > latestCheckin) {
      return NextResponse.json({
        success: false,
        message: "Check-in window passed for this shift today.",
      }, { status: 400 });
    }

    // prevent duplicate: same user+shift for today
    const existing = await Attendance.findOne({
      user: decoded.userId,
      shift: shift._id,
      checkInTime: { $gte: todayStart, $lt: new Date(todayStart.getTime() + 24*60*60*1000) },
    });

    if (existing && existing.checkInTime) {
      return NextResponse.json({ success: false, message: "Already checked-in today." }, { status: 400 });
    }

    // late logic
    let isLate = false, lateMinutes = 0;
    if (now > shiftStart) {
      isLate = true;
      lateMinutes = Math.ceil((now - shiftStart) / (60 * 1000));
    }

    let attendance;
    if (existing) {
      existing.checkInTime = now;
      existing.checkInLocation = location || null;
      existing.manager = shift.manager?._id || null;
      existing.status = "present";
      existing.isLate = isLate;
      existing.lateMinutes = lateMinutes;
      await existing.save();
      attendance = existing;
    } else {
      attendance = await Attendance.create({
        user: decoded.userId,
        shift: shift._id,
        manager: shift.manager?._id || null,
        checkInTime: now,
        checkInLocation: location || null,
        status: "present",
        isLate,
        lateMinutes,
      });
    }

    const populated = await Attendance.findById(attendance._id)
      .populate("user", "firstName lastName email")
      .populate("shift", "name startTime endTime hours days")
      .populate("manager", "firstName lastName email");

    return NextResponse.json({ success: true, message: "Checked-in", data: populated }, { status: 201 });
  } catch (error) {
    console.error("POST /api/attendance/checkin error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
