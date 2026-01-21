import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Product } from '../types/product';
import type { ContactInfo, PartialOrderDetails, OrderStep } from '../types/order';

// Storage key for session persistence
const STORAGE_KEY = 'selling-sisters-order';

// State interface
interface OrderState {
  selectedProduct: Product | null;
  orderDetails: PartialOrderDetails;
  contactInfo: Partial<ContactInfo>;
  currentStep: OrderStep;
  isSubmitting: boolean;
  submitError: string | null;
  idempotencyKey: string | null;
}

// Action types
type OrderAction =
  | { type: 'SELECT_PRODUCT'; payload: Product }
  | { type: 'UPDATE_ORDER_DETAILS'; payload: PartialOrderDetails }
  | { type: 'UPDATE_CONTACT_INFO'; payload: Partial<ContactInfo> }
  | { type: 'SET_STEP'; payload: OrderStep }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_SUBMIT_ERROR'; payload: string | null }
  | { type: 'RESET_ORDER' }
  | { type: 'RESTORE_STATE'; payload: Partial<OrderState> }
  | { type: 'GENERATE_IDEMPOTENCY_KEY' };

// Initial state
const initialState: OrderState = {
  selectedProduct: null,
  orderDetails: {},
  contactInfo: {},
  currentStep: 'product',
  isSubmitting: false,
  submitError: null,
  idempotencyKey: null,
};

// Reducer
function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'SELECT_PRODUCT':
      return {
        ...state,
        selectedProduct: action.payload,
        orderDetails: {
          type: action.payload.type,
          product_id: action.payload.product_id,
          product_title: action.payload.title,
        },
        currentStep: 'customize',
      };

    case 'UPDATE_ORDER_DETAILS':
      return {
        ...state,
        orderDetails: { ...state.orderDetails, ...action.payload },
      };

    case 'UPDATE_CONTACT_INFO':
      return {
        ...state,
        contactInfo: { ...state.contactInfo, ...action.payload },
      };

    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };

    case 'SET_SUBMIT_ERROR':
      return {
        ...state,
        submitError: action.payload,
      };

    case 'RESET_ORDER':
      return initialState;

    case 'RESTORE_STATE':
      return {
        ...state,
        ...action.payload,
      };

    case 'GENERATE_IDEMPOTENCY_KEY':
      return {
        ...state,
        idempotencyKey: uuidv4(),
      };

    default:
      return state;
  }
}

// Context interface
interface OrderContextValue {
  state: OrderState;
  selectProduct: (product: Product) => void;
  updateOrderDetails: (details: PartialOrderDetails) => void;
  updateContactInfo: (info: Partial<ContactInfo>) => void;
  setStep: (step: OrderStep) => void;
  resetOrder: () => void;
  generateIdempotencyKey: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setSubmitError: (error: string | null) => void;
}

// Create context
const OrderContext = createContext<OrderContextValue | null>(null);

// Provider component
export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Restore state from session storage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Don't restore submitting state
        dispatch({
          type: 'RESTORE_STATE',
          payload: {
            ...parsed,
            isSubmitting: false,
            submitError: null,
          },
        });
      }
    } catch (error) {
      console.error('Failed to restore order state:', error);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Persist state to session storage on change
  useEffect(() => {
    try {
      // Only persist if there's an order in progress
      if (state.selectedProduct) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
          selectedProduct: state.selectedProduct,
          orderDetails: state.orderDetails,
          contactInfo: state.contactInfo,
          currentStep: state.currentStep,
          idempotencyKey: state.idempotencyKey,
        }));
      }
    } catch (error) {
      console.error('Failed to persist order state:', error);
    }
  }, [state.selectedProduct, state.orderDetails, state.contactInfo, state.currentStep, state.idempotencyKey]);

  // Action creators
  const selectProduct = useCallback((product: Product) => {
    dispatch({ type: 'SELECT_PRODUCT', payload: product });
    dispatch({ type: 'GENERATE_IDEMPOTENCY_KEY' });
  }, []);

  const updateOrderDetails = useCallback((details: PartialOrderDetails) => {
    dispatch({ type: 'UPDATE_ORDER_DETAILS', payload: details });
  }, []);

  const updateContactInfo = useCallback((info: Partial<ContactInfo>) => {
    dispatch({ type: 'UPDATE_CONTACT_INFO', payload: info });
  }, []);

  const setStep = useCallback((step: OrderStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const resetOrder = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET_ORDER' });
  }, []);

  const generateIdempotencyKey = useCallback(() => {
    dispatch({ type: 'GENERATE_IDEMPOTENCY_KEY' });
  }, []);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', payload: isSubmitting });
  }, []);

  const setSubmitError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_SUBMIT_ERROR', payload: error });
  }, []);

  const value: OrderContextValue = {
    state,
    selectProduct,
    updateOrderDetails,
    updateContactInfo,
    setStep,
    resetOrder,
    generateIdempotencyKey,
    setSubmitting,
    setSubmitError,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

// Custom hook
export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}

export default OrderContext;
