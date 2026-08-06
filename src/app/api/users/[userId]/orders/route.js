import { connectDB } from "@/lib/mongodb";
import { getSessionPayload, isAdminSession, isOwnerSession } from "@/lib/serverAuth";
import Order from "@/models/Order";

function serializeOrder(order) {
  return {
    _id: order._id.toString(),
    orderNumber: order.orderNumber,
    user: order.user
      ? {
          _id: order.user._id?.toString?.() || String(order.user._id || ""),
          name: order.user.name || "",
          email: order.user.email || "",
        }
      : null,
    customerData: order.customerData,
    items: order.items,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export async function GET(_request, { params }) {
  try {
    const session = await getSessionPayload();

    if (!session) {
      return Response.json({ message: "No autenticado" }, { status: 401 });
    }

    const { userId } = await params;
    const canAccess = isAdminSession(session) || isOwnerSession(session, userId);

    if (!canAccess) {
      return Response.json({ message: "No autorizado" }, { status: 403 });
    }

    await connectDB();

    const orders = await Order.find({ user: userId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return Response.json(orders.map(serializeOrder), { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Error al obtener ordenes del usuario", error: error.message },
      { status: 500 },
    );
  }
}
