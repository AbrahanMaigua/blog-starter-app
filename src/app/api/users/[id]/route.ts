// src/app/api/users/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";  
import { ObjectId } from "mongodb";


// GET
// GET /api/users/[id]
// Obtiene un usuario por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const client = await clientPromise;
    const db = client.db("blog");
    const users = db.collection("users");
    
    const user = await users.findOne({ _id: new ObjectId(params.id) });
    
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user);

}   
// put
// PUT /api/users/[id]
// Actualiza un usuario por ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("blog");
    const users = db.collection("users");
    
    const result = await users.updateOne(
        { _id: new ObjectId(params.id) },
        { $set: { name: body.name, email: body.email } }
    );
    
    if (result.modifiedCount === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ ok: true });
    
}

// DELETE
// DELETE /api/users/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const client = await clientPromise;
    const db = client.db("blog");
    const users = db.collection("users");
    
    const result = await users.deleteOne({ _id: new ObjectId(params.id) });
    
    if (result.deletedCount === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ ok: true });
    
}