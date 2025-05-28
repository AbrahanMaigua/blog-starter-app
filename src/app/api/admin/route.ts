import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  const body = await request.json();
  const client = await clientPromise;
  const db = client.db('blog');
  const posts = db.collection('posts');

  await posts.insertOne({
    title: body.title,
    slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
    markdown: body.markdown,
    html: body.html,
    content: body.content,
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true });
}
