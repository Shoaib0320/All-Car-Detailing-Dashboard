import { NextResponse } from "next/server";
import User from "@/models/User";
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
 * ✅ POST — Create a new user
 */
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    // ✅ Validation
    if (!data.name || !data.email || !data.role) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, email, role" },
        { status: 400, headers: corsHeaders }
      );
    }

    // ✅ Check for duplicate email
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409, headers: corsHeaders }
      );
    }

    // ✅ Create new user
    const newUser = await User.create({
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      address: data.address || "",
      role: data.role,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: newUser,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (err) {
    console.error("POST /api/users error:", err);

    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * ✅ GET — Fetch all users (latest first)
 */
export async function GET() {
  try {
    await connectDB();
    const users = await User.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: users.length,
        data: users,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("GET /api/users error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500, headers: corsHeaders }
    );
  }
}
