import Image from "next/image";
import Link from "next/link";

function getGuitarImageSrc(image) {
  if (!image) {
    return "";
  }

  if (image.startsWith("/")) {
    return image;
  }

  return `/images/guitars/${image}`;
}

export default function GuitarGrid({ guitars = [] }) {
  if (guitars.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
        Todavia no hay guitarras cargadas.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {guitars.map((guitar) => (
        <article
          key={guitar._id}
          className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <div className="relative aspect-[4/3] bg-slate-100">
            {guitar.image ? (
              <Image
                alt={guitar.name}
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                src={getGuitarImageSrc(guitar.image)}
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
                Sin imagen
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-950">
                {guitar.name}
              </h2>
              <p className="shrink-0 text-base font-semibold text-emerald-700">
                ${guitar.price}
              </p>
            </div>

            {/* <p className="mt-2 line-clamp-3 text-sm text-slate-600">
              {guitar.description || "Sin descripcion"}
            </p> */}

            {guitar.categories?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {guitar.categories.map((category) =>
                  typeof category === "string" ? (
                    <span
                      key={category}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {category}
                    </span>
                  ) : (
                    <Link
                      key={category._id}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                      href={`/category/${category._id}`}
                    >
                      {category.name}
                    </Link>
                  )
                )}
              </div>
            ) : null}

            <p className="mt-4 text-sm text-slate-500">Stock: {guitar.stock}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
