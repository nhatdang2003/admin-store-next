"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StoreIcon } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
    SidebarTrigger,
    SidebarMenuSkeleton,
    SidebarInset,
} from "@/components/ui/sidebar";
import { SIDEBAR } from "@/constants/sidebar";
import ScalableStoreLogo from "../ui/logo-store";
import { useAccountInfo } from "@/hooks/use-account-query";

export function WorkspaceLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const { data: info } = useAccountInfo();

    const menuItems = SIDEBAR[info?.role as keyof typeof SIDEBAR];

    return (
        <SidebarProvider>
            <SidebarInset>
                <div className="flex h-screen overflow-hidden">
                    <Sidebar>
                        <SidebarHeader>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <div className="w-[200px] px-2">
                                        <Link href="/">
                                            <ScalableStoreLogo />
                                        </Link>
                                    </div>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarHeader>
                        <SidebarContent className="px-2">
                            <React.Suspense
                                fallback={<NavProjectsSkeleton length={menuItems?.length} />}
                            >
                                <SidebarMenu>
                                    {menuItems?.map((item: any) => (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={pathname === item.href}
                                            >
                                                <Link href={item.href}>
                                                    <item.icon className="mr-2 h-4 w-4" />
                                                    {item.title}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </React.Suspense>
                        </SidebarContent>
                    </Sidebar>
                    <div className={`flex-1 overflow-auto`}>
                        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
                            <SidebarTrigger />
                        </header>
                        <main className="flex-1 overflow-auto p-6">{children}</main>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

function NavProjectsSkeleton({ length = 5 }: { length?: number }) {
    return (
        <SidebarMenu>
            {Array.from({ length }).map((_, index) => (
                <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}
