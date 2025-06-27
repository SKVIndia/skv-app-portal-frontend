import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getDB } from "@/lib/db"; // This should return a pg Pool

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this");

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const email = payload.email as string;

    const db = getDB(); // PG Pool

    const query = `
      SELECT app_name, app_link 
      FROM permissions 
      WHERE email = $1
        AND app_link IS NOT NULL 
        AND app_link != ''
        AND LOWER(app_link) NOT IN ('n/a', 'none', 'null')
        AND app_link LIKE 'http%'
      ORDER BY app_name
    `;

    const result = await db.query(query, [email]);
    const permissions = result.rows;

    console.log(`✅ Found ${permissions.length} permitted apps for user: ${email}`);

    return NextResponse.json({
      email,
      permissions,
    });
  } catch (error) {
    console.error("❌ User data error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
