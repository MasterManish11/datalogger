import { NextResponse } from "next/server";
import { pool } from "@/app/lib/database";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const lowercasedUsername = username.toLowerCase();

    const [users] = await pool.execute("SELECT * FROM users WHERE username = ?", [lowercasedUsername]);

    if (users.length === 0) {
      return NextResponse.json({ error: "User does not exist" });
    }

    const user = users[0];
    const secretKey = process.env.JWT_SECRET;
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign({ user: { id: user.id, username: user.username } }, secretKey);
      return NextResponse.json({ success: true, token, username: user.username });
    } else {
      return NextResponse.json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error in login:", error);
    return NextResponse.json({ error: "Unexpected error occurred" });
  }
}
