// components/PostList.tsx
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  date: string;
  coverImage?: string;
};

export default function PostList({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) return <p>No hay publicaciones.</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <div key={post.id} className="flex items-center border border-gray-200 rounded-md shadow-sm p-3 bg-white gap-4">
          {/* Variante 1: Imagen pequeña a la izquierda */}
          {/* <img
            src={post.coverImage || "/default.jpg"}
            alt={post.title}
            className="w-16 h-16 object-cover rounded"
          /> */}
          <div className="flex flex-col">
            <Link href={`/posts/${post.slug}`}>
              <h3 className="text-sm font-semibold text-gray-900 hover:underline line-clamp-2">
                {post.title}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(post.date).toLocaleDateString()}
            </p>

            {/* Variante opcional: incluir excerpt como línea corta */}
            {post.excerpt && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
