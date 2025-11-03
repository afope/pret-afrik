// components/ProductFilters/ProductFilters.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./product-filters.module.scss";

interface Designer {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  designers: Designer[];
}

export default function ProductFilters({ designers }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories = ["Dresses", "Tops", "Bottoms", "Outerwear", "Accessories"];

  const handleFilterChange = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get(type) === value) {
      params.delete(type);
    } else {
      params.set(type, value);
    }

    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/products");
  };

  const currentCategory = searchParams.get("category");
  const currentDesigner = searchParams.get("designer");

  return (
    <div className={styles.filters}>
      <div className={styles.header}>
        <h3>Filters</h3>
        {(currentCategory || currentDesigner) && (
          <button onClick={clearFilters} className={styles.clear}>
            Clear All
          </button>
        )}
      </div>

      <div className={styles.group}>
        <h4>Category</h4>
        <div className={styles.options}>
          {categories.map((category) => (
            <label key={category} className={styles.option}>
              <input
                type="checkbox"
                checked={currentCategory === category.toLowerCase()}
                onChange={() =>
                  handleFilterChange("category", category.toLowerCase())
                }
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h4>Designer</h4>
        <div className={styles.options}>
          {designers.map((designer) => (
            <label key={designer.id} className={styles.option}>
              <input
                type="checkbox"
                checked={currentDesigner === designer.id}
                onChange={() => handleFilterChange("designer", designer.id)}
              />
              <span>{designer.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
