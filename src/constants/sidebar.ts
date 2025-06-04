import {
  Gift,
  Layers,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

export const SIDEBAR = {
  ADMIN: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/workspace/dashboard" },
    { title: "Người dùng", icon: Users, href: "/workspace/users" },
    { title: "Sản phẩm", icon: Package, href: "/workspace/products" },
    { title: "Danh mục", icon: Layers, href: "/workspace/categories" },
    { title: "Đơn hàng", icon: ShoppingCart, href: "/workspace/orders" },
    { title: "Khuyến mãi", icon: Gift, href: "/workspace/promotions" },
  ],
  STAFF: [
    { title: "Dashboard", icon: LayoutDashboard, href: "/workspace/dashboard" },
    { title: "Sản phẩm", icon: Package, href: "/workspace/products" },
    { title: "Danh mục", icon: Layers, href: "/workspace/categories" },
    { title: "Đơn hàng", icon: ShoppingCart, href: "/workspace/orders" },
    { title: "Khuyến mãi", icon: Gift, href: "/workspace/promotions" },
  ],
  USER: [{ title: "Đơn hàng", icon: ShoppingCart, href: "/workspace/orders" }],
};
