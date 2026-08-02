import { connectDB } from "@/lib/mongodb";
import "@/models/Category";
import Guitar from "@/models/Guitar";

export const dynamic = "force-dynamic";

const ALLOWED_FILTERS = ["type", "subtype", "color", "orientation"];

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

    if (Object.keys(searchCriteria).length === 0) {
      return Response.json(
        { message: "Debes indicar al menos un filtro de busqueda" },
        { status: 400 },
      );
    }

    await connectDB();
    const guitar = await Guitar.findOne(searchCriteria).lean();

    if (!guitar) {
      return Response.json(
        { message: "No se encontro una guitarra para los filtros indicados" },
        { status: 404 },
      );
    }

    return Response.json(guitar);
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