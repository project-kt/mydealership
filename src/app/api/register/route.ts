import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db/config";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.query(
      'INSERT INTO users (name, email, password, "emailVerified") VALUES ($1, $2, $3, $4) RETURNING id, name, email',
      [name || email.split("@")[0], email, hashedPassword, new Date()],
    );

    return NextResponse.json(
      {
        success: true,
        user: result.rows[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
