"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function Login() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const [supabase] = useState(() => createClientComponentClient())

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                router.push('/dashboard')
            }
        }
        checkUser()
    }, [supabase, router])

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true)
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (error) {
            console.error('Error:', error)
            alert('Error logging in with Google')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-3xl font-bold mb-6">Welcome to Linode VPN Setup</h1>
            <Button onClick={handleGoogleLogin} disabled={isLoading} className="w-full max-w-md">
                {isLoading ? 'Loading...' : 'Sign in with Google'}
            </Button>
        </div>
    )
}