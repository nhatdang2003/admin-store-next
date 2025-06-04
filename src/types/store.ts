export interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  activated: boolean;
  role: {
    id: number;
    name: string;
  };
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  // thêm các field khác nếu cần
}

export interface AuthState {
  user: User | null;
  access_token: string | null;
  refresh_token: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (access_token: string | null) => void;
  setRefreshToken: (refresh_token: string | null) => void;
  logout: () => void;
  login: (user: User, access_token: string, refresh_token: string) => void;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
