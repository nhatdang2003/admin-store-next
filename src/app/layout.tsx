import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/providers/query-provider";
import { WebSocketProvider } from "@/contexts/websocket.context";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Ez CMS",
    description: "Ez CMS",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <QueryProvider>
                    <WebSocketProvider>{children}</WebSocketProvider>
                </QueryProvider>
                <Toaster />
            </body>
        </html>
    );
}
