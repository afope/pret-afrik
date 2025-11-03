// app/products/page.tsx
import { createClient } from "@/lib/supabase/server";
import ProductGrid from "@/components/product-grid/product-grid";
import ProductFilters from "@/components/product-filters/product-filters";
import styles from "./page.module.scss";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; designer?: string };
}) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*, designer:designers(*)")
    .eq("is_active", true);

  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
  }

  if (searchParams.designer) {
    query = query.eq("designer_id", searchParams.designer);
  }

  const { data: products } = await query.order("created_at", {
    ascending: false,
  });

  // Get all designers for filter
  const { data: designers } = await supabase
    .from("designers")
    .select("id, name")
    .eq("is_active", true);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Shop All</h1>
        <p>{products?.length || 0} products</p>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <ProductFilters designers={designers || []} />
        </aside>

        <div className={styles.main}>
          <ProductGrid products={products || []} />
        </div>
      </div>
    </div>
  );
}
