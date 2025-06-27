"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/portal")
      } else {
        setError(data.error || "Login failed")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="w-full flex items-center px-6 py-4">
        <a href="https://skvindia.com/" target="_blank" rel="noopener noreferrer">
          <Image src="/SKV-logo.png" alt="SKV Logo" width={40} height={40} />
        </a>
      </header>

      {/* Main Card */}
      <main className="flex flex-1 items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">SKV Employee Portal</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-6 px-4">
        <p>© 2023 Studiokon Ventures Private Limited. All rights reserved.</p>
        <div className="mt-2 space-x-3">
          <a href="https://www.facebook.com/Studiokon" target="_blank" rel="noopener noreferrer" className="underline">
            Facebook
          </a>
          <a
            href="https://www.linkedin.com/company/skv-studiokon-ventures-private-limited-/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            LinkedIn
          </a>
          <a href="https://x.com/skv_studiokon" target="_blank" rel="noopener noreferrer" className="underline">
            X (Twitter)
          </a>
          <a href="https://www.youtube.com/channel/UCA-iSimopUU2TYiD90zYSdw" target="_blank" rel="noopener noreferrer" className="underline">
            YouTube
          </a>
        </div>
        <p className="mt-2">
          Contact the developer:{" "}
          <a href="https://adityxrai.vercel.app" target="_blank" rel="noopener noreferrer" className="underline">
            adityxrai
          </a>
        </p>
      </footer>
    </div>
  )
}
