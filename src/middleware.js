// src/middleware.js
import { NextResponse } from "next/server";

export function middleware() {
  const res = NextResponse.next();

  // ✅ Allow ALL origins (for testing or public APIs)
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return res;
}

// ✅ Apply to all API routes only
export const config = {
  matcher: ["/api/:path*"],
};
