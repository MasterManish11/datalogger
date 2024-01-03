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
    // const shiftDate = date.split("-").join("-");
    // var parsedDate = new Date(date + "T00:00:00Z");

    // Add one day
    // parsedDate.setDate(parsedDate.getDate() + 1);
    // // Format the new date
    // var newFormattedDate =
    //   parsedDate.getFullYear() +
    //   "-" +
    //   (parsedDate.getMonth() + 1).toString().padStart(2, "0") +
    //   "-" +
    //   parsedDate.getDate().toString().padStart(2, "0");

    let sql = `SELECT * FROM u967600739_datalogger.rishabhem${
      em > 9 ? em : `0${em}`
    }`;

    if (shift !== "ALL") {
      sql += ` WHERE DATE = '${formattedDate}' AND shift = ${shift}`;
    // } else if(shift == 3){
    //   sql+= `WHERE STR_TO_DATE(CONCAT(DATE, ' ', TIME), '%d-%m-%Y %H:%i:%s') 
    //   BETWEEN '${shiftDate} 07:00:00' AND '${newFormattedDate} 07:00:00'`

    }else{
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
