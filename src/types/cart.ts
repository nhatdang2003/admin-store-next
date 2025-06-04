export interface CartItem {
  cartItemId: string;
  productName: string;
  productVariant: {
    id: number;
    color: string;
    size: string;
    image: string;
  };
  price: number;
  finalPrice: number;
  discountRate: number;
  quantity: number;
  inStock: number;
  image: string;
  slug: string;
}

export interface CartListProps {
  cart: CartItem[];
}

export interface OrderSummary {
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
}
