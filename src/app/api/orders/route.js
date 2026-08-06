import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerData, items, total, user } = body;

    if (!customerData || !Array.isArray(items) || items.length === 0) {
      return Response.json(
        { message: "Datos de orden invalidos" },
        { status: 400 },
      );
    }

    if (
      !isNonEmptyString(customerData.name) ||
      !isNonEmptyString(customerData.email) ||
      !isNonEmptyString(customerData.phone) ||
      !isNonEmptyString(customerData.address)
    ) {
      return Response.json(
        { message: "Datos del cliente incompletos" },
        { status: 400 },
      );
    }

    const normalizedTotal = Number(total);
    if (Number.isNaN(normalizedTotal) || normalizedTotal < 0) {
      return Response.json(
        { message: "Total invalido" },
        { status: 400 },
      );
    }

    await connectDB();

    const lastOrder = await Order.findOne().sort({ orderNumber: -1 }).lean();
    const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1000;

    const order = await Order.create({
      orderNumber,
      user: user || undefined,
      customerData: {
        name: customerData.name.trim(),
        email: customerData.email.trim(),
        phone: customerData.phone.trim(),
        address: customerData.address.trim(),
      },
      items,
      total: normalizedTotal,
      status: "Active",
    });

    return Response.json(
      {
        message: "Orden creada correctamente",
        orderNumber: order.orderNumber,
        orderId: order._id.toString(),
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        message: "Error al generar la orden",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
