import AllBlogPosts from "@/components/shared/AllBlogPosts";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-800 py-12 px-8 flex flex-col items-center">
      <div className="mx-auto">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-medium tracking-tight flex-1 text-slate-800 dark:text-slate-100">
            Blog Posts
          </h2>

          <AllBlogPosts />
        </div>
      </div>
    </main>
  );
}
