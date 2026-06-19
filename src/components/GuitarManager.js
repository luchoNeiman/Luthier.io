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
  subtype: "No aplica",
  brand: "",
  model: "",
  orientation: "",
  color: "",
  stringMaterial: "",
  stringCount: "6",
  fretCount: "",
  pickupConfig: "Ninguno",
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
      subtype: guitar.subtype || "No aplica",
      brand: guitar.brand || "",
      model: guitar.model || "",
      orientation: guitar.orientation || "",
      color: guitar.color || "",
      stringMaterial: guitar.stringMaterial || "",
      stringCount: String(guitar.stringCount || 6),
      fretCount: String(guitar.fretCount || ""),
      pickupConfig: guitar.pickupConfig || "Ninguno",
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

  const inputClass =
    "w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-stone-200 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30";
  const selectClass =
    "w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-stone-200 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30";
  const sectionLabelClass =
    "mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-300";

  return (
    <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
      {/* SECCIÓN DEL FORMULARIO */}
      <section className="h-fit rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-stone-200 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-100">
          {editingId ? "Editar guitarra" : "Nueva guitarra"}
        </h2>
        <p className="mt-2 text-sm text-stone-400">
          Formulario para administrar el catálogo y las especificaciones
          técnicas.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className={sectionLabelClass}>
              Datos Generales
            </label>
            <input
              className={inputClass}
              name="name"
              placeholder="Nombre comercial (ej: Fender Stratocaster Reissue)"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              className={`${inputClass} font-mono`}
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
              className={`${inputClass} font-mono`}
              name="stock"
              placeholder="Stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>

          <input
            className={inputClass}
            name="image"
            placeholder="Nombre de archivo de imagen (ej: strat-roja.jpg)"
            value={form.image}
            onChange={handleChange}
            required
          />

          {/* CAMPOS ESPECÍFICOS DEL CONFIGURADOR */}
          <div className="space-y-4 border-t border-zinc-800 pt-4">
            <label className={sectionLabelClass}>
              Especificaciones Técnicas
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <select
                  className={selectClass}
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Tipo Guitarra
                  </option>
                  <option value="eléctrica">Eléctrica</option>
                  <option value="acústica">Acústica</option>
                  <option value="electroacústica">Electroacústica</option>
                </select>
              </div>

              <div>
                <select
                  className={selectClass}
                  name="subtype"
                  value={form.subtype}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Subtipo
                  </option>
                  <option value="Stratocaster">Stratocaster</option>
                  <option value="Telecaster">Telecaster</option>
                  <option value="Les Paul">Les Paul</option>
                  <option value="SG">SG</option>
                  <option value="Dreadnought">Dreadnought</option>
                  <option value="Clásica">Clásica</option>
                  <option value="No aplica">No aplica</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                className={inputClass}
                name="brand"
                placeholder="Marca"
                value={form.brand}
                onChange={handleChange}
                required
              />
              <input
                className={inputClass}
                name="model"
                placeholder="Modelo"
                value={form.model}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select
                className={selectClass}
                name="orientation"
                value={form.orientation}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Orientación
                </option>
                <option value="diestro">Diestro</option>
                <option value="zurdo">Zurdo</option>
              </select>

              <input
                className={inputClass}
                name="color"
                placeholder="Color"
                value={form.color}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select
                className={selectClass}
                name="stringMaterial"
                value={form.stringMaterial}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Material Cuerdas
                </option>
                <option value="Nylon">Nylon</option>
                <option value="Acero">Acero</option>
                <option value="Níquel">Níquel</option>
              </select>

              <input
                className={`${inputClass} font-mono`}
                name="stringCount"
                placeholder="Cant. Cuerdas"
                type="number"
                min="0"
                value={form.stringCount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                className={`${inputClass} font-mono`}
                name="fretCount"
                placeholder="Cant. Trastes"
                type="number"
                min="0"
                value={form.fretCount}
                onChange={handleChange}
                required
              />

              <input
                className={inputClass}
                name="pickupConfig"
                placeholder="Pastillas (ej: H-S-S)"
                value={form.pickupConfig}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* FIELDSET DE CATEGORÍAS */}
          <fieldset className="rounded-md border border-zinc-700 px-4 py-3">
            <legend className="px-1 text-xs font-semibold uppercase tracking-[0.12em] text-stone-300">
              Categorias Comerciales
            </legend>

            {initialCategories.length === 0 ? (
              <p className="py-2 text-sm text-stone-400">
                Crea una categoria antes de asociarla a guitarras.
              </p>
            ) : (
              <div className="grid gap-2 max-h-32 overflow-y-auto pt-1">
                {initialCategories.map((category) => (
                  <label
                    key={category._id}
                    className="flex cursor-pointer items-start gap-3 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-stone-300 transition-colors hover:border-amber-500/50 hover:bg-zinc-900"
                  >
                    <input
                      checked={form.categories.includes(category._id)}
                      className="mt-0.5 h-3.5 w-3.5 accent-amber-500"
                      name="categories"
                      type="checkbox"
                      value={category._id}
                      onChange={handleCategoryChange}
                    />
                    <span>
                      <span className="block font-medium text-stone-100">
                        {category.name}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 rounded-md bg-amber-600 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-500"
              disabled={isSaving}
              type="submit"
            >
              {isSaving
                ? "Guardando..."
                : editingId
                  ? "Actualizar"
                  : "Crear Guitarra"}
            </button>
            <button
              className="rounded-md border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-stone-200 transition-colors hover:border-amber-500/50 hover:text-amber-400"
              type="button"
              onClick={resetForm}
            >
              Limpiar
            </button>
          </div>
        </form>

        {message ? (
          <p className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/10 py-2 text-center text-sm font-medium text-amber-200">
            {message}
          </p>
        ) : null}
      </section>

      {/* SECCIÓN DEL LISTADO DE GUITARRAS */}
      <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-stone-200 shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-2xl font-semibold text-stone-100">
              Guitarras Registradas
            </h2>
            <p className="mt-2 text-sm text-stone-400">
              Inventario de instrumentos disponibles en la base de datos.
            </p>
          </div>
          <button
            className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-semibold text-stone-200 transition-colors hover:border-amber-500/50 hover:text-amber-400"
            disabled={isRefreshing}
            type="button"
            onClick={refreshGuitars}
          >
            {isRefreshing ? "Recargando..." : "Recargar"}
          </button>
        </div>

        {initialGuitars.length === 0 ? (
          <p className="mt-6 italic text-stone-400">
            No hay guitarras cargadas en el sistema todavía.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {initialGuitars.map((guitar) => (
              <article
                key={guitar._id}
                className="flex flex-col justify-between rounded-lg border border-zinc-700 bg-zinc-950 p-5 transition-shadow hover:shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="mb-1 inline-block rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-300">
                        {guitar.type}{" "}
                        {guitar.subtype !== "No aplica"
                          ? `• ${guitar.subtype}`
                          : ""}
                      </span>
                      <h3 className="text-lg font-bold leading-tight text-stone-100">
                        {guitar.name}
                      </h3>
                      <p className="mt-1 text-xs text-stone-400">
                        {guitar.brand} {guitar.model} ({guitar.color})
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm font-semibold text-stone-100">
                      <p className="font-mono text-amber-400">${guitar.price}</p>
                      <p className="mt-0.5 font-mono text-xs font-normal text-stone-400">
                        Stock: {guitar.stock}
                      </p>
                    </div>
                  </div>

                  {/* CARACTERÍSTICAS TÉCNICAS ADICIONALES EN VISTA DE LISTA */}
                  <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 rounded-md border border-zinc-700 bg-zinc-900 p-2 text-[11px] text-stone-300">
                    <p>
                      <strong>Orientación:</strong> {guitar.orientation}
                    </p>
                    <p>
                      <strong>Cuerdas:</strong> <span className="font-mono">{guitar.stringCount}</span> (
                      {guitar.stringMaterial})
                    </p>
                    <p>
                      <strong>Trastes:</strong> <span className="font-mono">{guitar.fretCount}</span>
                    </p>
                    <p>
                      <strong>Pastillas:</strong> {guitar.pickupConfig}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-800 pt-3">
                  <p className="select-all break-all font-mono text-[10px] text-stone-500">
                    ID: {guitar._id}
                  </p>

                  <div className="flex gap-2 shrink-0">
                    <button
                      className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/20"
                      type="button"
                      onClick={() => handleEdit(guitar)}
                    >
                      Editar
                    </button>
                    <button
                      className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20"
                      type="button"
                      onClick={() => handleDelete(guitar._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {guitar.categories?.length ? (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {guitar.categories.map((category) => (
                      <span
                        key={
                          typeof category === "string" ? category : category._id
                        }
                        className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-stone-300"
                      >
                        {typeof category === "string"
                          ? category
                          : category.name}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
