/**
 * Hook for submitting orders
 */

import { useMutation } from '@tanstack/react-query';
import { submitOrder, ApiError } from '../lib/api';
import type { ContactInfo, OrderDetails } from '../types/order';

interface SubmitOrderParams {
  contact: ContactInfo;
  details: OrderDetails;
  idempotencyKey: string;
}

/**
 * Hook for order submission with mutation
 */
export function useOrderSubmit() {
  return useMutation({
    mutationFn: async ({ contact, details, idempotencyKey }: SubmitOrderParams) => {
      return submitOrder(contact, details, idempotencyKey);
    },
    onError: (error) => {
      console.error('Order submission failed:', error);
    },
  });
}

/**
 * Type guard for ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
