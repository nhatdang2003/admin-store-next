import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PROTECTED_PATHS } from "./constants/routes";
import { PUBLIC_PATHS } from "./constants/routes";

export function middleware(request: NextRequest) {
    const refresh_token = request.cookies.get("refresh_token")?.value;
    const { pathname } = request.nextUrl;
    console.log(pathname);
    const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
    const isProtectedPath = PROTECTED_PATHS.some((path) =>
        pathname.startsWith(path)
    );

    // 1. Chưa đăng nhập không cho vào private routes
    if (!refresh_token && isProtectedPath) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    // 2. Đã đăng nhập không cho vào public routes
    if (refresh_token && isPublicPath) {
        return NextResponse.redirect(new URL("/workspace/dashboard", request.url));
    }

    return NextResponse.next();
}

// Chỉ apply middleware cho các routes cụ thể
export const config = {
    matcher: [
        "/login",
        "/register",
        "/cart",
        "/checkout",
        "/forgot-password",
        "/dashboard/:path*",
        "/profile/:path*",
        "/settings/:path*",
        "/account/:path*",
        "/workspace/:path*",
    ],
};
