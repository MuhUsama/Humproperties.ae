import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { cookies } from "next/headers";

export const DEFAULT_ADMIN_USERNAME = "admin";
export const DEFAULT_ADMIN_PASSWORD = "admin123";
export const AUTH_COOKIE_NAME = "admin_session";
const SECRET = process.env.ADMIN_SECRET || "mfreuae_admin_jwt_secret_key_2025_secure";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + SECRET).digest("hex");
}

export function generateSessionToken(username: string): string {
  const payload = JSON.stringify({
    username,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  const signature = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(payload).toString("base64") + "." + signature;
}

export function verifySessionToken(token: string): { valid: boolean; username?: string } {
  try {
    if (!token) return { valid: false };
    const parts = token.split(".");
    if (parts.length !== 2) return { valid: false };
    
    const payloadStr = Buffer.from(parts[0], "base64").toString("utf8");
    const expectedSig = crypto.createHmac("sha256", SECRET).update(payloadStr).digest("hex");
    
    if (parts[1] !== expectedSig) return { valid: false };
    
    const data = JSON.parse(payloadStr);
    if (Date.now() > data.exp) return { valid: false };
    
    return { valid: true, username: data.username };
  } catch (e) {
    return { valid: false };
  }
}

export async function getAdminCredentials() {
  try {
    const userSetting = await prisma.setting.findUnique({ where: { key: "admin_username" } });
    const passSetting = await prisma.setting.findUnique({ where: { key: "admin_password" } });

    const username = userSetting?.value || DEFAULT_ADMIN_USERNAME;
    const passwordHash = passSetting?.value || null;

    return { username, passwordHash };
  } catch (e) {
    console.error("Failed to fetch admin credentials from DB, using defaults", e);
    return { username: DEFAULT_ADMIN_USERNAME, passwordHash: null };
  }
}

export async function checkAdminSessionFromCookies(): Promise<{ authenticated: boolean; username?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return { authenticated: false };
    const result = verifySessionToken(token);
    return { authenticated: result.valid, username: result.username };
  } catch (e) {
    return { authenticated: false };
  }
}
