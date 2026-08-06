import { connectDB } from "@/lib/mongodb";
import { getSessionPayload, isAdminSession, isOwnerSession } from "@/lib/serverAuth";
import Order from "@/models/Order";

const VALID_STATUS = ["Active", "Closed", "Shipped", "Canceled"];

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

    await connectDB();

    const { id } = await params;
    const order = await Order.findById(id).populate("user", "name email").lean();

    if (!order) {
      return Response.json({ message: "Orden no encontrada" }, { status: 404 });
    }

    const orderUserId = order.user?._id?.toString?.() || order.user?.toString?.() || "";
    const canAccess = isAdminSession(session) || isOwnerSession(session, orderUserId);

    if (!canAccess) {
      return Response.json({ message: "No autorizado" }, { status: 403 });
    }

    return Response.json(serializeOrder(order), { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Error al obtener la orden", error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getSessionPayload();

    if (!isAdminSession(session)) {
      return Response.json({ message: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const nextStatus = body?.status;

    if (!VALID_STATUS.includes(nextStatus)) {
      return Response.json({ message: "Estado invalido" }, { status: 400 });
    }

    await connectDB();

    const { id } = await params;
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: nextStatus },
      { new: true },
    )
      .populate("user", "name email")
      .lean();

    if (!updatedOrder) {
      return Response.json({ message: "Orden no encontrada" }, { status: 404 });
    }

    return Response.json(serializeOrder(updatedOrder), { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Error al actualizar estado", error: error.message },
      { status: 500 },
    );
  }
}
