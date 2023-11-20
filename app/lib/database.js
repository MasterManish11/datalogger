import mysql from "mysql2/promise";
export async function query({ query, values = [] }) {
  const dbconnection = await mysql.createConnection({
    host: "rishabhplastic.c4lchbx9y0ag.ap-south-1.rds.amazonaws.com",
    user: "Admin",
    password: "Master1235",
    database: "rishabhplastic",
  });

  try {
    const [results] = await dbconnection.execute(query, values);
    dbconnection.end();
    return results;
  } catch (error) {
    throw Error(error.message);
    return { error };
  }
}
