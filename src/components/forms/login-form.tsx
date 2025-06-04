"use client";

import {
    Lock,
    Mail,
} from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema } from "@/schemas/auth.schema";
import type { LoginCredentials } from "@/types/auth";
import { useLogin } from "@/hooks/use-auth-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");
    const { mutate: login, isPending } = useLogin(redirect ?? "/");
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginCredentials>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = (values: LoginCredentials) => {
        login(values);
    };

    const handleGoogleLogin = () => {
        const callbackUrl = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
        const authUrl = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URI;
        const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        setIsLoading(true);

        if (!callbackUrl || !authUrl || !googleClientId) {
            console.error("Missing environment variables");
            return;
        }

        const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

        router.push(targetUrl);
        setIsLoading(false);
    }

    return (
        <div className="w-full max-w-md space-y-2 rounded-xl bg-white bg-opacity-90 p-8 shadow-lg backdrop-blur-sm">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Đăng nhập</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Đăng nhập để tiến hành mua sắm và nhận ưu đãi
                </p>
            </div>
            <div className="grid gap-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="sr-only">Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="Email"
                                                {...field}
                                                className="pl-10 py-2 border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                                            />
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="sr-only">Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="password"
                                                placeholder="Password"
                                                {...field}
                                                className="pl-10 py-2 border-gray-300 focus:ring-primary focus:border-primary rounded-md"
                                            />
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center justify-end">
                            <div className="text-sm">
                                <Link
                                    href="/forgot-password"
                                    className="font-medium text-primary hover:text-primary-dark hover:underline"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                        </Button>
                    </form>
                </Form>
                <div className="relative">
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 text-gray-500 ">Hoặc đăng nhập với</span>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    className={`w-full flex items-center justify-center gap-2`}
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                >
                    <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    {isLoading ? 'Đang xử lý...' : 'Đăng nhập với Google'}
                </Button>
                <p className="text-center text-sm text-gray-600">
                    Chưa có tài khoản?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-primary hover:text-primary-dark hover:underline"
                    >
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}
