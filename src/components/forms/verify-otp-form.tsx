'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { useToast } from '@/hooks/use-toast'
import { useVerifyOtp, useVerifyResetPassword } from '@/hooks/use-auth-query'
import { useSearchParams } from 'next/navigation'
import { authApi } from '@/services/auth.api'

const VerifyOtpForm = () => {
    const [value, setValue] = useState('')
    const { toast } = useToast()
    const { mutate: verifyOtp } = useVerifyOtp()
    const { mutate: verifyResetPassword } = useVerifyResetPassword()
    const searchParams = useSearchParams()
    const email = searchParams.get('email')
    const type = searchParams.get('type')
    const [isPending, setIsPending] = useState(false)
    const [countdown, setCountdown] = useState(0)

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1)
            }, 1000)
        }
        return () => {
            if (timer) clearInterval(timer)
        }
    }, [countdown])

    const handleSubmit = () => {
        if (!email) {
            toast({
                variant: 'default',
                title: 'Email không hợp lệ',
                description: 'Vui lòng quay lại trang đăng ký',
            })
            return
        }
        if (value.length !== 6) {
            toast({
                variant: 'default',
                title: 'Mã kích hoạt không hợp lệ',
                description: 'Vui lòng nhập lại mã kích hoạt',
            })
            return
        }
        if (type === 'reset-password') {
            verifyResetPassword({ email: email || '', resetCode: value })
        } else {
            verifyOtp({ email: email || '', activationCode: value })
        }
    }

    const handleResendCode = async () => {
        try {
            setIsPending(true)
            if (type === 'reset-password') {
                await authApi.forgotPassword({ email: email || '' })
            } else {
                await authApi.sendVerificationEmail(email || '')
            }
            toast({
                variant: 'success',
                title: 'Mã OTP đã được gửi đến email',
                description: 'Vui lòng kiểm tra email của bạn',
            })
            setCountdown(30)
            setIsPending(false)
        } catch (error: any) {
            console.log(error)
            setIsPending(false)
            toast({
                variant: 'destructive',
                title: 'Lỗi',
                description: error.response?.data?.message || 'Vui lòng thử lại',
            })
        }
    }

    const getResendButtonText = () => {
        if (isPending) return 'Đang gửi...'
        if (countdown > 0) return `Gửi lại sau ${countdown}s`
        return 'Gửi lại mã'
    }

    const isResendDisabled = isPending || countdown > 0

    return (
        <div className="w-full max-w-md space-y-2 rounded-xl bg-white bg-opacity-90 p-8 shadow-lg backdrop-blur-sm">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Nhập mã OTP</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Nhập mã OTP đã được gửi đến email {email} của bạn
                </p>
            </div>

            <div className="grid gap-4">
                <div className="flex justify-center items-center my-2">
                    <InputOTP
                        pattern={REGEXP_ONLY_DIGITS}
                        maxLength={6}
                        value={value}
                        onChange={(value: string) => setValue(value)}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                <div className="flex justify-center items-center gap-1">
                    <p className="text-sm text-gray-600">
                        Không nhận được mã?
                    </p>
                    <Button
                        variant="link"
                        className="text-sm p-0 h-auto"
                        onClick={handleResendCode}
                        disabled={isResendDisabled}
                    >
                        <span className={countdown > 0 ? 'text-gray-500' : ''}>
                            {getResendButtonText()}
                        </span>
                    </Button>
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    onClick={handleSubmit}
                >
                    Xác thực
                </Button>
            </div>
        </div>
    )
}

export default VerifyOtpForm