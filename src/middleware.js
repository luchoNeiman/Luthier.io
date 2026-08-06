import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, isHardcodedAdminEmail, verifyAuthToken } from "@/lib/auth";

export async function middleware(request) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const payload = await verifyAuthToken(token);
    const isAdmin =
      isHardcodedAdminEmail(payload.email) || payload.role === "admin";

    if (!isAdmin) {
      const deniedUrl = new URL("/", request.url);
      deniedUrl.searchParams.set("error", "access-denied");
      return NextResponse.redirect(deniedUrl);
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
