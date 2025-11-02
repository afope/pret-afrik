// lib/types.ts
export interface Designer {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  story?: string;
  brand_image?: string;
  instagram?: string;
  website?: string;
  commission_rate: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  designer_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: string[];
  category: string;
  materials?: string;
  care_instructions?: string;
  inventory: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  designer?: Designer;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  email: string;
  phone: string;
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
  payment_status: "pending" | "paid" | "failed";
  fulfillment_status: "pending" | "processing" | "shipped" | "delivered";
  paystack_reference?: string;
  tracking_number?: string;
  shipping_address: ShippingAddress;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  designer_name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  postal_code?: string;
}
