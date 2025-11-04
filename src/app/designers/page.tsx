// app/designers/page.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.scss";
import classNames from "classnames/bind";

const css = classNames.bind(styles);

export default async function DesignersPage() {
  const supabase = await createClient();

  const { data: designers } = await supabase
    .from("designers")
    .select("*, products(count)")
    .eq("is_active", true)
    .order("name");

  return (
    <div className={css("container")}>
      <div className={css("header")}>
        <h1>Our Designers</h1>
        <p>Discover the creative minds behind our collections</p>
      </div>

      <div className={css("grid")}>
        {designers?.map((designer) => (
          <Link
            key={designer.id}
            href={`/designers/${designer.slug}`}
            className={css("card")}
          >
            {designer.brand_image && (
              <div className={css("image")}>
                <Image
                  src={designer.brand_image}
                  alt={designer.name}
                  fill
                  className={css("img")}
                />
              </div>
            )}
            <div className={css("content")}>
              <h3>{designer.name}</h3>
              {designer.bio && <p className={css("bio")}>{designer.bio}</p>}
              <p className={css("count")}>
                {designer.products[0]?.count || 0} products
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
