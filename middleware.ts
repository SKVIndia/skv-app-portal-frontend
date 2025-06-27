import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this")

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/portal")) {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      console.warn("⛔️ No auth-token found, redirecting...")
      return NextResponse.redirect(new URL("/", request.url))
    }

    try {
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.next()
    } catch (error) {
      console.warn("⛔️ Invalid token, redirecting...")
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/portal/:path*"],
}
