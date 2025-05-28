// src/app/api/test/route.ts
import clientPromise from '@/lib/mongodb'
import { Content } from 'next/font/google'
import { NextResponse } from 'next/server'


// Obtiene un post por su slug

async function addSlugsToPosts() {
  const client = await clientPromise;
  const db = client.db();

  // Obtiene todos los posts que no tengan slug o slug vacío
  const posts = await db.collection('posts').find({ $or: [ { slug: { $exists: false } }, { slug: "" } ] }).toArray();

  for (const post of posts) {
    if (!post.title) continue; // saltar si no tiene título

    const slug = generateSlug(post.title);

    await db.collection('posts').updateOne(
      { _id: post._id },
      { $set: { slug } }
    );

    console.log(`Actualizado post ${post._id} con slug: ${slug}`);
  }

  console.log("Actualización completada");
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Ejecuta el script
addSlugsToPosts().catch(console.error);


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
        slug: c.slug || generateSlug(c.title || 'default-title'),
        markdown: c.markdown,
        html: c.html,
        content: c.content,
        createdAt: c.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error)
    return NextResponse.json({ error: 'Error de conexión', details: String(error) }, { status: 500 })
  }
}
