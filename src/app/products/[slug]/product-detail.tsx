// app/products/[slug]/ProductDetail.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { Product } from "@/lib/types";
import Button from "@/components/button/button";
import styles from "./product-detail.module.scss";
import classNames from "classnames/bind";

const css = classNames.bind(styles);

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={css("container")}>
      <div className={css("grid")}>
        <div className={css("imageSection")}>
          <div className={css("mainImage")}>
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={css("image")}
              priority
            />
          </div>

          {product.images.length > 1 && (
            <div className={css("thumbnails")}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`${css("thumbnail")} ${
                    idx === selectedImage ? styles.active : ""
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className={css("thumbnailImage")}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={css("details")}>
          <h1 className={css("name")}>{product.name}</h1>
          <p className={css("designer")}>{product.designer?.name}</p>
          <p className={css("price")}>₦{product.price.toLocaleString()}</p>

          {product.sizes && product.sizes.length > 0 && (
            <div className={css("option")}>
              <label>Size:</label>
              <div className={css("options")}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`${css("optionButton")} ${
                      selectedSize === size ? styles.selected : ""
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className={css("option")}>
              <label>Color:</label>
              <div className={css("options")}>
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`${css("optionButton")} ${
                      selectedColor === color ? styles.selected : ""
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={css("option")}>
            <label>Quantity:</label>
            <div className={css("quantity")}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <Button
            variant="primary"
            size="large"
            onClick={handleAddToCart}
            className={css("addButton")}
            disabled={product.inventory === 0}
          >
            {added
              ? "Added to Cart!"
              : product.inventory === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </Button>

          <div className={css("description")}>
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.materials && (
            <div className={css("info")}>
              <h4>Materials</h4>
              <p>{product.materials}</p>
            </div>
          )}

          {product.care_instructions && (
            <div className={css("info")}>
              <h4>Care Instructions</h4>
              <p>{product.care_instructions}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
