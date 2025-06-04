"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { MapPin, CreditCard, Truck, ShoppingBag, Receipt } from "lucide-react";
import { checkoutApi } from "@/services/checkout.api";
import { PAYMENT_METHODS, SHIPPING_METHODS } from "@/constants/checkout";
import { ShippingProfileListDialog } from "@/components/modal/shipping-profile-list-dialog";
import { useShippingProfiles } from "@/hooks/use-shipping-query";
import { useCreateOrder } from "@/hooks/use-checkout-mutation";
import { useToast } from "@/hooks/use-toast";
import { formatPrice, getColorText } from "@/lib/utils";
import { ShippingProfileDialog } from "../modal/shipping-profile-dialog";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";

interface Address {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    ward: string;
    district: string;
    province: string;
    default: boolean;
}

const initialAddress: Address = {
    id: 0,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    ward: "",
    district: "",
    province: "",
    default: false,
};

export function CheckoutForm() {
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [currentAddress, setCurrentAddress] = useState<Address>(initialAddress);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [checkoutData, setCheckoutData] = useState<any | null>(null);
    const [showAddressDialog, setShowAddressDialog] = useState(false);
    const [showNewAddressDialog, setShowNewAddressDialog] = useState(false);
    const [shippingMethod, setShippingMethod] = useState("GHN");
    const [isUsePoint, setIsUsePoint] = useState(false);
    const { data: profiles, isLoading } = useShippingProfiles();
    const createOrder = useCreateOrder();
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const selectedItems = localStorage.getItem("selectedItems");
                if (!selectedItems) {
                    router.push("/cart");
                    return;
                }
                const response = await checkoutApi.getPreview({
                    shippingProfileId:
                        currentAddress?.id !== 0 ? currentAddress?.id : null,
                    cartItemIds: selectedItems ? JSON.parse(selectedItems) : [],
                    note: "",
                    paymentMethod: paymentMethod,
                    deliveryMethod: shippingMethod,
                    isUsePoint: isUsePoint,
                });
                console.log(response);

                setCheckoutData(response);
                if (response.shippingProfile?.id !== currentAddress?.id) {
                    setCurrentAddress(response.shippingProfile);
                }
            } catch (error) {
                console.error("Error fetching checkout data:", error);
            }
        };
        fetchData();
    }, [currentAddress, shippingMethod, isUsePoint]);

    if (!checkoutData) {
        return <div>Loading...</div>;
    }

    const handleCreateOrder = async () => {
        if (!currentAddress?.id) {
            toast({
                title: "Lỗi",
                description: "Vui lòng chọn địa chỉ giao hàng",
                variant: "destructive",
            });
            return;
        }

        try {
            const selectedItems = localStorage.getItem("selectedItems");
            const cartItemIds = selectedItems ? JSON.parse(selectedItems) : [];

            if (cartItemIds.length === 0) {
                toast({
                    title: "Lỗi",
                    description: "Giỏ hàng trống",
                    variant: "destructive",
                });
                return;
            }

            await createOrder.mutateAsync({
                cartItemIds,
                note: "", // Có thể thêm field note nếu cần
                paymentMethod,
                deliveryMethod: shippingMethod, // Có thể thêm option chọn đơn vị vận chuyển
                shippingProfileId: currentAddress?.id,
            });
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Cột bên trái: Địa chỉ nhận hàng */}
            <div>
                {currentAddress ? (
                    <Card className="border-black">
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg justify-between">
                                <div className="flex items-center">
                                    <MapPin className="mr-2 h-5 w-5" />
                                    Thông tin nhận hàng
                                </div>
                                <Button
                                    variant="outline"
                                    className="border-black"
                                    onClick={() => setShowAddressDialog(true)}
                                >
                                    Thay đổi địa chỉ
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <p>
                                    <strong>Họ tên:</strong> {currentAddress.firstName}{" "}
                                    {currentAddress.lastName}
                                </p>
                                <p>
                                    <strong>Số điện thoại:</strong> {currentAddress.phoneNumber}
                                </p>
                                <p>
                                    <strong>Địa chỉ:</strong> {currentAddress.address}
                                </p>
                                <p>
                                    <strong>Phường/Xã:</strong> {currentAddress.ward}
                                </p>
                                <p>
                                    <strong>Quận/Huyện:</strong> {currentAddress.district}
                                </p>
                                <p>
                                    <strong>Tỉnh/Thành phố:</strong> {currentAddress.province}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Button
                        className="w-full h-40 border-2 border-dashed border-gray-300 hover:border-black transition-colors"
                        variant="outline"
                        onClick={() => setShowNewAddressDialog(true)}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <MapPin className="h-8 w-8" />
                            <span className="text-lg font-medium">
                                Vui lòng thêm địa chỉ mới để đặt hàng
                            </span>
                        </div>
                    </Button>
                )}
            </div>

            {/* Cột bên phải */}
            <div className="space-y-6">
                {/* Sản phẩm đã chọn */}
                <Card className="border-black">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Sản phẩm đã chọn
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {checkoutData.lineItems.map((item: any) => (
                                <div key={item.cartItemId} className="flex space-x-4">
                                    <Image
                                        src={item.productVariant.image}
                                        alt={item.productName}
                                        width={100}
                                        height={100}
                                        className="rounded-md"
                                    />
                                    <div className="flex-1 space-y-2">
                                        <h3 className="font-medium">{item.productName}</h3>
                                        <p className="text-sm text-gray-600">
                                            Màu: {getColorText(item.productVariant.color)}, Kích
                                            thước: {item.productVariant.size}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-red-500">
                                                {formatPrice(item.finalPrice)}
                                            </p>
                                            {item.discountRate > 0 && (
                                                <p className="text-sm text-gray-500 line-through">
                                                    {formatPrice(item.price)}
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Số lượng: {item.quantity}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">
                                                Tổng: {formatPrice(item.finalPrice * item.quantity)}
                                            </p>
                                            {item.discountRate > 0 && (
                                                <p className="text-sm text-gray-500 line-through">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-black">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <Truck className="mr-2 h-5 w-5" />
                            Phương thức vận chuyển
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={shippingMethod}
                            onValueChange={setShippingMethod}
                            className="space-y-2"
                        >
                            {SHIPPING_METHODS.map((method) => (
                                <div
                                    key={method.value}
                                    className="flex items-center space-x-2 border border-black rounded-md p-3"
                                >
                                    <RadioGroupItem value={method.value} id={method.value} />
                                    <Label htmlFor={method.value} className="flex-grow">
                                        {method.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                </Card>

                <Card className="border-black">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <CreditCard className="mr-2 h-5 w-5" />
                            Phương thức thanh toán
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={paymentMethod}
                            onValueChange={setPaymentMethod}
                            className="space-y-2"
                        >
                            {PAYMENT_METHODS.map((method) => (
                                <div
                                    key={method.value}
                                    className="flex items-center space-x-2 border border-black rounded-md p-3"
                                >
                                    <RadioGroupItem value={method.value} id={method.value} />
                                    <Label htmlFor={method.value} className="flex-grow">
                                        {method.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                </Card>

                <Card className="border-black">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <Receipt className="mr-2 h-5 w-5" />
                            Tổng thanh toán
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Tổng tiền hàng</span>
                                <span className="font-medium">
                                    {(
                                        checkoutData.finalTotal -
                                        checkoutData.shippingFee +
                                        checkoutData.discount
                                    ).toLocaleString("vi-VN")}
                                    ₫
                                </span>
                            </div>
                            {checkoutData.discount > 0 && (
                                <div className="flex justify-between items-center text-green-600">
                                    <span className="text-sm">Giảm giá</span>
                                    <span>-{checkoutData.discount.toLocaleString("vi-VN")}₫</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Phí vận chuyển</span>
                                <span className="font-medium">
                                    {checkoutData.shippingFee
                                        ? checkoutData.shippingFee === 0
                                            ? "Miễn phí"
                                            : `${checkoutData.shippingFee.toLocaleString("vi-VN")}₫`
                                        : "Chưa tính"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="usePoints" className="text-sm text-gray-600">
                                        Sử dụng điểm tích lũy
                                    </Label>
                                    <Switch
                                        id="usePoints"
                                        checked={isUsePoint}
                                        onCheckedChange={setIsUsePoint}
                                    />
                                </div>
                                <span className="font-medium">
                                    {checkoutData.pointDiscount
                                        ? `${checkoutData.pointDiscount.toLocaleString("vi-VN")}₫`
                                        : "0₫"}
                                </span>
                            </div>
                            <Separator className="bg-black" />
                            <div className="flex justify-between items-center font-bold">
                                <span>Tổng thanh toán</span>
                                <span>{checkoutData.finalTotal.toLocaleString("vi-VN")}₫</span>
                            </div>
                            <Button
                                className="w-full bg-black hover:bg-gray-800 text-white"
                                onClick={handleCreateOrder}
                                disabled={createOrder.isPending || !currentAddress}
                            >
                                {createOrder.isPending ? "Đang xử lý..." : "Đặt hàng"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <ShippingProfileListDialog
                open={showAddressDialog}
                onOpenChange={setShowAddressDialog}
                profiles={profiles || []}
                selectedProfileId={currentAddress?.id}
                onSelect={(profile) => setCurrentAddress(profile)}
            />

            <ShippingProfileDialog
                open={showNewAddressDialog}
                onOpenChange={setShowNewAddressDialog}
                profile={null}
                refresh={true}
            />
        </div>
    );
}
