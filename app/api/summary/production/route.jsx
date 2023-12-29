import { NextResponse } from "next/server";
import { query } from "@/app/lib/database";

export const revalidate = true;

export async function POST(req) {
  try {
    const data = await req.json();
    const { machine: mc, fdate, tdate, shift } = data.data;
    const oneShiftTime = process.env.NO_OF_SHIFT == 3 ? 480 : 720;

    const findDatesBetween = (startDateStr, endDateStr) => {
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);
      const allDates = [];

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
    };

    const convertMinToHourAndMin = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      return {
        hours,
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

      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes %= 60;

      return { hours: totalHours, minutes: totalMinutes };
    };

    const result = findDatesBetween(fdate, tdate);
    const output = [];

    if (result.length > 0) {
      const queryPromise1 = (date, em, shift) => {
        return query({
          query: `SELECT * FROM u967600739_datalogger.rishabhprd${
            mc > 9 ? mc : `0${mc}`
          } WHERE DATE= '${date}' and shift=${shift} and mc_status = 'RUN'`,
          values: [],
        });
      };

      for (let i = 1; i <= result.length; i++) {
        try {
          const answer = await queryPromise1(result[i - 1], mc, shift);

          const totalRunTime = (answer.length / 6).toFixed();
          const totalStopTime = (oneShiftTime - totalRunTime).toFixed();
          const efficiency = (
            (totalRunTime / oneShiftTime) * 100
          ).toFixed(2);
          const production = answer[answer.length - 1].production;
          const runTime = convertMinToHourAndMin(totalRunTime);
          const stopTime = convertMinToHourAndMin(totalStopTime);

          output.push({
            date: result[i - 1],
            machine: mc,
            runTime,
            stopTime,
            efficiency,
            production,
          });

          if (i === result.length) {
            output.push({
              date: "Total",
              machine: "-",
              runTime: addRuntimeStoptimeHourMin(
                output.map((b) => b.runTime)
              ),
              stopTime: addRuntimeStoptimeHourMin(
                output.map((b) => b.stopTime)
              ),
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
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" });
  }
}
