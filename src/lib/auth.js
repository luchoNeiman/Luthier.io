import { jwtVerify, SignJWT } from "jose";

export const AUTH_COOKIE_NAME = "auth_token";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-jwt-secret-change-me",
);

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
