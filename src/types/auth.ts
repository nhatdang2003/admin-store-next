import {
    loginSchema,
    registerSchema,
    resetPasswordSchema,
} from "@/schemas/auth.schema";
import { z } from "zod";

// Derive types from schemas
export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;
export type ResetPasswordCredentials = z.infer<typeof resetPasswordSchema>;

export interface User {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
    activated: boolean;
    role: {
        id: number;
        name: string;
    };
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}

export interface RegisterResponse {
    message: string;
}
