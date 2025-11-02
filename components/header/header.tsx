// components/Header/Header.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import styles from "./header.module.css";
import classNames from "classnames/bind";

const css = classNames.bind(styles);

export default function Header() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <header className={css("header")}>
      <div className={css("container")}>
        <Link href="/" className={css("logo")}>
          Pret Afrik
        </Link>

        <nav className={css("nav")}>
          <Link href="/products">Shop</Link>
          <Link href="/designers">Designers</Link>
          <Link href="/about">About</Link>
        </nav>

        <div className={css("actions")}>
          <Link href="/cart" className={css("cart-link")}>
            Cart
            {itemCount > 0 && <span className={css("badge")}>{itemCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
