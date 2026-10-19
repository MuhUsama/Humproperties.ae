import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { 
  getAdminCredentials, 
  hashPassword, 
  generateSessionToken, 
  AUTH_COOKIE_NAME, 
  DEFAULT_ADMIN_PASSWORD 
} from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    const credentials = await getAdminCredentials();

    // Check username (case-insensitive)
    const isUsernameValid = credentials.username.toLowerCase() === String(username).trim().toLowerCase();

    // Check password: match hashed password, or initial default plain text if not hashed yet
    let isPasswordValid = false;
    if (credentials.passwordHash) {
      isPasswordValid = credentials.passwordHash === hashPassword(String(password));
    } else {
      isPasswordValid = String(password) === DEFAULT_ADMIN_PASSWORD;
    }

    if (!isUsernameValid || !isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Generate session token
    const token = generateSessionToken(credentials.username);

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: { username: credentials.username }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
