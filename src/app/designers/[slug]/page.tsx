// app/designers/[slug]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductGrid from "@/components/product-grid/product-grid";
import styles from "./page.module.scss";
import classNames from "classnames/bind";

const css = classNames.bind(styles);

export default async function DesignerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: designer } = await supabase
    .from("designers")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!designer) notFound();

  const { data: products } = await supabase
    .from("products")
    .select("*, designer:designers(*)")
    .eq("designer_id", designer.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className={css("hero")}>
        {designer.brand_image && (
          <div className={css("heroImage")}>
            <Image
              src={designer.brand_image}
              alt={designer.name}
              fill
              className={css("img")}
            />
          </div>
        )}
        <div className={styles.heroContent}>
          <h1>{designer.name}</h1>
          {designer.bio && <p className={css("bio")}>{designer.bio}</p>}
          {(designer.instagram || designer.website) && (
            <div className={css("links")}>
              {designer.instagram && (
                <a href={designer.instagram} target="_blank" rel="noopener">
                  Instagram
                </a>
              )}
              {designer.website && (
                <a href={designer.website} target="_blank" rel="noopener">
                  Website
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {designer.story && (
        <div className="container">
          <div className={css("story")}>
            <h2>Designer Story</h2>
            <p>{designer.story}</p>
          </div>
        </div>
      )}

      <div className="container">
        <h2 className={css("collectionTitle")}>Collection</h2>
        <ProductGrid products={products || []} />
      </div>
    </div>
  );
}
