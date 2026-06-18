"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import { connectDB } from "@/lib/mongodb";
import "@/models/Category";
import Guitar from "@/models/Guitar";

function getGuitarPayload(formData) {
  return {
    name: formData.get("name"),
    // description: formData.get("description"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    image: formData.get("image"),
    categories: formData
      .getAll("categories")
      .filter((categoryId) => mongoose.Types.ObjectId.isValid(categoryId)),
    type: formData.get("type"),
    subtype: formData.get("subtype"),
    brand: formData.get("brand"),
    model: formData.get("model"),
    orientation: formData.get("orientation"),
    color: formData.get("color"),
    stringMaterial: formData.get("stringMaterial"),
    stringCount: Number(formData.get("stringCount")),
    fretCount: Number(formData.get("fretCount")),
    pickupConfig: formData.get("pickupConfig") || "Ninguno",
  };
}

function revalidateGuitarsDashboard() {
  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function createGuitar(_previousState, formData) {
  try {
    await connectDB();
    await Guitar.create(getGuitarPayload(formData));
    revalidateGuitarsDashboard();

    return { ok: true, message: "Guitarra creada." };
  } catch (error) {
    return {
      ok: false,
      message: error.message || "Error al crear la guitarra.",
    };
  }
}

export async function updateGuitar(id, _previousState, formData) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, message: "ID de guitarra invalido." };
  }

  try {
    await connectDB();

    const guitar = await Guitar.findByIdAndUpdate(id, getGuitarPayload(formData), {
      new: true,
      runValidators: true,
    });

    if (!guitar) {
      return { ok: false, message: "Guitarra no encontrada." };
    }

    revalidateGuitarsDashboard();
    return { ok: true, message: "Guitarra actualizada." };
  } catch (error) {
    return {
      ok: false,
      message: error.message || "Error al actualizar la guitarra.",
    };
  }
}

export async function deleteGuitar(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, message: "ID de guitarra invalido." };
  }

  try {
    await connectDB();

    const guitar = await Guitar.findByIdAndDelete(id);

    if (!guitar) {
      return { ok: false, message: "Guitarra no encontrada." };
    }

    revalidateGuitarsDashboard();
    return { ok: true, message: "Guitarra eliminada." };
  } catch (error) {
    return {
      ok: false,
      message: error.message || "Error al eliminar la guitarra.",
    };
  }
}
