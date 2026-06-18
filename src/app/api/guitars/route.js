import { connectDB } from "@/lib/mongodb";
import { getGuitars } from "@/lib/guitars";
import "@/models/Category";
import Guitar from "@/models/Guitar";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const guitars = await getGuitars();

    return Response.json(guitars);
  } catch (error) {
    return Response.json(
      { message: "Error al obtener las guitarras", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();

    const guitar = await Guitar.create({
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
    });

    return Response.json(guitar, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: "Error al crear la guitarra", error: error.message },
      { status: 400 },
    );
  }
}
