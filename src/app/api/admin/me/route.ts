import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifySessionToken, getAdminCredentials } from "@/lib/adminAuth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { valid, username } = verifySessionToken(token);
    if (!valid || !username) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Also get current username from DB in case it was updated
    const credentials = await getAdminCredentials();

    return NextResponse.json({
      authenticated: true,
      username: credentials.username || username
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
