import mongoose from "mongoose";

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
    // --- Atributos de especificación (Filtros del Configurador) ---
    type: {
      //tipo de guitarra
      type: String,
      required: true,
      enum: ["eléctrica", "acústica", "electroacústica"],
      trim: true,
    },
    subtype: {
      //subtipo de guitarra
      type: String,
      enum: [
        "Stratocaster",
        "Telecaster",
        "Les Paul",
        "SG",
        "Dreadnought",
        "Clásica",
        "No aplica",
      ],
      default: "No aplica",
      trim: true,
    },
    brand: {
      // marca de la guitarra
      type: String,
      required: true,
      trim: true,
    },
    model: {
      // modelo de la guitarra
      type: String,
      required: true,
      trim: true,
    },
    orientation: {
      // orientación de la guitarra
      type: String,
      required: true,
      enum: ["diestro", "zurdo"],
      trim: true,
    },
    color: {
      // color de la guitarra
      type: String,
      required: true,
      trim: true,
    },
    stringMaterial: {
      // material de las cuerdas
      type: String,
      required: true,
      enum: ["Nylon", "Acero", "Níquel"],
      trim: true,
    },
    stringCount: {
      // cantidad de cuerdas
      type: Number,
      required: true,
      min: 0,
      default: 6,
    },
    fretCount: {
      // cantidad de trastes
      type: Number,
      required: true,
      min: 0,
    },
    pickupConfig: {
      // configuración de pastillas
      type: String,
      default: "Ninguno",
      trim: true,
    },

    // categories: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Category",
    //   },
    // ],
  },
  {
    timestamps: true,
  },
);

if (mongoose.models.Guitar && !mongoose.models.Guitar.schema.path("type")) {
  mongoose.deleteModel("Guitar");
}

const Guitar = mongoose.models.Guitar || mongoose.model("Guitar", guitarSchema);

export default Guitar;
