import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

function serializeUser(user) {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    favorites: (user.favorites || []).map((favorite) => favorite.toString()),
  };
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return Response.json({ message: "No autenticado" }, { status: 401 });
    }

    const payload = await verifyAuthToken(token);
    await connectDB();
    const user = await User.findById(payload.sub).lean();

    if (!user) {
      return Response.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return Response.json(serializeUser(user), { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Sesion invalida", error: error.message },
      { status: 401 },
    );
  }
}
