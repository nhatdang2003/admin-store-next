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

export const useSummary = () => {
    return useQuery({
        queryKey: ["summary"],
        queryFn: () => dashboardApi.getSummary(),
    });
};

export const useCategorySalesChart = (period: string) => {
    return useQuery({
        queryKey: ["category-sales-chart", period],
        queryFn: () => dashboardApi.getCategorySalesChart(period),
    });
};

export const useTopProducts = (period: string) => {
    return useQuery({
        queryKey: ["top-products", period],
        queryFn: () => dashboardApi.getTopProducts(period),
    });
};

export const useLowStockProducts = () => {
    return useQuery({
        queryKey: ["low-stock-products"],
        queryFn: () => dashboardApi.getLowStockProducts(),
    });
};

export const useTopReturnRequests = () => {
    return useQuery({
        queryKey: ["top-return-requests"],
        queryFn: () => dashboardApi.getTopReturnRequests(),
    });
};