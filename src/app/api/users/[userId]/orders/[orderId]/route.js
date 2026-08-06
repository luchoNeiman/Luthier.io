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

    const { userId, orderId } = await params;
    const canAccess = isAdminSession(session) || isOwnerSession(session, userId);

    if (!canAccess) {
      return Response.json({ message: "No autorizado" }, { status: 403 });
    }

    await connectDB();

    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate("user", "name email")
      .lean();

    if (!order) {
      return Response.json({ message: "Orden no encontrada" }, { status: 404 });
    }

    return Response.json(serializeOrder(order), { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Error al obtener detalle de orden", error: error.message },
      { status: 500 },
    );
  }
}
