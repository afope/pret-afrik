// components/ProductGrid/ProductGrid.tsx
import { Product } from "@/lib/types";
import ProductCard from "../product-card/product-card";
import styles from "./product-grid.module.scss";
import classNames from "classnames/bind";

const css = classNames.bind(styles);

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className={css("empty")}>
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div className={css("grid")}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
