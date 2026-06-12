import { connectDB } from "@/lib/mongodb";
import "@/models/Category";
import Guitar from "@/models/Guitar";
import { serializeCategory } from "@/lib/categories";

function serializeGuitar(guitar) {
  return {
    _id: guitar._id.toString(),
    name: guitar.name,
    // description: guitar.description,
    price: guitar.price,
    stock: guitar.stock,
    image: guitar.image,
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
    // categories: (guitar.categories || []).map((category) => {
    //   if (category?.name) {
    //     return serializeCategory(category);
    //   }

    //   return category.toString();
    // }),
    createdAt: guitar.createdAt?.toISOString(),
    updatedAt: guitar.updatedAt?.toISOString(),
  };
}

export async function getGuitars() {
  await connectDB();

  const guitars = await Guitar.find()
    .populate("categories")
    .sort({ createdAt: -1 })
    .lean();

  return guitars.map(serializeGuitar);
}

export async function getGuitarById(id) {
  await connectDB();

  const guitar = await Guitar.findById(id).populate("categories").lean();

  return guitar ? serializeGuitar(guitar) : null;
}

export async function getGuitarsByCategory(categoryId) {
  await connectDB();

  const guitars = await Guitar.find({ categories: categoryId })
    .populate("categories")
    .sort({ createdAt: -1 })
    .lean();

  return guitars.map(serializeGuitar);
}
