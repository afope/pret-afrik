// app/page.tsx
import { createClient } from "@/lib/supabase/server";
import ProductGrid from "@/components/product-grid/product-grid";
import styles from "./page.module.scss";
import classNames from "classnames/bind";

const css = classNames.bind(styles);

export default async function HomePage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, designer:designers(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div>
      <section className={css("hero")}>
        <div className={css("heroContent")}>
          <h1>Discover African Fashion</h1>
          <p>Curated designs from the continent&apos;s finest creators</p>
          <a href="/products" className={css("heroButton")}>
            Shop Now
          </a>
        </div>
      </section>

      <section className="container">
        <h2 className={css("sectionTitle")}>New Arrivals</h2>
        <ProductGrid products={products || []} />
      </section>
    </div>
  );
}
