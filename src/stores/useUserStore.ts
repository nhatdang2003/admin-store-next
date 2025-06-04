import { User } from '@/types/auth'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// the store itself does not need any change
export const useUserStore = create(
    persist(
        (set, get) => ({
            user: {
                id: 0,
                email: '',
                firstName: '',
                lastName: '',
                activated: false,
                role: {
                    id: 0,
                    name: '',
                },
            },
            isAuthenticated: false,
            setAuthenticated: (user: User) => set(() => ({
                user: user,
                isAuthenticated: true,
            })),
            setUser: (user: User) => set(() => ({
                user: user,
            })),
            resetAuthenticated: () => set(() => ({
                user: {
                    id: 0,
                    email: '',
                    firstName: '',
                    lastName: '',
                    activated: false,
                },
                isAuthenticated: false,
            })),
        }),
        {
            name: 'user',
        },
    ),
)
