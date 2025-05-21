// src/app/api/test/route.ts
import clientPromise from '@/lib/mongodb'
import { Content } from 'next/font/google'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const collections = await db.listCollections().toArray()
    const constent = await db.collection('posts').find({}).toArray()
    return NextResponse.json({
      status: 'ok',
      collections: collections.map((c) => c.name),
      message: 'Conexión exitosa a MongoDB',
      Content: constent.map((c) => ({
        _id: c._id.toString(),
        title: c.title,
        content: c.content,
        createdAt: c.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error)
    return NextResponse.json({ error: 'Error de conexión', details: String(error) }, { status: 500 })
  }
}
