import { NextResponse } from "next/server";
import { query } from "@/app/lib/database";
export const revalidate =true
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
  const data = await req.json()
  const em = data.data.energymeter;
  const fdate= data.data.fdate.split("-")
  const tdate= data.data.tdate.split("-")
  const shift = data.data.shift

  function findDatesBetween(startDateStr, endDateStr) {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const allDates = [];
  
    // Loop through each day and push it to the array
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      allDates.push(new Date(date));
    }
  
    // return allDates.map((date) => date.toDateString());
    return allDates.map((date) => date);
  }
  
  // Example usage:
  const startDate = '2023-01-01'; // Replace with your desired start date
  const endDate = '2023-01-10'; // Replace with your desired end date
  
  const result = findDatesBetween(startDate, endDate);
  console.log('All Dates:', result);
  

}