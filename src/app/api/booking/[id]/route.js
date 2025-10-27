// import { NextResponse } from "next/server";
// import Booking from "@/models/Booking";
// import connectDB from "@/lib/mongodb";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// export async function OPTIONS() {
//   return new NextResponse(null, { status: 204, headers: corsHeaders });
// }

// // ✅ Update booking status
// export async function PUT(req, { params }) {
//   try {
//     await connectDB();
//     const { id } = params;
//     const { status } = await req.json();

//     if (!id || !status) {
//       return NextResponse.json(
//         { success: false, error: "Missing ID or status" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     const allowedStatuses = ["pending", "confirmed", "cancelled"];
//     if (!allowedStatuses.includes(status)) {
//       return NextResponse.json(
//         { success: false, error: "Invalid status value" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

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

//     return NextResponse.json(
//       { success: true, data: updatedBooking, message: "Booking updated successfully" },
//       { status: 200, headers: corsHeaders }
//     );
//   } catch (error) {
//     console.error("PUT /api/booking/[id] error:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to update booking" },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

// // ✅ Delete booking
// export async function DELETE(req, { params }) {
//   try {
//     await connectDB();
//     const { id } = params;

//     const deleted = await Booking.findByIdAndDelete(id);
//     if (!deleted) {
//       return NextResponse.json(
//         { success: false, error: "Booking not found" },
//         { status: 404, headers: corsHeaders }
//       );
//     }

//     return NextResponse.json(
//       { success: true, message: "Booking deleted successfully" },
//       { status: 200, headers: corsHeaders }
//     );
//   } catch (error) {
//     console.error("DELETE /api/booking/[id] error:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to delete booking" },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }










import { NextResponse } from "next/server";
import Booking from "@/models/Booking";
import connectDB from "@/lib/mongodb";
import { sendEmail } from "@/lib/mailer"; // 👈 email helper

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// ✅ Update booking status
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing ID or status" },
        { status: 400, headers: corsHeaders }
      );
    }

    const allowedStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400, headers: corsHeaders }
      );
    }

    // ✅ Update in DB
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // 📨 Email both user & owner
    try {
      const { formData, bookingId } = updatedBooking;
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const userEmail = formData.email;

      // status display text
      const statusDisplay = status.charAt(0).toUpperCase() + status.slice(1);

      // ---- User email ----
      const userHtml = `
        <h2>Booking Status Updated</h2>
        <p>Hi ${fullName},</p>
        <p>Your booking <b>#${bookingId}</b> status has been updated to <b>${statusDisplay}</b>.</p>
        <p>Thank you for choosing Car Detailing 🚗✨</p>
      `;

      // ---- Owner email ----
      const ownerHtml = `
        <h2>Booking Status Changed</h2>
        <p><b>Booking ID:</b> ${bookingId}</p>
        <p><b>Customer:</b> ${fullName} (${userEmail})</p>
        <p><b>New Status:</b> ${statusDisplay}</p>
        <p>Check your dashboard for details.</p>
      `;

      // send to user
      await sendEmail({
        to: userEmail,
        subject: `Your Booking #${bookingId} Status Updated`,
        html: userHtml,
      });

      // send to owner
      await sendEmail({
        to: process.env.OWNER_EMAIL,
        subject: `Booking #${bookingId} Status Changed (${statusDisplay})`,
        html: ownerHtml,
      });

      console.log("✅ Status change emails sent");
    } catch (mailError) {
      console.error("❌ Failed to send status emails:", mailError);
      // continue silently
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking status updated and emails sent",
        data: updatedBooking,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("PUT /api/booking/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update booking" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// ✅ Delete booking
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, message: "Booking deleted successfully" },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("DELETE /api/booking/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete booking" },
      { status: 500, headers: corsHeaders }
    );
  }
}
