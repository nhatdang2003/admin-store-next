"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Menu,
    Search,
    ShoppingBag,
    Package,
    Home,
    User,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname, useRouter } from "next/navigation";
import { useLogout } from "@/hooks/use-auth-query";
import Image from "next/image";
import ScalableStoreLogo from "../ui/logo-store";
import { useUserStore } from "@/stores/useUserStore";

export default function NavigationMobile() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { mutate: logout } = useLogout(pathname);
    const isAuthenticated = useUserStore((state: any) => state.isAuthenticated)
    const userInfo = useUserStore((state: any) => state.user)

    const handleLogout = () => {
        setIsOpen(false);
        logout();
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Mở menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                    {/* Logo in drawer */}
                    <Link
                        href="/"
                        className="text-2xl font-bold text-primary mb-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="w-[150px]">
                            <ScalableStoreLogo />
                        </div>
                    </Link>

                    {/* Search Bar in drawer */}
                    <div className="relative mb-4">
                        <Input
                            type="search"
                            placeholder="Tìm kiếm..."
                            className="pl-10 pr-4 py-2 rounded-full"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>

                    {/* Navigation Links */}
                    <Link
                        href="/"
                        className="text-foreground hover:text-primary"
                        onClick={() => setIsOpen(false)}
                    >
                        <Home className="h-5 w-5 inline-block mr-2" />
                        Trang chủ
                    </Link>
                    <Link
                        href="/shop"
                        className="text-foreground hover:text-primary"
                        onClick={() => setIsOpen(false)}
                    >
                        <ShoppingBag className="h-5 w-5 inline-block mr-2" />
                        Cửa hàng
                    </Link>
                    <Link
                        href="/theo-doi-don-hang"
                        className="text-foreground hover:text-primary"
                        onClick={() => setIsOpen(false)}
                    >
                        <Package className="h-5 w-5 inline-block mr-2" />
                        Theo dõi đơn hàng
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/account"
                                className="text-foreground hover:text-primary"
                                onClick={() => setIsOpen(false)}
                            >
                                <User className="h-5 w-5 inline-block mr-2" />
                                Tài khoản
                            </Link>
                            <Link
                                href="/account/shipping-info"
                                className="text-foreground hover:text-primary"
                                onClick={() => setIsOpen(false)}
                            >
                                <ShoppingBag className="h-5 w-5 inline-block mr-2" />
                                Thông tin giao hàng
                            </Link>
                            <Link
                                href="/account/orders"
                                className="text-foreground hover:text-primary"
                                onClick={() => setIsOpen(false)}
                            >
                                <Package className="h-5 w-5 inline-block mr-2" />
                                Đơn hàng
                            </Link>
                            <Button
                                variant="outline"
                                className="text-foreground hover:text-primary border border-black"
                                onClick={() => handleLogout()}
                            >
                                <LogOut className="h-5 w-5 inline-block mr-2" />
                                Đăng xuất
                            </Button>
                        </>
                    ) : (
                        <>
                            {/* Login and Sign Up Buttons in drawer */}
                            <Button
                                variant="outline"
                                className="bg-black text-white hover:bg-gray-700 hover:text-white w-full"
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push("/login");
                                }}
                            >
                                Đăng nhập
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-white text-black border-black hover:bg-black hover:text-white w-full"
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push("/register");
                                }}
                            >
                                Đăng ký
                            </Button>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
