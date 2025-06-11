import httpClient from "./axios-config";
import { NotificationResponse } from "@/types/notification";

export const getNotifications = async (page: number = 0, pageSize: number = 10): Promise<NotificationResponse> => {
    let url = `/api/v1/notifications?page=${page}&size=${pageSize}`;
    url += "&sort=createdAt,desc";
    const response = await httpClient.get(url);
    return response.data;
}

export const getUnreadCount = async () => {
    const response = await httpClient.get('/api/v1/notifications/unread-count');
    return response.data;
}

export const markAsRead = async (notificationId: string) => {
    const response = await httpClient.put(`/api/v1/notifications/mark-read/${notificationId}`);
    return response.data;
}

export const markAllAsRead = async () => {
    const response = await httpClient.post('/api/v1/notifications/mark-read-all');
    return response.data;
}
