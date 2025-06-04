import * as z from "zod";

export const shippingProfileSchema = z.object({
  id: z.number().optional(),
  firstName: z.string().min(1, "Vui lòng nhập họ"),
  lastName: z.string().min(1, "Vui lòng nhập tên"),
  phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  wardId: z.number(),
  ward: z.string().min(1, "Vui lòng nhập phường/xã"),
  districtId: z.number(),
  district: z.string().min(1, "Vui lòng nhập quận/huyện"),
  provinceId: z.number(),
  province: z.string().min(1, "Vui lòng nhập tỉnh/thành phố"),
  default: z.boolean().default(false),
});
