import { NextResponse } from "next/server";
import { query } from "@/app/lib/database";

export const revalidate = true;

async function checkInternetConnectivity() {
  try {
    const response = await fetch(
      "https://www.google.com"
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
    const { machine: mc, fdate, tdate, shift } = data.data;

    const oneShiftTime =
      shift === "ALL" ? 1440 : process.env.NO_OF_SHIFT == 3 ? 480 : 720;

      const findDatesBetween = (startDateStr, endDateStr) => {
              const start = new Date(startDateStr);
              const end = new Date(endDateStr);
              const allDates = [];
        
              for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
                allDates.push(
                  `${date.getUTCDate().toString().padStart(2, "0")}/${(
                    date.getUTCMonth() + 1
                  )
                    .toString()
                    .padStart(2, "0")}/${date.getUTCFullYear()}`
                );
              }
        
              return allDates;
            };
        
            const convertMinToHourAndMin = (minutes) => {
              const hours = Math.floor(minutes / 60);
              const remainingMinutes = minutes % 60;
        
              return { hours, minutes: remainingMinutes };
            };
        
            const addRuntimeStoptimeHourMin = (timeArray) => {
              const total = timeArray.reduce(
                (acc, time) => {
                  acc.hours += time.hours;
                  acc.minutes += time.minutes;
                  return acc;
                },
                { hours: 0, minutes: 0 }
              );
        
              total.hours += Math.floor(total.minutes / 60);
              total.minutes %= 60;
        
              return total;
            };
        

    const result = findDatesBetween(fdate, tdate);
    const output = [];

    const queryPromise = async (date, mc, shift) => {
      try {
        const shiftCondition = shift !== "ALL" ? ` and shift=${shift}` : "";
        const answer = await query({
          query: `SELECT * FROM u967600739_datalogger.rishabhprd${
            mc > 9 ? mc : `0${mc}`
          } WHERE DATE= '${date}'${shiftCondition} and mc_status = 'RUN' and cavity!=0`,
          values: [],
        });

        return Array.isArray(answer) && answer.length > 0 ? answer : null;
      } catch (error) {
        console.error("Error in queryPromise:", error);
        return null;
      }
    };

    const queryPromises = result.map((date) => queryPromise(date, mc, shift));
    const answers = await Promise.all(queryPromises);

    for (let i = 0; i < result.length; i++) {
      const answer = answers[i];
      const emptyRow = {
        date: result[i],
        machine: mc,
        runTime: { hours: 0, minutes: 0 },
        stopTime: { hours: 0, minutes: 0 },
        efficiency: 0,
        production: 0,
      };

      if (answer) {
        const totalRunTime = (answer.length / 6).toFixed();
        const totalStopTime = (oneShiftTime - totalRunTime).toFixed();
        const efficiency = ((totalRunTime / oneShiftTime) * 100).toFixed(2);
        let production = 0;

        if (shift === "ALL") {
          const res = answers[i].filter((item) => item.shift === 1);
          const res1 = answers[i].filter((item) => item.shift === 2);

          production =
          res.length > 0
            ? res[res.length - 1].production
            : 0;

        production +=
          res1.length > 0
            ? res1[res1.length - 1].production
            : 0;

        } else {
          production = answer && answer.length > 0 ? answer[answer.length - 1].production : 0;
        }

        const runTime = convertMinToHourAndMin(totalRunTime);
        const stopTime = convertMinToHourAndMin(totalStopTime);

        output.push({
          date: result[i],
          machine: mc,
          runTime,
          stopTime,
          efficiency,
          production,
        });
      } else {
        output.push(emptyRow);
      }
    }

    output.push({
      date: "Total",
      machine: "-",
      runTime: addRuntimeStoptimeHourMin(output.map((b) => b.runTime)),
      stopTime: addRuntimeStoptimeHourMin(output.map((b) => b.stopTime)),
      efficiency: (
        output
          .map((b) => parseFloat(b.efficiency))
          .reduce((acc, current) => acc + current, 0) / result.length
      ).toFixed(2),
      production: output
        .map((b) => b.production)
        .reduce((acc, current) => acc + current, 0),
    });

    if (output.length === 0) {
      return NextResponse.json({ message: "No data available" });
    }

    return NextResponse.json(output);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" });
  }
}
