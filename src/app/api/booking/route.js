// import { NextResponse } from "next/server";
// import Booking, { BookingStatus } from "@/models/Booking";
// import connectDB from "@/database/mongodb";

// /**
//  * ✅ CORS Headers
//  */
// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// /**
//  * ✅ OPTIONS — Handle Preflight Request
//  */
// export async function OPTIONS() {
//   return new NextResponse(null, { status: 204, headers: corsHeaders });
// }

// /**
//  * ✅ POST — Create a new booking
//  */
// export async function POST(req) {
//   try {
//     await connectDB();
//     const data = await req.json();

//     console.log("Received booking data:", data);

//     // ✅ Validation
//     if (
//       !data.bookingId ||
//       !data.webName ||
//       !data.formData ||
//       !data.formData.firstName ||
//       !data.formData.lastName ||
//       !data.formData.email ||
//       !data.formData.phone ||
//       !data.formData.date ||
//       data.totalPrice === undefined ||
//       data.discountedPrice === undefined ||
//       !data.submittedAt ||
//       data.vehicleCount === undefined
//     ) {
//       return NextResponse.json(
//         { success: false, error: "Missing required fields" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     // ✅ Check duplicate
//     const existingBooking = await Booking.findOne({
//       bookingId: data.bookingId,
//     });
//     if (existingBooking) {
//       return NextResponse.json(
//         { success: false, error: "Booking ID already exists" },
//         { status: 409, headers: corsHeaders }
//       );
//     }

//     // ✅ Create new booking
//     const newBooking = await Booking.create({
//       bookingId: data.bookingId,
//       webName: data.webName,
//       formData: {
//         vehicleBookings: data.formData.vehicleBookings || [],
//         firstName: data.formData.firstName,
//         lastName: data.formData.lastName,
//         email: data.formData.email,
//         phone: data.formData.phone,
//         address: data.formData.address || "",
//         city: data.formData.city || "",
//         state: data.formData.state || "",
//         zip: data.formData.zip || "",
//         date: data.formData.date,
//         timeSlot: data.formData.timeSlot || "",
//         notes: data.formData.notes || "",
//       },
//       totalPrice: data.totalPrice,
//       discountedPrice: data.discountedPrice,
//       discountApplied: data.discountApplied || false,
//       discountPercent: data.discountPercent || 0,
//       promoCode: data.promoCode || null,
//       submittedAt: data.submittedAt,
//       vehicleCount: data.vehicleCount,
//       status: BookingStatus.PENDING,
//     });

//     console.log("Booking created successfully:", newBooking.bookingId);

//     return NextResponse.json(
//       {
//         success: true,
//         data: newBooking,
//         message: "Booking created successfully",
//       },
//       { status: 201, headers: corsHeaders }
//     );
//   } catch (err) {
//     console.error("POST /api/booking error:", err);

//     if (err.code === 11000) {
//       return NextResponse.json(
//         { success: false, error: "Booking ID already exists" },
//         { status: 409, headers: corsHeaders }
//       );
//     }

//     return NextResponse.json(
//       { success: false, error: "Internal Server Error" },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

// /**
//  * ✅ GET — Fetch all bookings (sorted latest first)
//  */
// export async function GET() {
//   try {
//     await connectDB();
//     const bookings = await Booking.find().sort({ createdAt: -1 });

//     return NextResponse.json(
//       {
//         success: true,
//         count: bookings.length,
//         data: bookings,
//       },
//       { status: 200, headers: corsHeaders }
//     );
//   } catch (err) {
//     console.error("GET /api/booking error:", err);
//     return NextResponse.json(
//       { success: false, error: "Failed to fetch bookings" },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

// /**
//  * ✅ PUT — Update Booking Status (Confirm / Cancel)
//  */
// export async function PUT(req) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");
//     const { status } = await req.json();

//     if (!id || !status) {
//       return NextResponse.json(
//         { success: false, error: "Missing ID or status" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     // ✅ Validate allowed statuses
//     const allowedStatuses = ["pending", "confirmed", "cancelled"];
//     if (!allowedStatuses.includes(status)) {
//       return NextResponse.json(
//         { success: false, error: "Invalid status value" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     // ✅ Update booking
//     const updatedBooking = await Booking.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     if (!updatedBooking) {
//       return NextResponse.json(
//         { success: false, error: "Booking not found" },
//         { status: 404, headers: corsHeaders }
//       );
//     }

//     console.log(`Booking ${id} updated to status: ${status}`);

//     return NextResponse.json(
//       {
//         success: true,
//         message: `Booking ${status} successfully`,
//         data: updatedBooking,
//       },
//       { status: 200, headers: corsHeaders }
//     );
//   } catch (err) {
//     console.error("PUT /api/booking error:", err);
//     return NextResponse.json(
//       { success: false, error: "Failed to update booking" },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }



import { NextResponse } from "next/server";
import Booking, { BookingStatus } from "@/models/Booking";
import connectDB from "@/database/mongodb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ✅ OPTIONS (for CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

/**
 * ✅ POST — Create a new booking
 */
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    // ✅ Validation
    if (
      !data.bookingId ||
      !data.webName ||
      !data.formData ||
      !data.formData.firstName ||
      !data.formData.lastName ||
      !data.formData.email ||
      !data.formData.phone ||
      !data.formData.date ||
      data.totalPrice === undefined ||
      data.discountedPrice === undefined ||
      !data.submittedAt ||
      data.vehicleCount === undefined
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    // ✅ Check for duplicate bookingId
    const existingBooking = await Booking.findOne({ bookingId: data.bookingId });
    if (existingBooking) {
      return NextResponse.json(
        { success: false, error: "Booking ID already exists" },
        { status: 409, headers: corsHeaders }
      );
    }

    // ✅ Create new booking
    const newBooking = await Booking.create({
      bookingId: data.bookingId,
      webName: data.webName,
      formData: {
        vehicleBookings: data.formData.vehicleBookings || [],
        firstName: data.formData.firstName,
        lastName: data.formData.lastName,
        email: data.formData.email,
        phone: data.formData.phone,
        address: data.formData.address || "",
        city: data.formData.city || "",
        state: data.formData.state || "",
        zip: data.formData.zip || "",
        date: data.formData.date,
        timeSlot: data.formData.timeSlot || "",
        notes: data.formData.notes || "",
      },
      totalPrice: data.totalPrice,
      discountedPrice: data.discountedPrice,
      discountApplied: data.discountApplied || false,
      discountPercent: data.discountPercent || 0,
      promoCode: data.promoCode || null,
      submittedAt: data.submittedAt,
      vehicleCount: data.vehicleCount,
      status: BookingStatus.PENDING,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        data: newBooking,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (err) {
    console.error("POST /api/booking error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * ✅ GET — Fetch all bookings (latest first)
 */
export async function GET() {
  try {
    await connectDB();
    const bookings = await Booking.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: bookings.length,
        data: bookings,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("GET /api/booking error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500, headers: corsHeaders }
    );
  }
}
