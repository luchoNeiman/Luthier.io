import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import HomeCollectionRows from "@/components/HomeCollectionRows";
import { getGuitars } from "@/lib/guitars";

export const dynamic = "force-dynamic";

function serializeCollection(collection) {
  return {
    _id: collection._id.toString(),
    name: collection.name,
    description: collection.description || "",
    guitars: Array.isArray(collection.guitars)
      ? collection.guitars.map((guitar) => ({
          _id: guitar._id.toString(),
          name: guitar.name,
          price: guitar.price,
          stock: guitar.stock,
          image: guitar.image,
          type: guitar.type,
          subtype: guitar.subtype,
          categories: Array.isArray(guitar.categories)
            ? guitar.categories.map((category) =>
                typeof category === "string"
                  ? category
                  : {
                      _id: category._id.toString(),
                      name: category.name,
                    },
              )
            : [],
        }))
      : [],
  };
}

export default async function CategoriesPage() {
  await connectDB();

  const [categories, guitars] = await Promise.all([Category.find().sort({ name: 1 }).lean(), getGuitars()]);

  const guitarsByCategoryId = new Map();

  guitars.forEach((guitar) => {
    guitar.categories
      ?.filter((category) => typeof category !== "string")
      .forEach((category) => {
        const categoryId = category._id;
        const currentGuitars = guitarsByCategoryId.get(categoryId) || [];

        currentGuitars.push(guitar);
        guitarsByCategoryId.set(categoryId, currentGuitars);
      });
  });

  const serializedCategories = categories.map((category) =>
    serializeCollection({
      ...category,
      guitars: guitarsByCategoryId.get(category._id.toString()) || [],
    }),
  );

  return (
    <main className="min-h-screen px-6 py-10 text-zinc-200">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="spring-in relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-6 shadow-[0_22px_50px_rgba(0,0,0,0.34)] backdrop-blur-md md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_30%)]" />
          <div className="relative max-w-3xl">
            <p className="text-xs uppercase tracking-[0.38em] text-amber-400/90">
              Colecciones
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-zinc-50 md:text-5xl">
              Colecciones comerciales con sus guitarras agrupadas
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300/90 md:text-lg">
              Cada colección conserva su definición y muestra sus productos en
              una fila deslizable, para una lectura más clara y una navegación
              más visual.
            </p>
          </div>
        </section>

        {serializedCategories.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-zinc-400">
            Todavia no hay colecciones cargadas.
          </p>
        ) : (
          <div className="space-y-6 md:space-y-8">
            <HomeCollectionRows collections={serializedCategories} />
          </div>
        )}
      </div>
    </main>
  );
}
