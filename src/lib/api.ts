import { Post } from "@/interfaces/post";
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const client = await clientPromise;
  const db = client.db();
  const post = await db.collection("posts").findOne({ slug });

  if (!post) return null;

  const { _id, ...rest } = post;
  return {
    id: _id.toString(),
    ...(rest as Omit<Post, "id">),
  };
}



export async function getAllPosts() {
  const client = await clientPromise;
  const db = client.db();

  const posts = await db.collection("posts")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return posts.map((post) => ({
    id: post._id.toString(),
    title: post.title || "",
    slug: post.title?.toLowerCase().replace(/\s+/g, "-") || "",
    content: post.content || "",
    coverImage: post.coverImage || "/default.jpg",
    excerpt: post.content?.substring(0, 150) || "",
    date: post.createdAt?.toISOString() || new Date().toISOString(),
    author: post.author || {
      name: "Desconocido",
      picture: "/default-avatar.png",
    },
  }));
}


// // Crear un nuevo post
// export async function createPost(post: Omit<Post, "id">): Promise<Post> {
//   const client = await clientPromise;
//   const db = client.db();

//   const existing = await db.collection("posts").findOne({ slug: post.slug });
//   if (existing) {
//     throw new Error("Ya existe un post con este slug.");
//   }
//   type PostWithId = Post & { id: string };


//   const result = await db.collection("posts").insertOne(post);
//   return {
//     ...post,
//     id: result.insertedId.toString(),
//   } satisfies PostWithId;

// } 

// // Actualiza un post por ID
// export async function updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
//   const client = await clientPromise;
//   const db = client.db();

//   const result = await db
//     .collection("posts")
//     .findOneAndUpdate(
//       { _id: new ObjectId(id) },
//       { $set: updates },
//       { returnDocument: "after" }
//     );

//   if (!result || !result.value) return null;

//   return {
//     ...result.value,
//     id: result.value._id.toString(),
//   };
// }

// // Elimina un post por ID
// export async function deletePost(id: string): Promise<boolean> {
//   const client = await clientPromise;
//   const db = client.db();

//   const result = await db.collection("posts").deleteOne({ _id: new ObjectId(id) });
//   return result.deletedCount === 1;
// }
