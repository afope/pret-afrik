// app/cart/page.tsx
"use client";
import { useCart } from "@/context/cart-context";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/button/button";
import styles from "./page.module.scss";
import classNames from "classnames/bind";

const css = classNames.bind(styles);

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className={css("empty")}>
        <h1>Your cart is empty</h1>
        <p>Add some items to get started</p>
        <Link href="/products">
          <Button variant="primary" size="large">
            Shop Now
          </Button>
        </Link>
      </div>
    );
  }

  const subtotal = getTotal();
  const shipping = 2500;
  const total = subtotal + shipping;

  return (
    <div className={css("container")}>
      <h1>Shopping Cart</h1>

      <div className={css("layout")}>
        <div className={css("items")}>
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.size}-${item.color}`}
              className={css("item")}
            >
              <div className={css("itemImage")}>
                <Image
                  src={item.product.images?.[0] || "/placeholder-image.jpg"}
                  alt={item.product.name}
                  fill
                  className={css("img")}
                />
              </div>

              <div className={css("itemDetails")}>
                <h3>{item.product.name}</h3>
                <p className={css("designer")}>{item.product.designer?.name}</p>
                {item.size && (
                  <p className={css("variant")}>Size: {item.size}</p>
                )}
                {item.color && (
                  <p className={css("variant")}>Color: {item.color}</p>
                )}
              </div>

              <div className={css("itemQuantity")}>
                <button
                  onClick={() =>
                    updateQuantity(
                      item.product.id,
                      item.quantity - 1,
                      item.size,
                      item.color
                    )
                  }
                  className={css("quantityBtn")}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(
                      item.product.id,
                      item.quantity + 1,
                      item.size,
                      item.color
                    )
                  }
                  className={css("quantityBtn")}
                >
                  +
                </button>
              </div>

              <div className={css("itemPrice")}>
                <p>₦{(item.product.price * item.quantity).toLocaleString()}</p>
              </div>

              <button
                onClick={() =>
                  removeItem(item.product.id, item.size, item.color)
                }
                className={css("remove")}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className={css("summary")}>
          <h2>Order Summary</h2>

          <div className={css("summaryRow")}>
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>

          <div className={css("summaryRow")}>
            <span>Shipping</span>
            <span>₦{shipping.toLocaleString()}</span>
          </div>

          <div className={css("summaryTotal")}>
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>

          <Link href="/checkout">
            <Button
              variant="primary"
              size="large"
              className={css("checkoutBtn")}
            >
              Proceed to Checkout
            </Button>
          </Link>

          <Link href="/products" className={css("continueShopping")}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
