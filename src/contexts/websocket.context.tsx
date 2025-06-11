"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Notification } from "@/types/notification";
import { tokenManager } from "@/services/axios-config";
import { getNotifications, getUnreadCount, markAllAsRead, markAsRead } from "@/services/notification.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface Pagination {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}

interface WebSocketContextType {
    connect: () => void;
    disconnect: () => Promise<void>;
    isConnected: boolean;
    notifications: Notification[];
    pagination: Pagination;
    loadMoreNotifications: () => Promise<void>;
    unreadCount: number;
    markNotificationAsRead: (notificationId: number) => Promise<void>;
    markAllNotificationsAsRead: () => Promise<void>;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
    undefined
);

let stompClient: Client | null = null;

const API_URL = process.env.NEXT_PUBLIC_API_BACKEND;

export const WebSocketProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const queryClient = useQueryClient();
    const [isConnected, setIsConnected] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 0,
        pageSize: 5,
        pages: 1,
        total: 0,
    });
    // Hàm gọi API lấy trang notifications
    const fetchNotificationsPage = async (page: number) => {
        try {
            if (!tokenManager.getAccessToken()) {
                console.log("No token to fetch notifications");
                return;
            }

            const response = await getNotifications(page, pagination.pageSize);

            const data = response.data;
            const meta = response.meta;
            if (page === 0) {
                setNotifications(data);
            } else {
                setNotifications((prev) => {
                    const existingIds = new Set(prev.map(n => n.id));
                    const newOnes = data.filter(n => !existingIds.has(n.id));
                    return [...prev, ...newOnes];
                });
            }

            setPagination({
                page: meta.page,
                pageSize: meta.pageSize,
                pages: meta.pages,
                total: meta.total,
            });
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }

    const fetchUnreadCount = async () => {
        if (!tokenManager.getAccessToken()) {
            console.log("No token to fetch unread count");
            return;
        }

        const response = await getUnreadCount();
        setUnreadCount(response);
    }

    const markNotificationAsRead = async (notificationId: number) => {
        if (!tokenManager.getAccessToken()) {
            console.log("No token to mark as read");
            return;
        }
        const response = await markAsRead(notificationId.toString());
        if (response) {
            setNotifications((prev) => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
            setUnreadCount(prev => prev - 1);
        }
    }

    const markAllNotificationsAsRead = async () => {
        if (!tokenManager.getAccessToken()) {
            console.log("No token to mark as read");
            return;
        }
        await markAllAsRead();
        setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    }

    // Load trang tiếp theo khi gọi hàm này
    const loadMoreNotifications = async () => {
        if (pagination.page < pagination.pages) {
            await fetchNotificationsPage(pagination.page + 1);
        }
    }

    // Kết nối WebSocket và subscribe các topic
    const connect = async () => {
        if (!tokenManager.getAccessToken()) {
            console.log("No token for WebSocket connection");
            return;
        }

        if (stompClient) {
            await stompClient.deactivate();
        }

        const socket = new SockJS(`${API_URL}/ws`);
        stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${tokenManager.getAccessToken()}`,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                setIsConnected(true);
                console.log("WebSocket connected");

                setTimeout(() => {
                    try {
                        stompClient?.subscribe("/topic/admin-notifications", (message) => {
                            const notif: Notification = JSON.parse(message.body);
                            setNotifications((prev) => [notif, ...prev]);
                            setUnreadCount(prev => prev + 1);
                            toast({
                                title: notif.title,
                                description: notif.content,
                                variant: "default",
                                duration: 5000,
                            })
                        });

                        fetchUnreadCount();
                        fetchNotificationsPage(0);
                    } catch (e) {
                        console.error("Subscribe error:", e);
                    }
                }, 100);
            },
            onDisconnect: () => {
                setIsConnected(false);
                console.log("WebSocket disconnected");
            },
            onStompError: (frame) => {
                console.error("STOMP error", frame.headers["message"]);
                console.error("Details:", frame.body);
            },
        });

        stompClient.activate();
    };

    // Ngắt kết nối WebSocket
    const disconnect = async () => {
        if (stompClient?.connected) {
            await stompClient.deactivate();
            stompClient = null;
            setIsConnected(false);
            setUnreadCount(0);
            setNotifications([]);
            setPagination({
                page: 0,
                pageSize: 5,
                pages: 0,
                total: 0,
            });
            console.log("WebSocket disconnected");
        }
    };

    useEffect(() => {
        connect();
        return () => {
            disconnect();
        };
    }, []);

    return (
        <WebSocketContext.Provider
            value={{
                connect,
                disconnect,
                isConnected,
                notifications,
                pagination,
                loadMoreNotifications,
                unreadCount,
                markNotificationAsRead,
                markAllNotificationsAsRead,
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const ctx = useContext(WebSocketContext);
    if (!ctx) throw new Error("useWebSocket must be used within WebSocketProvider");
    return ctx;
};
