// app/posts/[slug]/page.tsx
import { getPostBySlug } from "@/lib/api";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 text-sm mb-6">{new Date(post.createdAt).toLocaleDateString()}</p>
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-64 object-cover rounded mb-6"
        />
      )}
      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: post.html?.replace(/<img /g, '<img class="w-full h-auto" ') || "" }}
      />
    </main>
  );
}
