import { NextResponse } from "next/server";
import { pool } from "@/app/lib/database";
import bcrypt from "bcrypt";
var jwt = require('jsonwebtoken');

export async function POST(req) {
  const userInfo = await req.json();
  const username = userInfo.username.toLowerCase();
  const password = userInfo.password;

  // Fetch user from the database by email
  const [users] = await pool.execute("SELECT * FROM users WHERE username = ?", [
    username,
  ]);

  if (users.length === 0) {
    // User not found
    return NextResponse.json({ error: "user not exist" });
  }

  const user = users[0];
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (passwordMatch) {
    // Passwords match, user is authenticated
    let token =jwt.sign({
      user: { id: user.id, username: user.username },
    },'secretkey123')
    return NextResponse.json({ success: true,token,username: user.username});
  } else {
    // Passwords do not match
    return NextResponse.json({ error: "Invalid credentials" });
  }
}

