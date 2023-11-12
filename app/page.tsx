import AllBlogPosts from "@/components/shared/AllBlogPosts";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-800 flex-1 p-12">
      <h2 className="text-3xl font-medium tracking-tight">Blog Posts</h2>

      <AllBlogPosts />
    </main>
  );
}
