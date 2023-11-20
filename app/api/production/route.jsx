import { NextResponse } from "next/server";
import { query } from "@/app/lib/database";
export async function GET() {
  try {
    const sql = "SELECT * FROM localdb.userinfo";
    const users = await query({
      query: sql,
      values: [],
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "error" });
  }
}
