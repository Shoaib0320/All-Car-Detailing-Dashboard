import { NextResponse } from "next/server";
import Booking from "@/Models/Booking";
import connectDB from "@/lib/mongodb";

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

    const allowedStatuses = ["pending", "confirmed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400, headers: corsHeaders }
      );
    }

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

    return NextResponse.json(
      { success: true, data: updatedBooking, message: "Booking updated successfully" },
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
