// /app/api/attendance/export/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Attendance from "@/Models/Attendance";

function safe(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return `"${v.replace(/"/g, '""')}"`;
  return `"${String(v)}"`;
}

export async function GET(request) {
  try {
    await connectDB();

    // optional query filters: month & year
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get("month") || "", 10);
    const year = parseInt(searchParams.get("year") || "", 10);

    const filter = {};
    if (month && year) {
      const from = new Date(year, month - 1, 1, 0, 0, 0, 0);
      const to = new Date(year, month - 1 + 1, 1, 0, 0, 0, 0);
      filter.createdAt = { $gte: from, $lt: to };
    }

    const rows = await Attendance.find(filter)
      .populate("user", "firstName lastName email")
      .populate("shift", "name startTime endTime")
      .populate("manager", "firstName lastName email")
      .sort({ createdAt: -1 });

    const headers = [
      "User",
      "User Email",
      "Shift",
      "Shift Start",
      "Shift End",
      "CheckInTime",
      "CheckOutTime",
      "IsLate",
      "LateMinutes",
      "IsOvertime",
      "OvertimeMinutes",
      "Status",
      "CheckInLat",
      "CheckInLng",
      "CheckOutLat",
      "CheckOutLng",
      "Notes",
    ];

    const csvLines = [];
    csvLines.push(headers.join(","));

    for (const r of rows) {
      const line = [
        safe(r.user ? `${r.user.firstName} ${r.user.lastName}` : ""),
        safe(r.user ? r.user.email : ""),
        safe(r.shift ? r.shift.name : ""),
        safe(r.shift ? r.shift.startTime : ""),
        safe(r.shift ? r.shift.endTime : ""),
        safe(r.checkInTime ? new Date(r.checkInTime).toISOString() : ""),
        safe(r.checkOutTime ? new Date(r.checkOutTime).toISOString() : ""),
        safe(r.isLate),
        safe(r.lateMinutes),
        safe(r.isOvertime),
        safe(r.overtimeMinutes),
        safe(r.status),
        safe(r.checkInLocation?.lat ?? ""),
        safe(r.checkInLocation?.lng ?? ""),
        safe(r.checkOutLocation?.lat ?? ""),
        safe(r.checkOutLocation?.lng ?? ""),
        safe(r.notes || ""),
      ];
      csvLines.push(line.join(","));
    }

    const csv = csvLines.join("\n");
    const fileName = month && year ? `attendance_${year}_${String(month).padStart(2,"0")}.csv` : `attendance_export.csv`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("GET /api/attendance/export error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
