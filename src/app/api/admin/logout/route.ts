import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/adminAuth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
    
    // Also explicitly set maxAge 0 for older clients
    cookieStore.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json({ success: false, error: "Failed to log out" }, { status: 500 });
  }
}
