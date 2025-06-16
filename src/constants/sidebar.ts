import {
    Gift,
    Layers,
    LayoutDashboard,
    Package,
    ShoppingCart,
    Star,
    Users,
    Box,
    Undo,
    History
} from "lucide-react";

export const SIDEBAR = {
    ADMIN: [
        { title: "Dashboard", icon: LayoutDashboard, href: "/workspace/dashboard" },
        { title: "Người dùng", icon: Users, href: "/workspace/users" },
        { title: "Sản phẩm", icon: Package, href: "/workspace/products" },
        { title: "Tồn kho", icon: Box, href: "/workspace/stock" },
        { title: "Danh mục", icon: Layers, href: "/workspace/categories" },
        { title: "Đơn hàng", icon: ShoppingCart, href: "/workspace/orders" },
        { title: "Yêu cầu hoàn trả", icon: Undo, href: "/workspace/return-requests" },
        { title: "Khuyến mãi", icon: Gift, href: "/workspace/promotions" },
        { title: "Đánh giá", icon: Star, href: "/workspace/reviews" },
        { title: "Lịch sử tồn kho", icon: History, href: "/workspace/stock-histories" },
    ],
    MANAGER: [
        { title: "Dashboard", icon: LayoutDashboard, href: "/workspace/dashboard" },
        { title: "Sản phẩm", icon: Package, href: "/workspace/products" },
        { title: "Tồn kho", icon: Box, href: "/workspace/stock" },
        { title: "Danh mục", icon: Layers, href: "/workspace/categories" },
        { title: "Đơn hàng", icon: ShoppingCart, href: "/workspace/orders" },
        { title: "Yêu cầu hoàn trả", icon: Undo, href: "/workspace/return-requests" },
        { title: "Khuyến mãi", icon: Gift, href: "/workspace/promotions" },
        { title: "Đánh giá", icon: Star, href: "/workspace/reviews" },
        { title: "Lịch sử tồn kho", icon: History, href: "/workspace/stock-histories" },
    ],
    STAFF: [
        { title: "Dashboard", icon: LayoutDashboard, href: "/workspace/dashboard" },
        { title: "Tồn kho", icon: Box, href: "/workspace/stock" },
        { title: "Đơn hàng", icon: ShoppingCart, href: "/workspace/orders" },
        { title: "Yêu cầu hoàn trả", icon: Undo, href: "/workspace/return-requests" },
        { title: "Đánh giá", icon: Star, href: "/workspace/reviews" },
        { title: "Lịch sử tồn kho", icon: History, href: "/workspace/stock-histories" },
    ]
};
