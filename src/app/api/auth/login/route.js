import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

function serializeUser(user) {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
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

    return Response.json(serializeUser(user), { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Error al iniciar sesion", error: error.message },
      { status: 500 },
    );
  }
}
