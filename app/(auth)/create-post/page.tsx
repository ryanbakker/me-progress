import PostForm from "@/components/forms/PostForm";
import React from "react";

function page() {
  return (
    <div className="py-2 px-8 flex flex-col gap-8 max-w-[60rem] mx-auto">
      <PostForm />
    </div>
  );
}

export default page;
