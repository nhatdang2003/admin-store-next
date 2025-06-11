"use client";

import React, { useState, useEffect } from "react";
import { Bell, Loader2, X, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { OrderDetailNotiModal } from "@/components/modal/detail-noti-dialog";
import { useWebSocket } from "@/contexts/websocket.context";
import { Notification } from "@/types/notification";

interface NotificationItemProps {
    notification: Notification;
    markNotificationAsRead: (id: number) => Promise<void>;
    setOrderId: (id: string) => void;
    setOpenDetailOrder: (open: boolean) => void;
}

const NotificationItem = ({ notification, markNotificationAsRead, setOrderId, setOpenDetailOrder }: NotificationItemProps) => {
    const router = useRouter();

    const getNotificationTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case "promotion":
                return "bg-green-100 text-green-800 border-green-200";
            case "order":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "system":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), {
                addSuffix: true,
                locale: vi,
            });
        } catch {
            return "Vừa xong";
        }
    };

    const handleClickNotification = async (notification: Notification) => {
        await markNotificationAsRead(notification.id);
        console.log(notification);
        switch (notification.type) {
            case "SYSTEM_NOTIFICATION":
                setOrderId(notification.referenceIds);
                setOpenDetailOrder(true);
                break;
            case "PROMOTION":
                router.push(`/promotions/${notification.referenceIds}`);
                break;
            default:
                break;
        }
    };

    return (
        <div
            className={`p-4 border-l-4 transition-all duration-200 hover:bg-gray-50 cursor-pointer ${!notification.read
                ? "!border-l-blue-500 !bg-blue-50/30"
                : "!border-l-gray-200"
                }`}
            onClick={() => handleClickNotification(notification)}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge
                            variant="outline"
                            className={`text-xs ${getNotificationTypeColor(notification.type)}`}
                        >
                            {notification.type}
                        </Badge>
                        {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                    </div>

                    <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-1">
                        {notification.title}
                    </h4>

                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {notification.content}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                            {formatDate(notification.notificationDate)}
                        </span>

                        {notification.startPromotionDate && notification.endPromotionDate && (
                            <span className="text-xs text-green-600 font-medium">
                                Khuyến mãi đến {new Date(notification.endPromotionDate).toLocaleDateString("vi-VN")}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const NotificationBell = () => {
    const { connect, disconnect, isConnected, notifications, pagination, loadMoreNotifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead } = useWebSocket();

    const [isOpen, setIsOpen] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [orderId, setOrderId] = useState<string>("");
    const [openDetailOrder, setOpenDetailOrder] = useState(false);

    const handleLoadMore = async () => {
        if (pagination.page >= pagination.pages || isLoadingMore) return;

        setIsLoadingMore(true);
        try {
            await loadMoreNotifications();
        } catch (error) {
            console.error("Error loading more notifications:", error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const hasMoreNotifications = pagination.page < pagination.pages - 1;
    console.log(pagination);

    return (
        <>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="relative p-2 hover:bg-gray-100 transition-colors"
                    >
                        <Bell className={`h-5 w-5 ${isConnected ? 'text-gray-700' : 'text-gray-400'}`} />
                        {unreadCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-medium"
                            >
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="w-96 p-0 shadow-lg border-0"
                    align="end"
                    sideOffset={8}
                >
                    <Card className="border-0 shadow-none">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold">
                                    Thông báo
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    {!isConnected && (
                                        <div className="flex items-center gap-1 text-xs text-amber-600">
                                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                            Đang kết nối...
                                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={connect}>
                                                Tải lại
                                            </Button>
                                        </div>
                                    )}
                                    {unreadCount > 0 && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 text-xs"
                                                onClick={markAllNotificationsAsRead}
                                            >
                                                <CheckCheck className="h-3 w-3 mr-1" />
                                                Đánh dấu tất cả
                                            </Button>
                                            <Badge variant="secondary" className="text-xs">
                                                {unreadCount} chưa đọc
                                            </Badge>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        <Separator />

                        <CardContent className="p-0">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Bell className="h-12 w-12 text-gray-300 mb-3" />
                                    <p className="text-gray-500 font-medium mb-1">
                                        Không có thông báo nào
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Bạn sẽ nhận được thông báo mới tại đây
                                    </p>
                                </div>
                            ) : (
                                <div className="h-[400px] overflow-y-auto overscroll-none">
                                    <div className="divide-y divide-gray-100">
                                        {notifications.map((notification) => (
                                            <NotificationItem
                                                key={notification.id}
                                                notification={notification}
                                                markNotificationAsRead={markNotificationAsRead}
                                                setOrderId={setOrderId}
                                                setOpenDetailOrder={setOpenDetailOrder}
                                            />
                                        ))}
                                    </div>

                                    {hasMoreNotifications && (
                                        <div className="p-4 border-t">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                                onClick={handleLoadMore}
                                                disabled={isLoadingMore}
                                            >
                                                {isLoadingMore ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        Đang tải...
                                                    </>
                                                ) : (
                                                    "Tải thêm thông báo"
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <OrderDetailNotiModal
                        orderId={orderId}
                        open={openDetailOrder}
                        onClose={() => {
                            setOpenDetailOrder(false);
                            setOrderId("");
                        }}
                    />
                </PopoverContent>
            </Popover>
        </>
    );
}; 