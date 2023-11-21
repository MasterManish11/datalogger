import { NextResponse } from "next/server";
import { query } from "@/app/lib/database";
export async function GET() {
  try {
    const sql = `SELECT * FROM rishabhplastic.rishabhem02 WHERE DATE = '18-06-2023' AND shift = 3`
    const users = await query({
      query: sql,
      values: [],
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "error" });
  }
}
