import { NextResponse } from "next/server";
import { query } from "@/app/lib/database";

export const revalidate =true
export async function GET() {
  try {
    const sql = `SELECT * FROM rishabhplastic.realtimedata`
    const users = await query({
      query: sql,
      values: [],
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "error" });
  }
}