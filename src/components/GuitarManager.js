"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  createGuitar,
  deleteGuitar,
  updateGuitar,
} from "@/app/actions/guitars";

const initialForm = {
  name: "",
  // description: "",
  price: "",
  stock: "",
  image: "",
  categories: [],
  type: "",
  subtype: "",
  brand: "",
  model: "",
  orientation: "",
  color: "",
  stringMaterial: "",
  stringCount: "",
  fretCount: "",
  pickupConfig: "",
};

export default function GuitarManager({
  initialCategories = [],
  initialGuitars = [],
}) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, startRefreshTransition] = useTransition();

  const resetForm = useCallback(() => {
    setForm(initialForm);
    setEditingId("");
  }, []);

  const refreshGuitars = useCallback(() => {
    startRefreshTransition(() => {
      router.refresh();
    });
  }, [router]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleCategoryChange(event) {
    const { checked, value } = event.target;

    setForm((current) => {
      const categories = checked
        ? [...current.categories, value]
        : current.categories.filter((categoryId) => categoryId !== value);

      return { ...current, categories };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const action = editingId
      ? updateGuitar.bind(null, editingId)
      : createGuitar;

    try {
      const result = await action(null, formData);
      setMessage(result.message);

      if (result.ok) {
        resetForm();
        refreshGuitars();
      }
    } catch {
      setMessage("Ocurrio un error al guardar la guitarra.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(guitar) {
    setEditingId(guitar._id);
    setForm({
      name: guitar.name,
      // description: guitar.description,
      price: String(guitar.price),
      stock: String(guitar.stock),
      image: guitar.image || "",
      categories: (guitar.categories || []).map((category) =>
        typeof category === "string" ? category : category._id,
      ),
      type: guitar.type || "",
      subtype: guitar.subtype || "",
      brand: guitar.brand || "",
      model: guitar.model || "",
      orientation: guitar.orientation || "",
      color: guitar.color || "",
      stringMaterial: guitar.stringMaterial || "",
      stringCount: guitar.stringCount || "",
      fretCount: guitar.fretCount || "",
      pickupConfig: guitar.pickupConfig || "",
    });
    setMessage("Editando guitarra.");
  }

  async function handleDelete(id) {
    const result = await deleteGuitar(id);

    if (!result.ok) {
      setMessage(result.message || "No se pudo eliminar la guitarra.");
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    setMessage(result.message);
    refreshGuitars();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <section className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          {editingId ? "Editar guitarra" : "Nueva guitarra"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Formulario simple para probar los endpoints del CRUD de guitarras.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            className="min-h-28 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            name="description"
            placeholder="Descripcion"
            value={form.description}
            onChange={handleChange}
          />
          <input
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            name="price"
            placeholder="Precio"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            name="stock"
            placeholder="Stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            required
          />
          <input
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            name="image"
            placeholder="Nombre de imagen, ej: dummy.webp"
            value={form.image}
            onChange={handleChange}
          />
          <fieldset className="rounded-lg border border-slate-300 px-4 py-3">
            <legend className="px-1 text-sm font-medium text-slate-700">
              Categorias
            </legend>

            {initialCategories.length === 0 ? (
              <p className="py-2 text-sm text-slate-500">
                Crea una categoria antes de asociarla a guitarras.
              </p>
            ) : (
              <div className="grid gap-3">
                {initialCategories.map((category) => (
                  <label
                    key={category._id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
                  >
                    <input
                      checked={form.categories.includes(category._id)}
                      className="mt-1 h-4 w-4"
                      name="categories"
                      type="checkbox"
                      value={category._id}
                      onChange={handleCategoryChange}
                    />
                    <span>
                      <span className="block text-sm font-medium text-slate-900">
                        {category.name}
                      </span>
                      {category.description ? (
                        <span className="mt-1 block text-xs text-slate-500">
                          {category.description}
                        </span>
                      ) : null}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          <div className="flex gap-3">
            <button
              className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
            </button>
            <button
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
              type="button"
              onClick={resetForm}
            >
              Limpiar
            </button>
          </div>
        </form>

        {message ? (
          <p className="mt-4 text-sm text-slate-700">{message}</p>
        ) : null}
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Guitarras</h2>
            <p className="mt-2 text-sm text-slate-600">
              Lista obtenida desde el container del dashboard.
            </p>
          </div>
          <button
            className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
            disabled={isRefreshing}
            type="button"
            onClick={refreshGuitars}
          >
            {isRefreshing ? "Recargando..." : "Recargar"}
          </button>
        </div>

        {initialGuitars.length === 0 ? (
          <p className="mt-6 text-slate-600">
            Todavia no hay guitarras cargadas.
          </p>
        ) : (
          <div className="mt-6 grid gap-4">
            {initialGuitars.map((guitar) => (
              <article
                key={guitar._id}
                className="rounded-lg border border-slate-200 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {guitar.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {guitar.description || "Sin descripcion"}
                    </p>
                  </div>
                  <div className="text-right text-sm text-slate-700">
                    <p>${guitar.price}</p>
                    <p>Stock: {guitar.stock}</p>
                  </div>
                </div>

                <p className="mt-3 break-all text-xs text-slate-500">
                  ID: {guitar._id}
                </p>

                {guitar.categories?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {guitar.categories.map((category) => (
                      <span
                        key={
                          typeof category === "string" ? category : category._id
                        }
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"
                      >
                        {typeof category === "string"
                          ? category
                          : category.name}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-4 flex gap-3">
                  <button
                    className="rounded-lg bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900"
                    type="button"
                    onClick={() => handleEdit(guitar)}
                  >
                    Editar
                  </button>
                  <button
                    className="rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-900"
                    type="button"
                    onClick={() => handleDelete(guitar._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
