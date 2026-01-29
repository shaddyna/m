// stores/checkoutStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CheckoutState {
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  paymentMethod: 'credit-card' | 'paypal' | 'apple-pay' | null;
  deliveryMethod: 'standard' | 'express' | 'priority' | null;
  setShippingInfo: (info: Partial<CheckoutState['shippingInfo']>) => void;
  setPaymentMethod: (method: CheckoutState['paymentMethod']) => void;
  setDeliveryMethod: (method: CheckoutState['deliveryMethod']) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      shippingInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
      },
      paymentMethod: null,
      deliveryMethod: null,
      setShippingInfo: (info) => 
        set((state) => ({ shippingInfo: { ...state.shippingInfo, ...info } })),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setDeliveryMethod: (method) => set({ deliveryMethod: method }),
      resetCheckout: () => set({ 
        shippingInfo: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          country: '',
          postalCode: '',
        },
        paymentMethod: null,
        deliveryMethod: null,
      }),
    }),
    {
      name: 'checkout-storage',
    }
  )
);