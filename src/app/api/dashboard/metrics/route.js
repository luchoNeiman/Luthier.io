import { connectDB } from "@/lib/mongodb";
import { getSessionPayload, isAdminSession } from "@/lib/serverAuth";
import Guitar from "@/models/Guitar";
import Order from "@/models/Order";
import User from "@/models/User";

function serializeUser(user) {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function serializeLowStockGuitar(guitar) {
  return {
    _id: guitar._id.toString(),
    name: guitar.name,
    stock: guitar.stock,
    image: guitar.image || "",
    price: guitar.price,
  };
}

export async function GET() {
  try {
    const session = await getSessionPayload();

    if (!isAdminSession(session)) {
      return Response.json({ message: "No autorizado" }, { status: 403 });
    }

    await connectDB();

    const [salesAggregation, latestUsers, lowStockProducts] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $ne: "Canceled" } } },
        { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
      ]),
      User.find().sort({ createdAt: -1 }).limit(5).lean(),
      Guitar.find({ stock: { $lte: 1 } })
        .sort({ stock: 1, updatedAt: -1 })
        .limit(8)
        .lean(),
    ]);

    const totalRevenue = Number(salesAggregation?.[0]?.totalRevenue || 0);

    return Response.json(
      {
        totalRevenue,
        latestUsers: latestUsers.map(serializeUser),
        lowStockProducts: lowStockProducts.map(serializeLowStockGuitar),
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { message: "Error al obtener metricas", error: error.message },
      { status: 500 },
    );
  }
}
