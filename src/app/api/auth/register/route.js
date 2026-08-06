import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME, getAuthCookieConfig, signAuthToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const ADMIN_EMAIL = "admin@luthier.io";

function serializeUser(user) {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    favorites: (user.favorites || []).map((favorite) => favorite.toString()),
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();
    const email = body?.email?.trim()?.toLowerCase();
    const password = body?.password;

    if (!name || !email || !password) {
      return Response.json(
        { message: "Completa nombre, email y contraseña" },
        { status: 400 },
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return Response.json(
        { message: "Ya existe un usuario con ese email" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email === ADMIN_EMAIL ? "admin" : "user";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      favorites: [],
    });

    const token = await signAuthToken({
      sub: user._id.toString(),
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, getAuthCookieConfig());

    return Response.json(serializeUser(user), { status: 201 });
  } catch (error) {
    return Response.json(
      { message: "Error al registrar usuario", error: error.message },
      { status: 500 },
    );
  }
}
