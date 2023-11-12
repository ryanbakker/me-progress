import AllBlogPosts from "@/components/shared/AllBlogPosts";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-700 flex-1 p-12">
      <h2>Home Page</h2>

      <AllBlogPosts />
    </main>
  );
}
