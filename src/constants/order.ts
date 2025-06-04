export const STATUS_ORDER = [
  {
    value: "PENDING",
    label: "Chờ xác nhận",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "PROCESSING",
    label: "Đang xử lý",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "SHIPPING",
    label: "Đang giao hàng",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "DELIVERED",
    label: "Đã giao hàng",
    color: "bg-green-100 text-green-800",
  },
  { value: "CANCELLED", label: "Đã hủy", color: "bg-red-100 text-red-800" },
  {
    value: "RETURNED",
    label: "Đã hoàn trả",
    color: "bg-gray-100 text-gray-800",
  },
] as const;

export const PAYMENT_STATUS = [
  {
    value: "PENDING",
    label: "Chờ thanh toán",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "SUCCESS",
    label: "Đã thanh toán",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "FAILED",
    label: "Thanh toán thất bại",
    color: "bg-red-100 text-red-800",
  },
] as const;

export const PAYMENT_METHOD = [
  { value: "COD", label: "Thanh toán khi nhận hàng" },
  { value: "VNPAY", label: "Thanh toán qua VNPAY" },
] as const;

export const SHIPPING_METHOD = [
  { value: "EXPRESS", label: "Giao hỏa tốc" },
  { value: "GHN", label: "Giao hàng nhanh" },
] as const;
