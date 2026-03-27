import { apiRequest } from '../core';
import type { Category, PageResponse, Product } from '../types';

export const productsService = {
  list: (page = 0, size = 12, search?: string, categoryId?: number) => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (search) params.set('search', search);
    if (categoryId != null) params.set('categoryId', String(categoryId));
    return apiRequest<PageResponse<Product>>(`/products?${params}`);
  },
  getById: (id: number) => apiRequest<Product>(`/products/${id}`),
};

export const categoriesService = {
  list: () => apiRequest<Category[]>('/categories'),
};
