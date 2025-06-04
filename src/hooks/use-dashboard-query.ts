import { dashboardApi } from "@/services/dashboard.api";
import { orderApi } from "@/services/order.api";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = () => {
    return useQuery({
        queryKey: ["dashboard"],
        queryFn: () => dashboardApi.getDashboard(),
    });
};

export const useRevenueByMonth = (year: string) => {
    return useQuery({
        queryKey: ["revenue-by-month", year],
        queryFn: () => dashboardApi.getRevenueByMonth(year),
    });
};

export const useNewOrders = () => {
    return useQuery({
        queryKey: ["new-orders"],
        queryFn: () => orderApi.getOrders(1, 5),
    });
};
