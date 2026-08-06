import { cookies } from "next/headers";

import {
  AUTH_COOKIE_NAME,
  isHardcodedAdminEmail,
  verifyAuthToken,
} from "@/lib/auth";

export async function getSessionPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}

export function isAdminSession(payload) {
  if (!payload) {
    return false;
  }

  return isHardcodedAdminEmail(payload.email) || payload.role === "admin";
}

export function isOwnerSession(payload, userId) {
  if (!payload || !userId) {
    return false;
  }

  return String(payload.sub) === String(userId);
}
