import {
    Gift,
    Layers,
    LayoutDashboard,
    Package,
    ShoppingCart,
    Star,
    Users,
    Box,
} from "lucide-react";

export const SIDEBAR = {
    ADMIN: [
        { title: "Dashboard", icon: LayoutDashboard, href: "/workspace/dashboard" },
        { title: "Người dùng", icon: Users, href: "/workspace/users" },
        { title: "Sản phẩm", icon: Package, href: "/workspace/products" },
        { title: "Tồn kho", icon: Box, href: "/workspace/stock" },
        { title: "Danh mục", icon: Layers, href: "/workspace/categories" },
        { title: "Đơn hàng", icon: ShoppingCart, href: "/workspace/orders" },
        { title: "Khuyến mãi", icon: Gift, href: "/workspace/promotions" },
        { title: "Đánh giá", icon: Star, href: "/workspace/reviews" },
    ],
    STAFF: [
        { title: "Dashboard", icon: LayoutDashboard, href: "/workspace/dashboard" },
        { title: "Sản phẩm", icon: Package, href: "/workspace/products" },
        { title: "Tồn kho", icon: Box, href: "/workspace/stock" },
        { title: "Danh mục", icon: Layers, href: "/workspace/categories" },
        { title: "Đơn hàng", icon: ShoppingCart, href: "/workspace/orders" },
        { title: "Khuyến mãi", icon: Gift, href: "/workspace/promotions" },
        { title: "Đánh giá", icon: Star, href: "/workspace/reviews" },
    ],
    USER: [
        { title: "Dashboard", icon: LayoutDashboard, href: "/workspace/dashboard" },
        { title: "Tồn kho", icon: Box, href: "/workspace/stock" },
        { title: "Đơn hàng", icon: ShoppingCart, href: "/workspace/orders" },
        { title: "Đánh giá", icon: Star, href: "/workspace/reviews" },
    ],
};
