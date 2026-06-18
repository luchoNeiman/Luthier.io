import CategoryManager from "@/components/CategoryManager";
import GuitarManager from "@/components/GuitarManager";
import { getCategories } from "@/lib/categories";
import { getGuitars } from "@/lib/guitars";

export default async function GuitarDashboardContainer() {
  const [categories, guitars] = await Promise.all([
    getCategories(),
    getGuitars(),
  ]);

  return (
    <div className="space-y-10">
      <CategoryManager initialCategories={categories} />
      <GuitarManager initialCategories={categories} initialGuitars={guitars} />
    </div>
  );
}
