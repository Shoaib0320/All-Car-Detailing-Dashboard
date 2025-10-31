// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import CheckIn from "@/models/CheckIn";
// import Shift from "@/models/Shift";
// import { verifyToken } from "@/lib/jwt";

// export async function POST(request) {
//   try {
//     await connectDB();

//     const token = request.cookies.get("token")?.value;
//     if (!token)
//       return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

//     const decoded = verifyToken(token);
//     if (!decoded)
//       return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });

//     const { shiftId } = await request.json();
//     if (!shiftId)
//       return NextResponse.json({ success: false, message: "Shift is required" }, { status: 400 });

//     const shift = await Shift.findById(shiftId).populate("manager", "firstName lastName email");
//     if (!shift)
//       return NextResponse.json({ success: false, message: "Shift not found" }, { status: 404 });

//     // check if user already submitted today
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(startOfDay);
//     endOfDay.setDate(endOfDay.getDate() + 1);

//     const existing = await CheckIn.findOne({
//       user: decoded.userId,
//       date: { $gte: startOfDay, $lt: endOfDay },
//     });

//     if (existing) {
//       return NextResponse.json({
//         success: false,
//         message: "You have already submitted your shift for today.",
//       }, { status: 400 });
//     }

//     const created = await CheckIn.create({
//       user: decoded.userId,
//       shift: shift._id,
//       manager: shift.manager?._id,
//       date: new Date(),
//     });

//     const populated = await CheckIn.findById(created._id)
//       .populate("shift", "name startTime endTime")
//       .populate("manager", "firstName lastName email");

//     return NextResponse.json({
//       success: true,
//       message: "Shift submitted successfully",
//       data: populated,
//     }, { status: 201 });
//   } catch (error) {
//     console.error("POST /api/checkin error:", error);
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }

// export async function GET(request) {
//   try {
//     await connectDB();

//     const token = request.cookies.get("token")?.value;
//     if (!token)
//       return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

//     const decoded = verifyToken(token);
//     if (!decoded)
//       return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });

//     const records = await CheckIn.find({ user: decoded.userId })
//       .populate("shift", "name startTime endTime")
//       .populate("manager", "firstName lastName email")
//       .sort({ createdAt: -1 });

//     return NextResponse.json({
//       success: true,
//       message: "User shift history fetched successfully",
//       data: records,
//     });
//   } catch (error) {
//     console.error("GET /api/checkin error:", error);
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }
