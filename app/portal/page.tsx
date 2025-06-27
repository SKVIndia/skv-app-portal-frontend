"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, LogOut, User, Shield } from "lucide-react"

interface AppPermission {
  app_name: string
  app_link: string
}

interface UserData {
  email: string
  permissions: AppPermission[]
}

export default function PortalPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/user")
      if (response.ok) {
        const data = await response.json()
        console.log(`📊 Loaded ${data.permissions.length} apps for ${data.email}`)
        setUserData(data)
      } else {
        console.log("❌ Authentication failed, redirecting to login")
        router.push("/")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleAppClick = (link: string) => {
    console.log(`🚀 Opening app: ${link}`)
    window.open(link, "_blank", "noopener,noreferrer")
  }

  const formatAppName = (appName: string) => {
    // Convert "App 1" to "Application 1", etc.
    return appName.replace(/^App\s+/, "Application ")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your personalized portal...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="https://skvindia.com/" target="_blank" rel="noopener noreferrer">
                  <Image src="/SKV-logo.png" alt="SKV Logo" width={40} height={40} />
              </a>
              <span></span>
              <span></span>
              <span></span>
              <h1 className="text-xl font-semibold text-gray-900">Employee Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-1" />
                {userData.email}
              </div>
              <div className="text-xs text-gray-500">{userData.permissions.length} apps available</div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Authorized Applications</h2>
          <p className="text-gray-600">
            You have access to {userData.permissions.length} application{userData.permissions.length !== 1 ? "s" : ""}.
            Click on any application to access it securely.
          </p>
        </div>

        {userData.permissions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Assigned</h3>
              <p className="text-gray-500">
                No applications have been assigned to your account. Please contact your administrator for access.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.permissions.map((permission, index) => (
              <Card
                key={`${permission.app_name}-${index}`}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-blue-200 rounded-xl"
                onClick={() => handleAppClick(permission.app_link)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span className="truncate font-semibold text-gray-800">{formatAppName(permission.app_name)}</span>
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-600 break-all mb-4">
                    {permission.app_link}
                  </CardDescription>
                  <Button
                    className="w-full rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAppClick(permission.app_link)
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Application
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}