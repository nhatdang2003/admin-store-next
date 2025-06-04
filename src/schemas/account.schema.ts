import * as z from "zod";

export const userInfoSchema = z.object({
    firstName: z.string().min(1, "Họ không được để trống"),
    lastName: z.string().min(1, "Tên không được để trống"),
    birthDate: z.date({
        required_error: "Vui lòng chọn ngày sinh",
    }),
    gender: z.string().min(1, "Vui lòng chọn giới tính"),
    phoneNumber: z.string().min(10, "Số điện thoại chưa hợp lệ").max(11, "Số điện thoại chưa hợp lệ"),
    hasPassword: z.boolean().optional(),
});

export const changePasswordSchema = z
    .object({
        oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
        newPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
        confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

export const createPasswordSchema = z
    .object({
        password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
        confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

