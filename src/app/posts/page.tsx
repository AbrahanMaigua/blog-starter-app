import PostList from "@/app/_components/PostList";
import { getAllPosts } from "@/lib/api";

export default async function Page() {
  const posts = await getAllPosts();

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Últimos posts</h1>
      <PostList posts={posts} />
    </main>
  );
}
