import {
    PAYMENT_METHOD,
    PAYMENT_STATUS,
    SHIPPING_METHOD,
    STATUS_ORDER,
} from "@/constants/order";
import { COLOR } from "@/constants/product";
import { GENDER_OPTIONS } from "@/constants/profile";
import { ROLE } from "@/constants/role";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
};

export const getStatusText = (status: string) => {
    return STATUS_ORDER.find((item: any) => item.value === status)?.label;
};

export const getPaymentStatusText = (status: string) => {
    return PAYMENT_STATUS.find((item: any) => item.value === status)?.label;
};

export const getStatusColor = (status: string) => {
    return STATUS_ORDER.find((item: any) => item.value === status)?.color;
};

export const getPaymentStatusColor = (status: string) => {
    return PAYMENT_STATUS.find((item: any) => item.value === status)?.color;
};

export const getShippingMethodText = (status: string) => {
    return SHIPPING_METHOD.find((item: any) => item.value === status)?.label;
};

export const getPaymentMethodText = (status: string) => {
    return PAYMENT_METHOD.find((item: any) => item.value === status)?.label;
};

export const getColorText = (color: string) => {
    return COLOR.find((item: any) => item.id === color)?.name;
};

export const getRoleText = (role: string) => {
    return ROLE.find((item: any) => item.name === role)?.label;
};

export const getRoleId = (role: string) => {
    return ROLE.find((item: any) => item.name === role)?.id;
};

export const getGenderText = (gender: string) => {
    return GENDER_OPTIONS.find((item: any) => item.value === gender)?.label;
};

export const checkUserWorkspace = (scope: string) => {
    if (
        scope === "ROLE_ADMIN" ||
        scope === "ROLE_MANAGER" ||
        scope ||
        "ROLE_STAFF"
    ) {
        return true;
    }
    return false;
};
