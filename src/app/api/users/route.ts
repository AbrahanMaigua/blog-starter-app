import { NextResponse, NextRequest } from "next/server";    
import clientPromise from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";

// GET
// GET /api/users
// Obtiene todos los usuarios
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const client = await clientPromise;
  const users = client.db("blog").collection("users").find({}).toArray();

  return NextResponse.json(users);

}

// POST 
// POST /api/users
// Crea un nuevo usuario
export async function POST(req:NextRequest) {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("blog");
    const users = db.collection("users");
    if (!body.name || !body.username || !body.email || !body.password) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    // Check if user already exists
    const existingUser = await users.find({ email: body.email}).toArray();
    if (existingUser.length > 0) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
    const exitsUsename = await users.find({ username: body.username}).toArray();
    if (exitsUsename.length > 0) {
        return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }
    // Hash password
    const hashedPassword = await hashPassword(body.password);
    if (!hashedPassword) {
        return NextResponse.json({ error: "Error hashing password" }, { status: 500 });
    }
    // Insert user
    const result = await users.insertOne({
        name: body.name,
        username: body.username,
        email: body.email,
        password: hashedPassword,
        //role: body.role,
        createdAt: new Date(),
    });
    
    return NextResponse.json({ ok: true, insertdId: result.insertedId });   
}