// /app/api/attendance/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Attendance from "@/models/Attendance";

export async function GET() {
  try {
    await connectDB();
    const records = await Attendance.find()
      .populate("user", "firstName lastName email")
      .populate("shift", "name startTime endTime")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
