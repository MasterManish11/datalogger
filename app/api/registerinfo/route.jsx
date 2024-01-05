// import { NextResponse } from "next/server";
// import { pool } from "@/app/lib/database";
// import bcrypt from "bcrypt";

// export async function POST(req) {
//   try {
//     const { username, password } = await req.json();
//     const lowercasedUsername = username.toLowerCase();

//     // Check if the username already exists
//     const [existingUser] = await pool.execute(
//       "SELECT * FROM users WHERE username = ?",
//       [lowercasedUsername]
//     );

//     if (existingUser.length > 0) {
//       // Username already exists, send an error response
//       return NextResponse.json({ error: "Username already exists" });
//     }

//     // Generate a random ID for the new user
//     const id = Math.floor(Math.random() * 100000);

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert the new user into the database
//     const [result] = await pool.execute(
//       "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
//       [id, lowercasedUsername, hashedPassword]
//     );

//     if (result.affectedRows === 1) {
//       return NextResponse.json({ success: true });
//     } else {
//       // Insert failed
//       return NextResponse.json({ error: "Failed to create user" });
//     }
//   } catch (error) {
//     console.error("Error in user creation:", error);
//     return NextResponse.json({ error: "Unexpected error occurred" });
//   }
// }


import { NextResponse } from "next/server";
import { pool } from "@/app/lib/database";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const lowercasedUsername = username.toLowerCase();

    // Check if the username already exists
    const [existingUser] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [lowercasedUsername]
    );

    if (existingUser.length > 0) {
      // Username already exists, send an error response
      return NextResponse.json({ error: "Username already exists" });
    }

    // Generate a random ID for the new user
    const id = Math.floor(Math.random() * 100000);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const [result] = await pool.execute(
      "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
      [id, lowercasedUsername, hashedPassword]
    );

    if (result.affectedRows === 1) {
      return NextResponse.json({ success: true });
    } else {
      // Insert failed
      return NextResponse.json({ error: "Failed to create user" });
    }
  } catch (error) {
    console.error("Error in user creation:", error);
    return NextResponse.json({ error: "Unexpected error occurred" });
  }
}
