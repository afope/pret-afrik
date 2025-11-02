// components/ProductCard/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import styles from "./product-card.module.css";
import classNames from "classnames/bind";

const css = classNames.bind(styles);

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className={css("card")}>
      <div className={css("image-wrapper")}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={css("image")}
        />
      </div>
      <div className={css("content")}>
        <h3 className={css("name")}>{product.name}</h3>
        <p className={css("designer")}>{product.designer?.name}</p>
        <p className={css("price")}>₦{product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}
