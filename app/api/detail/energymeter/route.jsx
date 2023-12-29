
import { NextResponse } from "next/server";
import { query } from "@/app/lib/database";

export const revalidate = true;

export async function POST(req) {
  try {
    const data = await req.json();
    const { energymeter: em, date, shift } = data.data;
    const formattedDate = date.split("-").reverse().join("-");
    
    let sql = `SELECT * FROM u967600739_datalogger.rishabhem${em > 9 ? em : `0${em}`}`;
    
    if (shift !== 'ALL') {
      sql += ` WHERE DATE = '${formattedDate}' AND shift = ${shift}`;
    }else {
      sql += ` WHERE DATE = '${formattedDate}'`;
    }

    const users = await query({
      query: sql,
      values: [],
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" });
  }
}
