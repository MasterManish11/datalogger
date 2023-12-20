import { NextResponse } from "next/server";
import {pool} from "@/app/lib/database";
import bcrypt from 'bcrypt';
// const bcrypt = require('bcrypt');
export async function POST(req) {
  const userInfo = await req.json();
  const username = userInfo.username.toLowerCase();
  const password = userInfo.password;

  const [existingUser] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);

  if (existingUser.length > 0) {
    // Email already exists, send an error response
  return NextResponse.json({ error: 'username already exist' });
  }

  try {  
    const id = Math.floor(Math.random()*100000)
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      "INSERT INTO users (id,username,password) VALUES (?, ?, ?)",
      [id,username, hashedPassword]
    );

    if (result.affectedRows === 1) {
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    return NextResponse.json({ error: "error" });
  }
}
