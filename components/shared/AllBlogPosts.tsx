"use client";

import { getAllPosts } from "@/lib/actions/post.actions";
import { Post } from "@/lib/converters/Post";
import { multiFormatDateString } from "@/lib/utils";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { Remarkable } from "remarkable";
import { Skeleton } from "../ui/skeleton";

function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Fetching posts...");
        setLoading(true);
        setLoadingImages(true);

        const allPosts = await getAllPosts();
        console.log("Posts fetched:", allPosts);

        setPosts(allPosts);

        const imageUrlPromises = allPosts.map(async (post) => {
          setLoadingImages(true);
          const imageUrl = post.image ? await getImageUrl(post.image) : null;
          return imageUrl;
        });

        const resolvedImageUrls = await Promise.all(imageUrlPromises);
        setImageUrls(
          resolvedImageUrls.filter((url) => url !== null) as string[]
        );

        setLoading(false);
        setLoadingImages(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

  const limitContent = (content: string, maxLength: number) => {
    // Convert Markdown content and limit characters
    const md = new Remarkable();
    const plainText = md.render(content).replace(/<[^>]*>?/gm, ""); // Remove HTML tags
    if (plainText.length > maxLength) {
      return plainText.slice(0, maxLength) + " ...";
    }
    return plainText;
  };

  return (
    <div className="flex flex-row flex-wrap mt-8 gap-6 justify-center">
      {loading ? (
        <>
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="blog-all-posts bg-slate-200 dark:bg-slate-700 rounded-lg w-[23rem] flex flex-col hover:bg-slate-300 hover:dark:bg-slate-600 transition-all"
            >
              <div className="overflow-hidden h-[16rem] relative">
                {loadingImages ? (
                  <div className="flex items-center justify-center h-full z-20">
                    <Loader />
                  </div>
                ) : (
                  <Image
                    src={imageUrls[index] || "/assets/icons/placeholder.svg"}
                    alt="Post Hero"
                    width={200}
                    height={200}
                    priority
                    className="object-cover w-full h-full rounded-t-lg object-center overflow-hidden"
                  />
                )}
              </div>

              <div className="p-6 max-w-sm flex flex-col gap-2 w-full flex-1">
                <h2 className="text-xl font-medium">
                  <Skeleton className="skeleton h-8 w-[16rem]" />
                </h2>
                <p className="font-light text-sm text-slate-800 dark:text-gray-300">
                  <Skeleton className="skeleton h-4 w-[12rem] rounded-sm" />
                </p>
                <div className="font-light text-xs mt-auto pt-4">
                  <p>
                    <Skeleton className="skeleton h-3 w-[4rem] !rounded-sm" />
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </>
      ) : (
        <>
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="bg-slate-200 dark:bg-slate-700 rounded-lg w-[23rem] flex flex-col hover:bg-slate-300 hover:dark:bg-slate-600 transition-all"
            >
              <div className="overflow-hidden h-[16rem] relative">
                {loadingImages ? (
                  <div className="flex items-center justify-center h-full z-20">
                    <Loader />
                  </div>
                ) : (
                  <Image
                    src={imageUrls[index] || "/assets/icons/placeholder.svg"}
                    alt="Post Hero"
                    width={200}
                    height={200}
                    priority
                    className="object-cover w-full h-full rounded-t-lg object-center overflow-hidden"
                  />
                )}
              </div>

              <div className="p-6 max-w-sm flex flex-col gap-2 w-full flex-1">
                <h2 className="text-xl font-medium text-slate-900 dark:text-slate-100">
                  {limitContent(post.title, 55)}
                </h2>
                <p className="font-light text-sm text-slate-800 dark:text-gray-300">
                  {limitContent(post.content, 90)}
                </p>
                <div className="font-light text-xs mt-auto pt-4">
                  <p>{multiFormatDateString(post.timestamp.toDateString())}</p>
                </div>
              </div>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}

export default BlogPage;
