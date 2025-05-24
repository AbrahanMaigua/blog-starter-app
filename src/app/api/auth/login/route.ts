import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { validatePassword, generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection("users").findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });

  const valid = await validatePassword(password, user.password);
  if (!valid) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

  const token = generateToken({ userId: user._id.toString(), email: user.email });

  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");
  if (!token) return NextResponse.json({ error: "No token provided" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection("users").findOne({ _id: new ObjectId(token.userId) });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });

  return NextResponse.json({ user });
}

// Uncomment this if you want to implement a logout function
// export async function DELETE(req: NextRequest) {
//   const token = req.cookies.get("token");
//   if (!token) return NextResponse.json({ error: "No token provided" }, { status: 401 });
//
//   const client = await clientPromise;
//   const db = client.db();
//
//   const user = await db.collection("users").findOne({ _id: new ObjectId(token.userId) });
//   if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });
//
//   await db.collection("users").deleteOne({ _id: new ObjectId(token.userId) });
//   return NextResponse.json({ success: true });
// }