import { Pool } from "pg"; // ✅ this line is MISSING

export function getDB() {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    return pool;
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err);
    throw err;
  }
}
