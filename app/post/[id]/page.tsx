"use client";
import { getPostById } from "@/lib/actions/post.actions";
import { Post } from "@/lib/converters/Post";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { multiFormatDateString } from "@/lib/utils";
import { markdownToHtml } from "@/components/shared/MarkdownPreview";

const Page = ({ params }: { params: { id: string } }) => {
  const postId = params.id;
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

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

  if (!currentPost) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-row flex-wrap mt-8 gap-6 w-full max-w-[90%] mx-auto bg-slate-700 min-h-full rounded-t-2xl overflow-hidden">
      <Link
        href={`/post/${currentPost.id}`}
        className="bg-slate-700 rounded-lg w-screen flex flex-col max-h-[40rem] object-center"
      >
        <div className="overflow-hidden w-full object-center flex justify-center items-center min-h-[24rem]">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Post Hero"
              width={800}
              height={800}
              priority
              className="object-fill w-full h-auto rounded-t-2xl object-center "
            />
          )}
        </div>

        <div className="p-14 flex flex-col gap-2 w-full flex-1 max-w-5xl mx-auto">
          <h2 className="text-4xl font-medium">{currentPost.title}</h2>
          <p className="font-light text-xs mt-auto pt-4">
            Posted -{" "}
            {multiFormatDateString(currentPost.timestamp.toDateString())}
          </p>
          <div dangerouslySetInnerHTML={{ __html: htmlContent || "" }} />
          {/* <p className="font-light text-sm text-gray-300 mt-8">
            {currentPost.content}
          </p> */}
        </div>
      </Link>
    </div>
  );
};

export default Page;
