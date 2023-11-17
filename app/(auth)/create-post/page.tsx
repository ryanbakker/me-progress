import PostForm from "@/components/forms/PostForm";
import React from "react";

function page() {
  return (
    <div className="px-4 md:py-2 md:px-8 flex flex-col gap-8 max-w-[60rem] mx-auto">
      <PostForm />
    </div>
  );
}

export default page;
