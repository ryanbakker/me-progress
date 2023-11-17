import GoogleSignInButton from "@/components/GoogleSignInButton";

const page = () => {
  return (
    <section className="h-[80vh] w-full flex justify-center items-center flex-col overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg border border-gray-300 dark:border-gray-600 flex flex-col gap-8 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <h2 className="text-xl font-medium">Sign In</h2>
          <h5 className="text-sm text-gray-800 dark:text-gray-300">
            You must sign in to create, edit or delete posts
          </h5>
        </div>
        <GoogleSignInButton />
      </div>
    </section>
  );
};

export default page;
