// import mysql from "mysql2/promise";
// export async function query({ query, values = [] }) {
//   const dbconnection = await mysql.createConnection({
//     host: "rishabhplastic.c4lchbx9y0ag.ap-south-1.rds.amazonaws.com",
//     user: "Admin",
//     password: "Master1235",
//     database: "rishabhplastic",
//   });

//   try {
//     const [results] = await dbconnection.execute(query, values);
//     dbconnection.end();
//     return results;
//   } catch (error) {
//     throw Error(error.message);
//     return { error };
//   }
// }
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "rishabhplastic.c4lchbx9y0ag.ap-south-1.rds.amazonaws.com",
  user: process.env.DB_USER || "Admin",
  password: process.env.DB_PASSWORD || "Master1235",
  database: process.env.DB_NAME || "rishabhplastic",
};

const pool = mysql.createPool(dbConfig);


export async function query({ query, values = [] }) {
  
  
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(query, values);
    return results;
  } catch (error) {
    console.error("Database error:", error.message);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
