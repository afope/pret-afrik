// app/products/page.tsx
import { createClient } from "@/lib/supabase/server";
import ProductGrid from "@/components/product-grid/product-grid";
import ProductFilters from "@/components/product-filters/product-filters";
import styles from "./page.module.scss";
import classNames from "classnames/bind";

const css = classNames.bind(styles);

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

  console.log("products", products);

  return (
    <div className={css("container")}>
      <div className={css("header")}>
        <h1>Shop All</h1>
        <p>{products?.length || 0} products</p>
      </div>

      <div className={css("layout")}>
        <aside className={css("sidebar")}>
          <ProductFilters designers={designers || []} />
        </aside>

        <div className={css("main")}>
          <ProductGrid products={products || []} />
        </div>
      </div>
    </div>
  );
}
