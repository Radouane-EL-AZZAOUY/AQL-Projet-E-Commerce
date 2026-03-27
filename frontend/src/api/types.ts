export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  userId: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  stock: number;
  categoryId?: number;
  categoryName?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalAmount: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number;
  username: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
  totalAmount: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
