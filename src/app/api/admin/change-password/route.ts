import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { 
  AUTH_COOKIE_NAME, 
  verifySessionToken, 
  getAdminCredentials, 
  hashPassword, 
  generateSessionToken, 
  DEFAULT_ADMIN_PASSWORD 
} from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const session = verifySessionToken(token);
    if (!session.valid) {
      return NextResponse.json({ success: false, error: "Session expired. Please log in again." }, { status: 401 });
    }

    const { currentPassword, newPassword, newUsername } = await request.json();

    if (!currentPassword) {
      return NextResponse.json(
        { success: false, error: "Current password is required." },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.trim().length < 6) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const credentials = await getAdminCredentials();

    // Verify current password
    let isCurrentPasswordCorrect = false;
    if (credentials.passwordHash) {
      isCurrentPasswordCorrect = credentials.passwordHash === hashPassword(String(currentPassword));
    } else {
      isCurrentPasswordCorrect = String(currentPassword) === DEFAULT_ADMIN_PASSWORD;
    }

    if (!isCurrentPasswordCorrect) {
      return NextResponse.json(
        { success: false, error: "Incorrect current password." },
        { status: 400 }
      );
    }

    // Save new hashed password in Setting
    const newPasswordHash = hashPassword(String(newPassword).trim());
    await prisma.setting.upsert({
      where: { key: "admin_password" },
      update: { value: newPasswordHash },
      create: { key: "admin_password", value: newPasswordHash }
    });

    let effectiveUsername = credentials.username;
    if (newUsername && newUsername.trim()) {
      effectiveUsername = String(newUsername).trim();
      await prisma.setting.upsert({
        where: { key: "admin_username" },
        update: { value: effectiveUsername },
        create: { key: "admin_username", value: effectiveUsername }
      });
    }

    // Refresh session cookie with new credentials
    const newToken = generateSessionToken(effectiveUsername);
    cookieStore.set(AUTH_COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
      user: { username: effectiveUsername }
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update password. Please try again." },
      { status: 500 }
    );
  }
}
