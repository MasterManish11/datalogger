import { NextResponse } from "next/server";
import { query } from "@/app/lib/database";
export const revalidate = true;

export async function POST(req) {
  var output = [];
  const data = await req.json();
  const mc = data.data.machine;
  const fdate = data.data.fdate;
  const tdate = data.data.tdate;
  const shift = data.data.shift;
  const oneShiftTime = process.env.NO_OF_SHIFT == 3 ? 480 : 720;
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

  const convertMinToHourAndMin = (minutes) => {
    var hours = Math.floor(minutes / 60);
    var remainingMinutes = minutes % 60;

    return {
      hours: hours,
      minutes: remainingMinutes,
    };
  };

  const addRuntimeStoptimeHourMin = (timeArray) => {
    let totalHours = 0;
    let totalMinutes = 0;
    timeArray.forEach((time) => {
      totalHours += time.hours;
      totalMinutes += time.minutes;
    });

    
    // Adjust totalMinutes if it exceeds 60
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;

    return { hours:totalHours, minutes:totalMinutes};
  };

  var result = findDatesBetween(fdate, tdate);
  //   console.log("All Dates:", result);

  if (result.length > 0) {
    const queryPromise1 = (date, em, shift) => {
      return new Promise(async (resolve, reject) => {
        const sql = `SELECT * FROM u967600739_datalogger.rishabhprd${
          mc > 9 ? mc : `0${mc}`
        } WHERE DATE= '${date}' and shift=${shift} and mc_status = 'RUN'`;
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
      const promise1 = await queryPromise1(result[i - 1], mc, shift);
      // const promise2 = await queryPromise2(result[i], em, shift);
      // const promises = [promise1, promise2];

      try {
        const answer = await promise1;
        const totalRunTime = (answer.length / 6).toFixed(); //(60sec / 10sec(stemp time))
        const totalStopTime = (oneShiftTime - totalRunTime).toFixed(); //(60sec / 10sec(stemp time))
        const efficiency = ((totalRunTime / oneShiftTime) * 100).toFixed(
          2,
          "0"
        );
        const production = answer[answer.length - 1].production;
        const runTime = convertMinToHourAndMin(totalRunTime);
        const stopTime = convertMinToHourAndMin(totalStopTime);

        // console.log("totalRunTime", totalRunTime,'totalStopTime',totalStopTime,"efficiency",efficiency,'totalProduction',totalProduction);
        // return NextResponse.json(answer);
        output.push({
          date: result[i - 1],
          machine: mc,
          runTime,
          stopTime,
          efficiency,
          production,
        });
        if (i == result.length) {
          output.push({
            date: "Total",
            machine: "-",
            runTime: addRuntimeStoptimeHourMin(output.map((b) => b.runTime)),
            stopTime: addRuntimeStoptimeHourMin(output.map((b) => b.stopTime)),
            efficiency: (
              output
                .map((b) => parseFloat(b.efficiency))
                .reduce((acc, current) => acc + current, 0) / 2
            ).toFixed(2),
            production: output
              .map((b) => b.production)
              .reduce((acc, current) => acc + current, 0),
          });

          return NextResponse.json(output);
        }
      } catch (error) {
        return NextResponse.json({ error: "error" });
      }
    }
  }
}


