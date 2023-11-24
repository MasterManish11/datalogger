import mysql from "mysql2/promise";
const dbConfig = {
  host:
    process.env.DB_HOST ||
    "rishabhplastic.c4lchbx9y0ag.ap-south-1.rds.amazonaws.com",
  user: process.env.DB_USER || "Admin",
  password: process.env.DB_PASSWORD || "Master1235",
  database: process.env.DB_NAME || "rishabhplastic",
  waitForConnections: true,
};

const pool = mysql.createPool(dbConfig);

export async function query({ query, values = [] }) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(query, values);
    return results;
  } catch (error) {
    return { error };
    // console.log("Database error:", error.message);
    // throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
