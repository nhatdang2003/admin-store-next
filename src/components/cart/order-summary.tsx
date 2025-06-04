import { formatPrice } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

interface OrderSummaryProps {
  orderSummary: {
    subtotal: number;
    discount: number;
    shippingFee: number;
    total: number;
  };
  selectedItemsCount: number;
  onCheckout: () => void;
}

export function OrderSummary({
  orderSummary,
  selectedItemsCount,
  onCheckout,
}: OrderSummaryProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Tổng đơn hàng</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Giá trị đơn hàng</span>
            <span>{formatPrice(orderSummary.subtotal)}</span>
          </div>
          <div className="flex justify-between text-red-500">
            <span>Giảm giá</span>
            <span>-{formatPrice(orderSummary.discount)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold text-xl">
            <span>Tổng</span>
            <span>{formatPrice(orderSummary.total)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6">
        <Button
          className="w-full"
          onClick={onCheckout}
          disabled={selectedItemsCount === 0}
        >
          {selectedItemsCount === 0
            ? "Vui lòng chọn sản phẩm"
            : "Tiến hành thanh toán"}
        </Button>
      </CardFooter>
    </Card>
  );
}
