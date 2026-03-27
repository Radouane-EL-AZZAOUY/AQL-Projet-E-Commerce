import { apiRequest } from './core';
import { adminService } from './services/admin.service';
import { authService } from './services/auth.service';
import { cartService } from './services/cart.service';
import { categoriesService, productsService } from './services/catalog.service';
import { ordersService } from './services/orders.service';

export * from './types';

// Keep legacy export names for compatibility.
export const api = apiRequest;
export const auth = authService;
export const products = productsService;
export const categories = categoriesService;
export const cart = cartService;
export const orders = ordersService;
export const admin = adminService;
