import * as z from "zod";

export const shippingInfoSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, "Họ không được để trống"),
  lastName: z.string().min(1, "Tên không được để trống"),
  phoneNumber: z
    .string()
    .min(10, "Số điện thoại không hợp lệ")
    .max(11, "Số điện thoại không hợp lệ"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  provinceId: z.number().min(1, "Vui lòng chọn tỉnh/thành phố"),
  province: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
  districtId: z.number().min(1, "Vui lòng chọn quận/huyện"),
  district: z.string().min(1, "Vui lòng chọn quận/huyện"),
  wardId: z.number().min(1, "Vui lòng chọn phường/xã"),
  ward: z.string().min(1, "Vui lòng chọn phường/xã"),
});

export type ShippingInfoSchema = z.infer<typeof shippingInfoSchema>;
