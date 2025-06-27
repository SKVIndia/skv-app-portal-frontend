import { type NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getDB } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "yrngv85vnp4otn8ay8tsepy5p85ytn0943yn84tyn9tc5iyawc4t8wc5y8tq3pt9nthkhugesi");

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const db = getDB(); // This is the pg pool

    // Query user from PostgreSQL
    const result = await db.query(
      "SELECT employee_email, password FROM users WHERE employee_email = $1",
      [email]
    );


    if (result.rows.length === 0) {
      console.log(`❌ User not found: ${email}`);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const user = result.rows[0];

    const isValidPassword = password === user.password;

    if (!isValidPassword) {
      console.log(`❌ Invalid password for user: ${email}`);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Create JWT
    const token = await new SignJWT({ email: user.employee_email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400,
      path: "/",
    });

    console.log(`✅ Login successful for: ${user.email}`);
    return response;
  } catch (error) {
    console.error("🔥 Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
