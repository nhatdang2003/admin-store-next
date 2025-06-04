import { changePasswordSchema, createPasswordSchema, userInfoSchema } from "@/schemas/account.schema";
import { z } from "zod";

export type UserInfo = z.infer<typeof userInfoSchema>;
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;
export type CreatePasswordRequest = z.infer<typeof createPasswordSchema>;
