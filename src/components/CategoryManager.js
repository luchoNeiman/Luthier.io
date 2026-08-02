"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/app/actions/categories";

const initialForm = {
  name: "",
  description: "",
};

export default function CategoryManager({ initialCategories = [] }) {
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

  const refreshCategories = useCallback(() => {
    startRefreshTransition(() => {
      router.refresh();
    });
  }, [router]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const action = editingId
      ? updateCategory.bind(null, editingId)
      : createCategory;

    try {
      const result = await action(null, formData);
      setMessage(result.message);

      if (result.ok) {
        resetForm();
        refreshCategories();
      }
    } catch {
      setMessage("Ocurrio un error al guardar la coleccion.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(category) {
    setEditingId(category._id);
    setForm({
      name: category.name,
      description: category.description,
    });
    setMessage("Editando coleccion.");
  }

  async function handleDelete(id) {
    const result = await deleteCategory(id);

    if (!result.ok) {
      setMessage(result.message || "No se pudo eliminar la coleccion.");
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    setMessage(result.message);
    refreshCategories();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <section className="rounded-xl border border-white/10 bg-white/5 p-6 text-zinc-200 shadow-[0_12px_28px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <h2 className="text-2xl font-semibold text-zinc-100">
          {editingId ? "Editar coleccion" : "Nueva coleccion"}
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Colecciones comerciales para segmentar la tienda (ej: Edicion Limitada,
          Outlet, Principiantes).
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-lg border border-zinc-800 bg-black/50 px-4 py-3 text-zinc-100 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            name="name"
            placeholder="Nombre de coleccion (ej: Edicion Limitada, Outlet, Principiantes)"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            className="min-h-28 w-full rounded-lg border border-zinc-800 bg-black/50 px-4 py-3 text-zinc-100 outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            name="description"
            placeholder="Descripcion"
            value={form.description}
            onChange={handleChange}
          />

          <div className="flex gap-3">
            <button
              className="rounded-lg bg-amber-600 px-4 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
            </button>
            <button
              className="rounded-lg border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-200 transition-all hover:border-amber-500/50 hover:text-amber-400"
              type="button"
              onClick={resetForm}
            >
              Limpiar
            </button>
          </div>
        </form>

        {message ? <p className="mt-4 text-sm text-zinc-300">{message}</p> : null}
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6 text-zinc-200 shadow-[0_12px_28px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-100">
              Colecciones Comerciales
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Lista de segmentos visibles para el catalogo de guitarras.
            </p>
          </div>
          <button
            className="rounded-lg border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-200 transition-all hover:border-amber-500/50 hover:text-amber-400"
            disabled={isRefreshing}
            type="button"
            onClick={refreshCategories}
          >
            {isRefreshing ? "Recargando..." : "Recargar"}
          </button>
        </div>

        {initialCategories.length === 0 ? (
          <p className="mt-6 text-zinc-400">
            Todavia no hay colecciones comerciales cargadas.
          </p>
        ) : (
          <div className="mt-6 grid gap-4">
            {initialCategories.map((category) => (
              <article
                key={category._id}
                className="rounded-xl border border-white/10 bg-black/30 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                <h3 className="text-xl font-semibold text-zinc-100">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {category.description || "Sin descripcion"}
                </p>
                <p className="mt-3 break-all text-xs text-zinc-500">
                  ID: {category._id}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition-all hover:bg-amber-500/20"
                    type="button"
                    onClick={() => handleEdit(category)}
                  >
                    Editar
                  </button>
                  <button
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition-all hover:bg-red-500/20"
                    type="button"
                    onClick={() => handleDelete(category._id)}
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
