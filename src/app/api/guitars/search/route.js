import { connectDB } from "@/lib/mongodb";
import "@/models/Category";
import Guitar from "@/models/Guitar";

export const dynamic = "force-dynamic";

const ALLOWED_FILTERS = ["type", "subtype", "color", "orientation", "brand"];

function serializeGuitar(guitar) {
  return {
    _id: guitar._id.toString(),
    name: guitar.name,
    price: guitar.price,
    stock: guitar.stock,
    image: guitar.image,
    categories: (guitar.categories || []).map((category) => category.toString()),
    type: guitar.type,
    subtype: guitar.subtype,
    brand: guitar.brand,
    model: guitar.model,
    orientation: guitar.orientation,
    color: guitar.color,
    stringMaterial: guitar.stringMaterial,
    stringCount: guitar.stringCount,
    fretCount: guitar.fretCount,
    pickupConfig: guitar.pickupConfig,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchCriteria = {};

    for (const key of ALLOWED_FILTERS) {
      const value = searchParams.get(key);

      if (typeof value === "string" && value.trim() !== "") {
        searchCriteria[key] = value.trim();
      }
    }

    const minPriceRaw = searchParams.get("minPrice")?.trim();
    const maxPriceRaw = searchParams.get("maxPrice")?.trim();

    if (minPriceRaw || maxPriceRaw) {
      const priceCriteria = {};

      if (minPriceRaw) {
        const parsedMinPrice = Number(minPriceRaw);
        if (!Number.isNaN(parsedMinPrice)) {
          priceCriteria.$gte = parsedMinPrice;
        }
      }

      if (maxPriceRaw) {
        const parsedMaxPrice = Number(maxPriceRaw);
        if (!Number.isNaN(parsedMaxPrice)) {
          priceCriteria.$lte = parsedMaxPrice;
        }
      }

      if (Object.keys(priceCriteria).length > 0) {
        searchCriteria.price = priceCriteria;
      }
    }

    if (Object.keys(searchCriteria).length === 0) {
      return Response.json(
        { message: "Debes indicar al menos un filtro de busqueda" },
        { status: 400 },
      );
    }

    await connectDB();
    const guitars = await Guitar.find(searchCriteria).sort({ price: 1, name: 1 }).lean();

    if (guitars.length === 0) {
      return Response.json(
        { message: "No se encontro una guitarra para los filtros indicados" },
        { status: 404 },
      );
    }

    return Response.json(guitars.map(serializeGuitar));
  } catch (error) {
    return Response.json(
      {
        message: "Error al buscar guitarra personalizada",
        error: error.message,
      },
      { status: 500 },
    );
  }
}