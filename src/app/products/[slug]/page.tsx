// app/products/[slug]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductDetail from "./product-detail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*, designer:designers(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  //   console.log("product", product);

  if (error || !product) {
    console.error("Product not found:", { slug, error });
    notFound();
  }

  return <ProductDetail product={product} />;
}
