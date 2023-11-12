"use client";

import { getAllPosts } from "@/lib/actions/post.actions";
import { Post } from "@/lib/converters/Post";
import { multiFormatDateString } from "@/lib/utils";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching posts:", error);
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
    if (content.length > maxLength) {
      return content.slice(0, maxLength) + " ...";
    }
    return content;
  };

  return (
    <div className="flex flex-row flex-wrap mt-8 gap-6 w-full">
      {posts.map((post, index) => (
        <Link
          key={post.id}
          href={`/post/${post.id}`}
          className="bg-slate-700 rounded-lg w-[22rem] flex flex-col"
        >
          <div className="overflow-hidden max-h-[16rem]">
            {imageUrls[index] && (
              <Image
                src={imageUrls[index]}
                alt="Post Hero"
                width={100}
                height={100}
                priority
                className="object-fill w-full h-auto rounded-t-lg object-center"
              />
            )}
          </div>

          <div className="p-6 max-w-sm flex flex-col gap-2 w-full flex-1">
            <h2 className="text-xl font-medium">
              {limitContent(post.title, 69)}
            </h2>
            <p className="font-light text-sm text-gray-300">
              {limitContent(post.content, 90)}
            </p>
            <p className="font-light text-xs mt-auto pt-4">
              {multiFormatDateString(post.timestamp.toDateString())}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default BlogPage;
