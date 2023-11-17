"use client";

import { getPostById } from "@/lib/actions/post.actions";
import { Post } from "@/lib/converters/Post";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import Image from "next/image";
import { useEffect, useState } from "react";
import { multiFormatDateString } from "@/lib/utils";
import { markdownToHtml } from "@/components/shared/MarkdownPreview";
import Loader from "@/components/shared/Loader";
import { deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

function Page({ params }: { params: { id: string } }) {
  const postId = params.id;
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const post = await getPostById(postId);
        setCurrentPost(post);

        if (post && post.image) {
          const imageUrl = await getImageUrl(post.image);
          setImageUrl(imageUrl);
        }

        // Convert markdown to HTML
        const markdownContent = post?.content || "";
        const htmlContent = await convertToHtml(markdownContent);
        setHtmlContent(htmlContent);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchData();
  }, [postId]);

  const getImageUrl = async (imagePath: string) => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, imagePath);
      const imageUrl = await getDownloadURL(imageRef);
      return imageUrl;
    } catch (error) {
      console.error("Error getting image URL:", error);
      return null;
    }
  };

  const convertToHtml = async (markdownContent: string) => {
    try {
      const htmlContent = await markdownToHtml(markdownContent);
      return htmlContent;
    } catch (error) {
      console.error("Error converting Markdown to HTML:", error);
      return null;
    }
  };

  const handleDelete = async () => {
    try {
      if (currentPost && currentPost.id) {
        const postDocRef = doc(db, "posts", currentPost.id);
        await deleteDoc(postDocRef);
        console.log("Post deleted successfully");
        router.push("/"); // Redirect to the home page after deletion

        return toast({
          title: "Post deleted successfully!",
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleShareLink = async () => {
    try {
      if (currentPost && currentPost.id) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const shareLink = `${baseUrl}/post/${currentPost.id}`;

        // Copy share link to clipboard
        await navigator.clipboard.writeText(shareLink);

        toast({
          title: "Link copied to clipboard!",
          className:
            "bg-slate-800 text-white border border-slate-200 font-medium dark:bg-slate-200 dark:text-slate-900 dark:border-slate-800",
        });
      }
    } catch (error) {
      console.error("Error copying link to clipboard: ", error);
    }
  };

  if (!currentPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-row flex-wrap mt-8 gap-6 w-full max-w-[90%] mx-auto bg-slate-100 dark:bg-slate-700 min-h-full rounded-t-2xl pb-10">
      <div className="rounded-2xl w-screen flex flex-col object-center overflow-hidden h-full">
        <div className="overflow-hidden w-full object-center flex justify-center items-center object-fill max-h-[30rem] ">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Post Hero"
              width={700}
              height={700}
              priority
              className="object-fill w-full h-full  object-center overflow-hidden"
            />
          ) : (
            <div className="w-full h-[28rem] flex items-center justify-center">
              <Loader />
            </div>
          )}
        </div>

        <div className="p-14 flex flex-col gap-2 w-full flex-1 max-w-5xl lg:max-w-6xl mx-auto">
          <div className="flex flex-wrap mb-6 gap-x-6">
            <div>
              <h2 className="text-4xl font-medium text-slate-950 dark:text-slate-50">
                {currentPost.title}
              </h2>

              <p className="font-light text-xs mt-auto pt-4 text-gray-500 dark:text-gray-300 pb-10">
                Posted &nbsp;– &nbsp;
                {multiFormatDateString(currentPost.timestamp.toDateString())}
              </p>
            </div>
            <div className="gap-2 inline-flex xl:ml-auto items-start">
              <button
                className="flex gap-2 items-center justify-center bg-slate-600 px-6 py-2 rounded-md hover:bg-slate-500 transition-all text-white dark:bg-slate-50 dark:text-slate-950 hover:dark:bg-slate-300"
                onClick={handleShareLink}
              >
                Share
                <Image
                  src="/assets/icons/share.svg"
                  alt="edit"
                  height={15}
                  width={15}
                  className="invert dark:invert-0"
                />
              </button>
              <Link
                href={`/post/${currentPost.id}/edit`}
                className="flex gap-2 items-center justify-center bg-slate-600 px-6 py-2 rounded-md hover:bg-slate-500 transition-all text-white dark:bg-slate-50 dark:text-slate-950 hover:dark:bg-slate-300"
              >
                Edit
                <Image
                  src="/assets/icons/edit.svg"
                  alt="edit"
                  height={15}
                  width={15}
                  className="invert dark:invert-0"
                />
              </Link>
              <button
                className="flex gap-2 items-center justify-center bg-red-700 px-6 py-2 rounded-md text-white hover:bg-red-600 transition-all"
                onClick={handleDelete}
              >
                Delete
                <Image
                  src="/assets/icons/delete.svg"
                  alt="edit"
                  height={15}
                  width={15}
                  className="invert"
                />
              </button>
            </div>
          </div>

          <section
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: htmlContent || "" }}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
