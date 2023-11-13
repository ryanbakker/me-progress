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

function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const allPosts = await getAllPosts();
        setPosts(allPosts);

        const imageUrlPromises = allPosts.map(async (post) => {
          const imageUrl = post.image ? await getImageUrl(post.image) : null;
          return imageUrl;
        });

        const resolvedImageUrls = await Promise.all(imageUrlPromises);
        setImageUrls(
          resolvedImageUrls.filter((url) => url !== null) as string[]
        );

        setLoading(false);
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
        <Loader />
      ) : (
        <>
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="bg-slate-200 dark:bg-slate-700 rounded-lg w-[23rem] flex flex-col"
            >
              <div className="overflow-hidden h-[16rem]">
                {imageUrls[index] !== undefined ? (
                  <Image
                    src={imageUrls[index]}
                    alt="Post Hero"
                    width={200}
                    height={200}
                    priority
                    className="object-cover w-full h-full rounded-t-lg object-center overflow-hidden"
                  />
                ) : (
                  <Image
                    src="/assets/icons/placeholder.svg"
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
                  {limitContent(post.title, 60)}
                </h2>
                <p className="font-light text-sm text-slate-800 dark:text-gray-300">
                  {limitContent(post.content, 95)}
                </p>
                <div className="font-light text-xs mt-auto pt-4">
                  <p>{multiFormatDateString(post.timestamp.toDateString())}</p>
                  <button>
                    {/* <Image
                    
                    /> */}
                  </button>
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
