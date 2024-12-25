"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const { signup } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await signup(name, email, password)
      
      if (error) {
        setError(error)
      } else {
        console.log('Signup successful, redirecting...')
        router.replace('/home')
      }
    } catch (e) {
      console.error('Submission error:', e)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-blue-600">Create Account</h1>
          <p className="text-gray-500">Sign up to get started with Skillup AI</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input 
              type="text" 
              name="name"
              placeholder="Full Name"
              required
            />
          </div>
          <div className="space-y-2">
            <Input 
              type="email" 
              name="email"
              placeholder="Email"
              required
            />
          </div>
          <div className="space-y-2">
            <Input 
              type="password" 
              name="password"
              placeholder="Password"
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Input 
              type="password" 
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              minLength={6}
            />
          </div>
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 