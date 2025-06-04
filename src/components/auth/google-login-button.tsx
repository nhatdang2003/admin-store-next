'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface GoogleLoginButtonProps {
    onSuccess?: (response: any) => void;
    onError?: (error: any) => void;
    disabled?: boolean;
    className?: string;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
    onSuccess,
    onError,
    disabled = false,
    className = '',
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGoogleLogin = async () => {
        setIsLoading(true);

        try {
            // Redirect to Google OAuth endpoint
            const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_BACKEND}/api/v1/auth/google`;
            window.location.href = googleAuthUrl;
        } catch (error) {
            console.error('Google login error:', error);
            toast({
                title: 'Lỗi đăng nhập',
                description: 'Không thể đăng nhập với Google. Vui lòng thử lại.',
                variant: 'destructive',
            });
            onError?.(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            className={`w-full flex items-center justify-center gap-2 ${className}`}
            onClick={handleGoogleLogin}
            disabled={disabled || isLoading}
        >
            <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                />
                <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                />
                <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                />
                <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                />
            </svg>
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập với Google'}
        </Button>
    );
}; 