import { NextResponse } from "next/server";
import { query } from "@/app/lib/database";

export const revalidate = true;
async function checkInternetConnectivity() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function POST(req) {
  try {
    const isOnline = await checkInternetConnectivity();

    if (!isOnline) {
      return NextResponse.json({ message: "Internet is not working" });
    }
    const data = await req.json();
    const { energymeter: em, date, shift } = data.data;
    const formattedDate = date.split("-").reverse().join("/");

    let sql = `SELECT * FROM u967600739_datalogger.rishabhprd${
      em > 9 ? em : `0${em}`
    }`;

    if (shift !== "ALL") {
      sql += ` WHERE DATE = '${formattedDate}' AND shift = ${shift}`;
    } else {
      sql += ` WHERE DATE = '${formattedDate}'`;
    }

    const users = await query({
      query: sql,
      values: [],
    });

    if (users.length === 0) {
      return NextResponse.json({ message: "No data available" });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" });
  }
}
