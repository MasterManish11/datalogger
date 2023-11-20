import { NextResponse } from "next/server";
import { query } from "@/app/lib/database";

export async function GET() {
  var output = [];
  const queryPromise1 = (i) => {
    return new Promise(async (resolve, reject) => {
      const sql = `SELECT kwhr FROM localdb.em${i>9?i:`0${i}`} WHERE LogDate BETWEEN '2021-01-01 00:05:00' AND '2021-02-01 23:55:00' LIMIT 1`;
      const elements = await query({
        query: sql,
        values: [],
      });
      return resolve(elements);
    });
  };

  const queryPromise2 = (i) => {
    return new Promise(async (resolve, reject) => {
      const sql = `SELECT kwhr FROM localdb.em${i>9?i:`0${i}`} WHERE LogDate BETWEEN '2021-01-01 00:05:00' AND '2021-02-01 23:55:00' ORDER BY LogDate DESC LIMIT 1`;
      const elements = await query({
        query: sql,
        values: [],
      });
      return resolve(elements);
    });
  };

  for (let i = 1; i <= 10; i++) {
    const promise1 = await queryPromise1(i);
    const promise2 = await queryPromise2(i);
    const promises = [promise1, promise2];
    try {
      var object = {};
      const result = await Promise.all(promises);
      const kwhr = result[1][0].kwhr - result[0][0].kwhr;
      object.em = i;
      object.kwhr = kwhr;
      output.push(object);
      if (i >= 10) {
        return NextResponse.json(output);
      }
    } catch (error) {
      return NextResponse.json({ error: "error" });
    }
  }
}
