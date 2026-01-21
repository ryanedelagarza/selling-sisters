/**
 * React Query hooks for products
 */

import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductById, ApiError } from '../lib/api';
import type { Product, ProductType } from '../types/product';

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (type?: ProductType) => [...productKeys.lists(), type] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

/**
 * Hook to fetch all products or products by type
 */
export function useProducts(type?: ProductType) {
  return useQuery({
    queryKey: productKeys.list(type),
    queryFn: () => fetchProducts(type),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    select: (data) => ({
      products: data.products,
      lastUpdated: data.last_updated,
    }),
  });
}

/**
 * Hook to fetch bracelets only
 */
export function useBracelets() {
  return useProducts('bracelet');
}

/**
 * Hook to fetch portraits only
 */
export function usePortraits() {
  return useProducts('portrait');
}

/**
 * Hook to fetch coloring pages only
 */
export function useColoringPages() {
  return useProducts('coloring_page');
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(productId: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(productId || ''),
    queryFn: () => fetchProductById(productId!),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404s
      if (error instanceof ApiError && error.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    select: (data) => data.product,
  });
}

/**
 * Helper hook to get products by type with proper typing
 */
export function useProductsByType<T extends Product>(type: ProductType) {
  const query = useProducts(type);
  
  return {
    ...query,
    data: query.data ? {
      ...query.data,
      products: query.data.products as T[],
    } : undefined,
  };
}
