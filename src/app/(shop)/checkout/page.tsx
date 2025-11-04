// app/(shop)/checkout/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";

import styles from "@/app/cart/page.module.scss";
import classNames from "classnames/bind";

const css = classNames.bind(styles);

// Paystack types
interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
}

interface PaystackHandler {
  openIframe: () => void;
}

interface PaystackPop {
  setup: (options: {
    key: string;
    email: string;
    amount: number;
    ref: string;
    callback: (response: PaystackResponse) => void;
    onClose: () => void;
  }) => PaystackHandler;
}

declare global {
  interface Window {
    PaystackPop?: PaystackPop;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    full_name: "",
    email: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
  });

  const subtotal = getTotal();
  const shipping = 2500;
  const total = subtotal + shipping;

  // Load Paystack inline script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePaystackPayment = () => {
    if (!window.PaystackPop) {
      console.error("Paystack script not loaded");
      setLoading(false);
      return;
    }

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email: shippingInfo.email,
      amount: total * 100, // Convert to kobo
      ref: `REF-${Date.now()}`,
      callback: async (response: PaystackResponse) => {
        setLoading(true);

        // Create order in database
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            shipping_address: shippingInfo,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
            paystack_reference: response.reference,
          }),
        });

        if (orderResponse.ok) {
          const order = await orderResponse.json();

          // Update order payment status
          await fetch(`/api/orders/${order.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              payment_status: "paid",
              paystack_reference: response.reference,
            }),
          });

          clearCart();
          router.push(`/orders/${order.id}`);
        }

        setLoading(false);
      },
      onClose: () => {
        console.log("Payment closed");
        setLoading(false);
      },
    });

    handler.openIframe();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    handlePaystackPayment();
  };

  return (
    <div className={css("container")}>
      <h1 className={css("title")}>Checkout</h1>

      <div className={css("grid")}>
        <div>
          <h2 className={css("subtitle")}>Shipping Information</h2>
          <form onSubmit={handleSubmit} className={css("form")}>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={shippingInfo.full_name}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, full_name: e.target.value })
              }
              className={css("input")}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={shippingInfo.email}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, email: e.target.value })
              }
              className={css("input")}
            />
            <input
              type="tel"
              placeholder="Phone"
              required
              value={shippingInfo.phone}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, phone: e.target.value })
              }
              className={css("input")}
            />
            <input
              type="text"
              placeholder="Address"
              required
              value={shippingInfo.address_line}
              onChange={(e) =>
                setShippingInfo({
                  ...shippingInfo,
                  address_line: e.target.value,
                })
              }
              className={css("input")}
            />
            <div className={css("grid")}>
              <input
                type="text"
                placeholder="City"
                required
                value={shippingInfo.city}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, city: e.target.value })
                }
                className={css("input")}
              />
              <input
                type="text"
                placeholder="State"
                required
                value={shippingInfo.state}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, state: e.target.value })
                }
                className={css("input")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={css("submitBtn")}
            >
              {loading ? "Processing..." : `Pay ₦${total.toLocaleString()}`}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className={css("summary")}>
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}-${item.color}`}
                className="flex justify-between mb-4"
              >
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.size && `Size: ${item.size}`}
                    {item.color && ` | Color: ${item.color}`}
                    {` | Qty: ${item.quantity}`}
                  </p>
                </div>
                <p className="font-semibold">
                  ₦{(item.product.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}

            <div className={css("summary")}>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
