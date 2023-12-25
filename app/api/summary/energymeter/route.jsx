import { NextResponse } from "next/server";
import { query } from "@/app/lib/database";
export const revalidate = true;
// export async function GET() {
//   var output = [];
//   const queryPromise1 = (i) => {
//     return new Promise(async (resolve, reject) => {
//       const sql = `SELECT kwhr FROM rishabhplastic.rishabhem${i>9?i:`0${i}`} WHERE LogDate BETWEEN '2021-01-01 00:05:00' AND '2021-02-01 23:55:00' LIMIT 1`;
//       const elements = await query({
//         query: sql,
//         values: [],
//       });
//       return resolve(elements);
//     });
//   };

//   const queryPromise2 = (i) => {
//     return new Promise(async (resolve, reject) => {
//       const sql = `SELECT kwhr FROM rishabhplastic.rishabhem${i>9?i:`0${i}`} WHERE LogDate BETWEEN '2021-01-01 00:05:00' AND '2021-02-01 23:55:00' ORDER BY LogDate DESC LIMIT 1`;
//       const elements = await query({
//         query: sql,
//         values: [],
//       });
//       return resolve(elements);
//     });
//   };

//   for (let i = 1; i <= 2; i++) {
//     const promise1 = await queryPromise1(i);
//     const promise2 = await queryPromise2(i);
//     const promises = [promise1, promise2];
//     try {
//       var object = {};
//       const result = await Promise.all(promises);
//       const kwhr = result[1][0].kwhr - result[0][0].kwhr;
//       object.em = i;
//       object.kwhr = kwhr;
//       output.push(object);
//       if (i >= 10) {
//         return NextResponse.json(output);
//       }
//     } catch (error) {
//       return NextResponse.json({ error: "error" });
//     }
//   }
// }
export async function POST(req) {
  var output = [];
  const data = await req.json();
  const em = data.data.energymeter;
  const fdate = data.data.fdate;
  const tdate = data.data.tdate;
  const shift = data.data.shift;
  function findDatesBetween(startDateStr, endDateStr) {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const allDates = [];

    // Loop through each day and push it to the array
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      allDates.push(new Date(date));
    }

    return allDates.map(
      (date) =>
        `${date.getUTCDate().toString().padStart(2, "0")}-${(
          date.getUTCMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${date.getUTCFullYear()}`
    );
  }

  var result = findDatesBetween(fdate, tdate);
  // console.log("All Dates:", result);

  if (result.length > 0) {
    const queryPromise1 = (date, em, shift) => {
      return new Promise(async (resolve, reject) => {
        const sql = `SELECT MAX(kwhr) - MIN(kwhr) as kwhr FROM u967600739_datalogger.rishabhem${
          em > 9 ? em : `0${em}`
        } WHERE DATE= '${date}' and shift=${shift}`;
        const elements = await query({
          query: sql,
          values: [],
        });
        return resolve(elements);
      });
    };

    // const queryPromise2 = (date,em,shift) => {
    //       return new Promise(async (resolve, reject) => {
    //         const sql = `SELECT kwhr FROM rishabhplastic.rishabhem${i>9?i:`0${i}`} WHERE LogDate BETWEEN '2021-01-01 00:05:00' AND '2021-02-01 23:55:00' ORDER BY LogDate DESC LIMIT 1`;
    //         const elements = await query({
    //           query: sql,
    //           values: [],
    //         });
    //         return resolve(elements);
    //       });
    //     };

    for (let i = 1; i <= result.length; i++) {
      const promise1 = await queryPromise1(result[i - 1], em, shift);
      // const promise2 = await queryPromise2(result[i], em, shift);
      // const promises = [promise1, promise2];

      try {
        const answer = await promise1;
        output.push({
          date: result[i - 1],
          energymeter: em,
          kwhr: answer[0].kwhr,
        });
        if (i == result.length) {
          output.push({
            date : 'Total',
            energymeter: '-',
            kwhr: output.map((b)=>b.kwhr).reduce((acc, current) => acc + current, 0)
          })

          return NextResponse.json(output);
        }
      } catch (error) {
        return NextResponse.json({ error: "error" });
      }
    }
  }
}
