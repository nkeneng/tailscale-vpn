"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'

export default function Signup() {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const [supabase] = useState(() => createClientComponentClient())

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
            alert('Signup successful! Please check your email to confirm your account.')
            router.push('/')
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignup = async () => {
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
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-3xl font-bold mb-6">Sign Up for Linode VPN Setup</h1>
            <form onSubmit={handleSignup} className="w-full max-w-md space-y-4">
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Loading...' : 'Sign Up'}
                </Button>
            </form>
            <Button onClick={handleGoogleSignup} disabled={isLoading} className="mt-4 w-full max-w-md">
                {isLoading ? 'Loading...' : 'Sign up with Google'}
            </Button>
            <Link href="/" className="mt-4 text-blue-500 hover:underline">
                Already have an account? Sign In
            </Link>
        </div>
    )
}