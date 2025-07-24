export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isRetailLinked: boolean;
  retailAccountId?: string;
}

export interface Group {
  id: string;
  name: string;
  code: string; // e.g., "OHH" for Ohio Health
  description: string;
  logoCustomization: boolean;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  brand: string;
  department: string;
  description: string;
  image: string;
  retailPrice: number;
  contractPrice: number;
  colors: ProductColor[];
  sizes: string[];
  inStock: boolean;
  logoEligible: boolean;
}

export interface ProductColor {
  name: string;
  hex: string;
  available: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  color: string;
  size: string;
  quantity: number;
  logoCustomization?: boolean;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  groupId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  source: 'online' | 'retail';
}

export interface RetailCustomer {
  accountNumber: string;
  phone: string;
  zipCode: string;
  firstName: string;
  lastName: string;
  orders: Order[];
}

export interface LoginType {
  type: 'individual' | 'group' | 'retail-link';
  groupCode?: string;
}