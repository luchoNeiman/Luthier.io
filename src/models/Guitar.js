import mongoose from "mongoose";
import {
  DEFAULT_SUBTYPE,
  GUITAR_ORIENTATION_OPTIONS,
  GUITAR_STRING_MATERIAL_OPTIONS,
  GUITAR_TYPE_OPTIONS,
} from "@/lib/guitarOptions";

const guitarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // description: {
    //   type: String,
    //   default: "",
    //   trim: true,
    // },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    // Atributos de especificación
    type: { //tipo de guitarra
      type: String,
      required: true,
      enum: GUITAR_TYPE_OPTIONS,
      trim: true,
    },
    subtype: { //subtipo de guitarra
      type: String,
      default: DEFAULT_SUBTYPE,
      trim: true,
    },
    brand: { // marca de la guitarra
      type: String,
      required: true,
      trim: true,
    },
    model: { // modelo de la guitarra
      type: String,
      required: true,
      trim: true,
    },
    orientation: { // orientación de la guitarra
      type: String,
      required: true,
      enum: GUITAR_ORIENTATION_OPTIONS,
      trim: true,
    },
    color: { // color de la guitarra
      type: String,
      required: true,
      trim: true,
    },
    stringMaterial: { // material de las cuerdas
      type: String,
      required: true,
      enum: GUITAR_STRING_MATERIAL_OPTIONS,
      trim: true,
    },
    stringCount: { // cantidad de cuerdas
      type: Number,
      required: true,
      min: 0,
      default: 6,
    },
    fretCount: { // cantidad de trastes
      type: Number,
      required: true,
      min: 0,
    },
    pickupConfig: { // configuración de pastillas
      type: String,
      default: "Ninguno",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

function hasLegacySubtypeEnum(model) {
  const subtypeOptions = model?.schema?.path("subtype")?.options;
  return Array.isArray(subtypeOptions?.enum);
}

export function getGuitarModel() {
  const existingModel = mongoose.models.Guitar;

  if (existingModel && hasLegacySubtypeEnum(existingModel)) {
    mongoose.deleteModel("Guitar");
  }

  return mongoose.models.Guitar || mongoose.model("Guitar", guitarSchema);
}

const Guitar = getGuitarModel();

export default Guitar;
