import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; // Assuming you have a MongoDB connection utility
import { ObjectId } from 'mongodb';
import { de, sl } from 'date-fns/locale';
import { create } from 'domain';
// /api/post/route.ts
// This file handles CRUD operations for posts in a simple in-memory array.
// Note: In a real application, you would use a database instead of an in-memory array.

// Create Post
export async function POST(req: NextRequest) {
    const { title, html, markdown } = await req.json();
    const newPost = { 
        title,
        html , 
        markdown, 
        slug: title ? title.toLowerCase().replace(/\s+/g, '-') : '', // Generate slug from title
        createdAt: new Date() }; // Add createdAt field for timestamp
    // In a real application, you would save this to a database
    // For example, using MongoDB:
    if (!title || !html) {
    return NextResponse.json({ error: 'Title and html are required' }, { status: 400 });
  }

    const client = await clientPromise;
    const db = client.db('blog'); // Replace 'blog' with your database name
    // Assuming you have a 'posts' collection

    // Check if post with the same title already exists
    const existingPost = await db.collection('posts').findOne({ title });
    if (existingPost) {
        return NextResponse.json({ error: 'Post with this title already exists' }, { status: 409 });
    }
    // Insert the new post into the database
    await db.collection('posts').insertOne(newPost);
    return NextResponse.json(newPost, { status: 201 });
}



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


// View All Posts
export async function GET() {
    const client = await clientPromise
    const db = client.db('blog'); 
    // Fetch all posts from the database
    const posts = await db.collection('posts').find({}).toArray();
    // Convert MongoDB documents to a more usable format
    const formattedPosts = posts.map(post => ({
        id: post._id.toString(), // Convert ObjectId to string
        title: post.title,
        html: post.html,
        markdown: post.markdown,
    }));
    // Return the posts as JSON
    if (formattedPosts.length === 0) {
        return NextResponse.json({ message: 'No posts found' }, { status: 404 });
    }   
    const slug = generateSlug(post.title);
    const result = await db.collection("posts").insertOne({ ...posts, slug });

    // Ejecuta el script
    addSlugsToPosts().catch(console.error);

    return NextResponse.json(formattedPosts, { status: 200 });
}

// Update Post
export async function PUT(req: NextRequest) {
    const { id, title, html } = await req.json();
    const client= await clientPromise;
    const db = client.db('blog'); // Replace 'blog' with your database name
    // Find the post by ID
    const existingPost = await db.collection('posts').findOne({ _id: new ObjectId(id) });
    if (!existingPost) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    // Update the post with new title and html
    if (!title && !html) {
        return NextResponse.json({ error: 'At least one of title or html must be provided' }, { status: 400 });
    }
    const updatedPost = {
        ...existingPost,
        title: title ?? existingPost.title,
        html: html ?? existingPost.html,
        markdown: existingPost.markdown, // Assuming you want to keep the markdown as is
    };
    // Update the post in the database
    await db.collection('posts').updateOne({ _id: new ObjectId(id) }, { $set: updatedPost });
    // Return the updated post
    return NextResponse.json({
        id: id,
        title: updatedPost.title,
        html: updatedPost.html,
    });
}

// Delete Post
export async function DELETE(req: NextRequest) {
    const { id } = await req.json();
    const client= await clientPromise;
    const db = client.db('blog'); // Replace 'blog' with your database name
    // Find the post by ID
    const existingPost = await db.collection('posts').findOne({ _id: new ObjectId(id) });
    if (!existingPost) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    // Delete the post from the database
    await db.collection('posts').deleteOne({ _id: new ObjectId(id) });
    // Return the deleted post
    // Note: In a real application, you might want to return the deleted post's details
    ;
    return NextResponse.json({delete: true, ID:id, status: 200 });
}