import { jwtVerify, SignJWT } from "jose";

export const AUTH_COOKIE_NAME = "auth_token";
export const ADMIN_EMAIL = "admin@luthier.io";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-jwt-secret-change-me",
);

export function isHardcodedAdminEmail(email) {
  return String(email || "").trim().toLowerCase() === ADMIN_EMAIL;
}

export function getRoleFromEmail(email) {
  return isHardcodedAdminEmail(email) ? "admin" : "user";
}

export async function signAuthToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAuthToken(token) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export function getAuthCookieConfig() {
  return {
    name: AUTH_COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
