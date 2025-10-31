// /app/api/attendance/my/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import { verifyToken } from "@/lib/jwt";

export async function GET(request) {
  try {
    await connectDB();
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get("month") || "", 10);
    const year = parseInt(searchParams.get("year") || "", 10);

    const userId = decoded.userId;

    if (month && year) {
      const from = new Date(year, month - 1, 1, 0, 0, 0, 0);
      const to = new Date(year, month - 1 + 1, 1, 0, 0, 0, 0);

      const attends = await Attendance.find({
        user: userId,
        createdAt: { $gte: from, $lt: to },
      }).populate("shift", "name startTime endTime");

      const present = attends.filter(a => a.checkInTime).length;
      const presentWithCheckout = attends.filter(a => a.checkInTime && a.checkOutTime).length;
      const overtimeMinutes = attends.reduce((s, a) => s + (a.overtimeMinutes || 0), 0);
      const leaves = attends.filter(a => a.status === "leave").length;
      const daysInMonth = Math.floor((to - from) / (24*60*60*1000));
      const absent = Math.max(0, daysInMonth - present - leaves);

      return NextResponse.json({
        success: true,
        data: {
          month,
          year,
          totalDays: daysInMonth,
          present,
          presentWithCheckout,
          absent,
          leaves,
          overtimeMinutes,
          records: attends,
        },
      });
    }

    // otherwise recent records
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const records = await Attendance.find({ user: userId })
      .populate("shift", "name startTime endTime")
      .populate("manager", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error("GET /api/attendance/my error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
