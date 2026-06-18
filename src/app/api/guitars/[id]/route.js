import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getGuitarById } from "@/lib/guitars";
import "@/models/Category";
import Guitar from "@/models/Guitar";

export const dynamic = "force-dynamic";

function invalidIdResponse() {
  return Response.json({ message: "ID de guitarra invalido" }, { status: 400 });
}

export async function GET(_request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    const guitar = await getGuitarById(id);

    if (!guitar) {
      return Response.json(
        { message: "Guitarra no encontrada" },
        { status: 404 },
      );
    }

    return Response.json(guitar);
  } catch (error) {
    return Response.json(
      { message: "Error al obtener la guitarra", error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    const body = await request.json();
    await connectDB();

    const guitar = await Guitar.findByIdAndUpdate(
      id,
      {
        name: body.name,
        // description: body.description,
        price: body.price,
        stock: body.stock,
        image: body.image,
        categories: body.categories,
        type: body.type,
        subtype: body.subtype,
        brand: body.brand,
        model: body.model,
        orientation: body.orientation,
        color: body.color,
        stringMaterial: body.stringMaterial,
        stringCount: body.stringCount,
        fretCount: body.fretCount,
        pickupConfig: body.pickupConfig,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!guitar) {
      return Response.json(
        { message: "Guitarra no encontrada" },
        { status: 404 },
      );
    }

    return Response.json(guitar);
  } catch (error) {
    return Response.json(
      { message: "Error al actualizar la guitarra", error: error.message },
      { status: 400 },
    );
  }
}

export async function DELETE(_request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    await connectDB();
    const guitar = await Guitar.findByIdAndDelete(id);

    if (!guitar) {
      return Response.json(
        { message: "Guitarra no encontrada" },
        { status: 404 },
      );
    }

    return Response.json({ message: "Guitarra eliminada correctamente" });
  } catch (error) {
    return Response.json(
      { message: "Error al eliminar la guitarra", error: error.message },
      { status: 500 },
    );
  }
}
