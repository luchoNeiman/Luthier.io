import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import {
  AUTH_COOKIE_NAME,
  getAuthCookieConfig,
  getRoleFromEmail,
  signAuthToken,
} from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

function serializeUser(user) {
  const role = getRoleFromEmail(user.email);

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role,
    favorites: (user.favorites || []).map((favorite) => favorite.toString()),
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim()?.toLowerCase();
    const password = body?.password;

    if (!email || !password) {
      return Response.json(
        { message: "Completa email y contraseña" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        { message: "Credenciales invalidas" },
        { status: 401 },
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return Response.json(
        { message: "Credenciales invalidas" },
        { status: 401 },
      );
    }

    const role = getRoleFromEmail(user.email);

    const token = await signAuthToken({
      sub: user._id.toString(),
      email: user.email,
      role,
    });

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, getAuthCookieConfig());

    return Response.json(serializeUser(user), { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Error al iniciar sesion", error: error.message },
      { status: 500 },
    );
  }
}

