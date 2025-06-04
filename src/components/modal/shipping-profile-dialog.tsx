"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { ghnApi } from "@/services/ghn.api";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateShippingProfile,
  useUpdateShippingProfile,
} from "@/hooks/use-shipping-query";
import { ShippingProfile } from "@/types/shipping";

const shippingProfileSchema = z.object({
  firstName: z.string().min(1, "Họ không được để trống"),
  lastName: z.string().min(1, "Tên không được để trống"),
  phoneNumber: z.string().min(1, "Số điện thoại không được để trống"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  provinceId: z.number().min(1, "Vui lòng chọn tỉnh/thành phố"),
  province: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
  districtId: z.number().min(1, "Vui lòng chọn quận/huyện"),
  district: z.string().min(1, "Vui lòng chọn quận/huyện"),
  wardId: z.number().min(1, "Vui lòng chọn phường/xã"),
  ward: z.string().min(1, "Vui lòng chọn phường/xã"),
  default: z.boolean().default(false),
});

type ShippingProfileSchema = z.infer<typeof shippingProfileSchema>;

interface ShippingProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: ShippingProfile | null;
  refresh?: boolean;
}

export function ShippingProfileDialog({
  open,
  onOpenChange,
  profile,
  refresh,
}: ShippingProfileDialogProps) {
  const createProfile = useCreateShippingProfile(refresh);
  const updateProfile = useUpdateShippingProfile();
  const { toast } = useToast();
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [openProvince, setOpenProvince] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openWard, setOpenWard] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ShippingProfileSchema>({
    resolver: zodResolver(shippingProfileSchema),
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      phoneNumber: profile?.phoneNumber || "",
      address: profile?.address || "",
      provinceId: profile?.provinceId || 0,
      province: profile?.province || "",
      districtId: profile?.districtId || 0,
      district: profile?.district || "",
      wardId: profile?.wardId || 0,
      ward: profile?.ward || "",
      default: profile?.default || false,
    },
  });

  // Reset form when profile changes or dialog opens
  useEffect(() => {
    if (open) {
      reset({
        firstName: profile?.firstName || "",
        lastName: profile?.lastName || "",
        phoneNumber: profile?.phoneNumber || "",
        address: profile?.address || "",
        provinceId: profile?.provinceId || 0,
        province: profile?.province || "",
        districtId: profile?.districtId || 0,
        district: profile?.district || "",
        wardId: profile?.wardId || 0,
        ward: profile?.ward || "",
        default: profile?.default || false,
      });
    }
  }, [open, profile, reset]);

  // Watch for province and district changes
  const provinceId = watch("provinceId");
  const districtId = watch("districtId");

  // Load provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await ghnApi.getProvince();
      setProvinces(response.data);
    };
    fetchProvinces();
  }, []);

  // Load districts when province changes
  useEffect(() => {
    if (provinceId) {
      const fetchDistricts = async () => {
        const response = await ghnApi.getDistrict(provinceId);
        setDistricts(response.data);
      };
      fetchDistricts();
    } else {
      setDistricts([]);
    }
  }, [provinceId]);

  // Load wards when district changes
  useEffect(() => {
    if (districtId) {
      const fetchWards = async () => {
        const response = await ghnApi.getWard(districtId);
        setWards(response.data);
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [districtId]);

  const onSubmit = handleSubmit(async (data: ShippingProfileSchema) => {
    try {
      if (profile?.id) {
        await updateProfile.mutateAsync({
          id: profile.id,
          ...data,
        });
      } else {
        await createProfile.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving shipping profile:", error);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>
            {profile ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Họ <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        placeholder="Nhập họ"
                        className={cn(errors.firstName && "border-red-500")}
                      />
                      {errors.firstName && (
                        <span className="text-sm text-red-500">
                          {errors.firstName.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">
                  Tên <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        placeholder="Nhập tên"
                        className={cn(errors.lastName && "border-red-500")}
                      />
                      {errors.lastName && (
                        <span className="text-sm text-red-500">
                          {errors.lastName.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      placeholder="Nhập số điện thoại"
                      className={cn(errors.phoneNumber && "border-red-500")}
                    />
                    {errors.phoneNumber && (
                      <span className="text-sm text-red-500">
                        {errors.phoneNumber.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">
                Địa chỉ <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      placeholder="Nhập địa chỉ chi tiết"
                      className={cn(errors.address && "border-red-500")}
                    />
                    {errors.address && (
                      <span className="text-sm text-red-500">
                        {errors.address.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Province Selection */}
              <div className="space-y-2">
                <Label>
                  Tỉnh/Thành phố <span className="text-red-500">*</span>
                </Label>
                <Popover open={openProvince} onOpenChange={setOpenProvince}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openProvince}
                      className={cn(
                        "w-full justify-between",
                        errors.province && "border-red-500"
                      )}
                    >
                      {watch("province") || "Chọn tỉnh/thành phố"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Tìm tỉnh/thành phố..." />
                      <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {provinces.map((province) => (
                          <CommandItem
                            key={province.ProvinceID}
                            value={province.ProvinceName}
                            onSelect={() => {
                              setValue("provinceId", province.ProvinceID);
                              setValue("province", province.ProvinceName);
                              setValue("districtId", 0);
                              setValue("district", "");
                              setValue("wardId", 0);
                              setValue("ward", "");
                              setOpenProvince(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                watch("provinceId") === province.ProvinceID
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {province.ProvinceName}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.province && (
                  <span className="text-sm text-red-500">
                    {errors.province.message}
                  </span>
                )}
              </div>

              {/* District Selection */}
              <div className="space-y-2">
                <Label>
                  Quận/Huyện <span className="text-red-500">*</span>
                </Label>
                <Popover open={openDistrict} onOpenChange={setOpenDistrict}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDistrict}
                      className={cn(
                        "w-full justify-between",
                        errors.district && "border-red-500"
                      )}
                      disabled={!watch("provinceId")}
                    >
                      {watch("district") || "Chọn quận/huyện"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Tìm quận/huyện..." />
                      <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {districts.map((district) => (
                          <CommandItem
                            key={district.DistrictID}
                            value={district.DistrictName}
                            onSelect={() => {
                              setValue("districtId", district.DistrictID);
                              setValue("district", district.DistrictName);
                              setValue("wardId", 0);
                              setValue("ward", "");
                              setOpenDistrict(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                watch("districtId") === district.DistrictID
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {district.DistrictName}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.district && (
                  <span className="text-sm text-red-500">
                    {errors.district.message}
                  </span>
                )}
              </div>

              {/* Ward Selection */}
              <div className="space-y-2">
                <Label>
                  Phường/Xã <span className="text-red-500">*</span>
                </Label>
                <Popover open={openWard} onOpenChange={setOpenWard}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openWard}
                      className={cn(
                        "w-full justify-between",
                        errors.ward && "border-red-500"
                      )}
                      disabled={!watch("districtId")}
                    >
                      {watch("ward") || "Chọn phường/xã"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Tìm phường/xã..." />
                      <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {wards.map((ward) => (
                          <CommandItem
                            key={ward.WardCode}
                            value={ward.WardName}
                            onSelect={() => {
                              setValue("wardId", parseInt(ward.WardCode));
                              setValue("ward", ward.WardName);
                              setOpenWard(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                watch("wardId") === parseInt(ward.WardCode)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {ward.WardName}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.ward && (
                  <span className="text-sm text-red-500">
                    {errors.ward.message}
                  </span>
                )}
              </div>
            </div>

            {/* Is Default Checkbox */}
            <div className="flex items-center space-x-2">
              <Controller
                name="default"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isDefault"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createProfile.isPending || updateProfile.isPending}
                onClick={(e) => {
                  e.preventDefault();
                  onSubmit(e);
                }}
              >
                {createProfile.isPending || updateProfile.isPending
                  ? "Đang lưu..."
                  : profile
                  ? "Cập nhật"
                  : "Thêm địa chỉ"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
