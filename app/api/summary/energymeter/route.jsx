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
    const { energymeter: em, fdate, tdate, shift } = data.data;
    const output = [];

    const findDatesBetween = (startDateStr, endDateStr) => {
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);
      const allDates = [];

      for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        allDates.push(new Date(date));
      }

      return allDates.map(
        (date) =>
          `${date.getUTCDate().toString().padStart(2, "0")}/${(
            date.getUTCMonth() + 1
          )
            .toString()
            .padStart(2, "0")}/${date.getUTCFullYear()}`
      );
    };

    const queryPromise1 = (date, em, shift) => {
      return new Promise(async (resolve, reject) => {
        const sql = `SELECT MAX(kwhr) - MIN(kwhr) as kwhr FROM u967600739_datalogger.rishabhem${
          em > 9 ? em : `0${em}`
        } WHERE DATE= '${date}' and shift=${shift} and kwhr!=0`;
        const elements = await query({
          query: sql,
          values: [],
        });
        resolve(elements);
      });
    };

    const result = findDatesBetween(fdate, tdate);

    if (result.length > 0) {
      for (let i = 1; i <= result.length; i++) {
        const promise1 = await queryPromise1(result[i - 1], em, shift);

        try {
          const answer = await promise1;
          output.push({
            date: result[i - 1],
            energymeter: em,
            kwhr: answer[0].kwhr,
          });

          if (i === result.length) {
            output.push({
              date: "Total",
              energymeter: "-",
              kwhr: output
                .map((b) => b.kwhr)
                .reduce((acc, current) => acc + current, 0),
            });

            if (output.length === 0) {
              return NextResponse.json({ message: "No data available" });
            }
            return NextResponse.json(output);
          }
        } catch (error) {
          return NextResponse.json({ error: "error" });
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" });
  }
}
