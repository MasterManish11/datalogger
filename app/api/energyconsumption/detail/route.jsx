import { NextResponse } from "next/server";
import { query } from "@/app/lib/database";
// export async function GET() {
  // const data = await req.json()
  //  const em = data.data.energymeter;
  //  const date= data.data.date.split("-")
  //  const shift = data.data.shift
    // try {
    //     const sql = `SELECT * FROM rishabhplastic.rishabhem01 WHERE DATE = '18-06-2023' AND shift = 1`;
    //     const users = await query({
    //       query: sql,
    //       values: [],
    //     });
    //     return NextResponse.json(users);
    //   } catch (error) {
    //     return NextResponse.json({ error: "error" });
    //   }
// }
export async function POST(req) {
  const data = await req.json()
  console.log("data",data)
   const em = data.data.energymeter;
   const date= data.data.date.split("-")
   const shift = data.data.shift
    try {
        const sql = `SELECT * FROM rishabhplastic.rishabhem${em>9?em:`0${em}`} WHERE DATE = '${date[2]}-${date[1]}-${date[0]}' AND shift = ${shift}`;
        const users = await query({
          query: sql,
          values: [],
        });
        return NextResponse.json(users);
      } catch (error) {
        return NextResponse.json({ error: "error" });
      }
}
