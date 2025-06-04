"use client";

import Link from "next/link";
import { ChevronDown, LogOut, Package, ShoppingBag, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useLogout } from "@/hooks/use-auth-query";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";

export function NavbarUser() {
    const pathname = usePathname();
    const { mutate: logout } = useLogout(pathname);
    const userInfo = useUserStore((state: any) => state.user)

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="ml-auto flex items-center space-x-4">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="text-base flex items-center gap-2"
                    >
                        <User className="h-4 w-4" />
                        Chào {userInfo.firstName}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Link
                                href="/account"
                                className="flex items-center gap-2 text-sm hover:bg-muted px-2 py-1 rounded-md"
                            >
                                <User className="h-4 w-4" />
                                <span>Tài khoản</span>
                            </Link>
                            <Link
                                href="/account/orders"
                                className="flex items-center gap-2 text-sm hover:bg-muted px-2 py-1 rounded-md"
                            >
                                <Package className="h-4 w-4" />
                                <span>Đơn hàng</span>
                            </Link>
                            <Link
                                href="/account/shipping-info"
                                className="flex items-center gap-2 text-sm hover:bg-muted px-2 py-1 rounded-md"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                <span>Thông tin giao hàng</span>
                            </Link>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Đăng xuất</span>
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
