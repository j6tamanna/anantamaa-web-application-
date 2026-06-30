/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  salePrice?: number;
  rating: number;
  images: string[];
  sizes: string[];
  colors: string[];
  fabric: string;
  careInstructions: string;
  estimatedDelivery: string;
  reviews: Review[];
  stock: number;
  sku: string;
  tags: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isLimitedEdition?: boolean;
}

export interface CartItem {
  id: string; // Unique combination of product.id + selectedSize + selectedColor
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Returned';
  paymentMethod: 'UPI' | 'Card' | 'COD' | 'NetBanking';
  paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
  trackingNumber?: string;
  couponCode?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percent' | 'fixed';
  value: number;
  minOrderValue: number;
  active: boolean;
}

export interface Message {
  id: string;
  sender: 'user' | 'stylist';
  text: string;
  timestamp: string;
  recommendedProductIds?: string[];
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockCount: number;
  categorySales: { name: string; value: number }[];
  monthlyRevenue: { month: string; sales: number }[];
}
