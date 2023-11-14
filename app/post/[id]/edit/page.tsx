"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ChangeEvent, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "@/firebase";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import MarkdownPreview from "@/components/shared/MarkdownPreview";
import { Button } from "@/components/ui/button";
import { getPostById } from "@/lib/actions/post.actions";

const postSchema = z.object({
  title: z.string(),
  content: z.string(),
  image: z.string(),
});

function EditPost({ params }: { params: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [postContent, setPostContent] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [existingPost, setExistingPost] = useState<any>(null);

  const postId = params;

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      image: "",
    },
  });

  // Fetch existing post data when component mounts
  useEffect(() => {
    const fetchExistingPost = async () => {
      try {
        // Fetch existing post data based on postId
        const postData = await getPostById(postId); // Implement this function

        if (postData) {
          // Set existing post data to state
          setExistingPost(postData);

          // Populate form fields with existing post data
          form.setValue("title", postData.title);
          form.setValue("content", postData.content);
          form.setValue("image", postData.image);

          // Display image preview if image exists
          if (postData.image) {
            setImagePreviewUrl(postData.image);
          }
        } else {
          console.error("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchExistingPost();
  }, [postId, form]);

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    const file = e.target.files![0];

    try {
      const storage = getStorage();
      const storageRef = ref(storage, "images/" + file.name);

      uploadBytes(storageRef, file).then((snapshot) => {
        console.log("Uploaded an image!");
      });

      fieldChange(file.name);

      // Display image preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  async function onSubmit(values: z.infer<typeof postSchema>) {
    form.reset();

    if (!session?.user) {
      console.log("You do not have permission to post");
      return router.push("/");
    }

    try {
      console.log("Form data: ", values);

      const imageUrl = `gs://meprogress-54172.appspot.com/images/${values.image}`;
      console.log("Image Url: ", imageUrl);

      // Update existing post data instead of creating a new post
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        title: values.title,
        content: postContent,
        image: imageUrl,
        timestamp: serverTimestamp(),
      });

      console.log("Post submitted successfully");
      router.push("/");
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="post-blog-form flex flex-col mt-10 mb-28"
      >
        <div className="flex gap-6 items-top lg:gap-20">
          <div className="flex-1 flex flex-col gap-6 pt-8">
            <h2 className="text-3xl font-semibold">Create Post</h2>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-medium">Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      autoComplete="off"
                      placeholder="Today I..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="ml-auto">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {imagePreviewUrl ? (
                      <div>
                        <Image
                          src={imagePreviewUrl}
                          alt="Uplaod Preview"
                          width={350}
                          height={100}
                          className="overflow-hidden object-cover h-[15rem] rounded-lg"
                        />
                      </div>
                    ) : (
                      <div>
                        <Image
                          src="/assets/images/placeHolder.svg"
                          width={350}
                          height={100}
                          alt="placeholder"
                          className="rounded-lg"
                        />
                      </div>
                    )}
                    <span className="text-xs font-light text-gray-400 italic">
                      Landscape recommended
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImage(e, field.onChange)}
                      className="hidden"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Mark Down / Content */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="m-0 p-0 text-xl font-medium">Content</h3>
            <div className="relative min-w-[50rem] !max-w-full">
              <Popover>
                <PopoverTrigger className="flex justify-start">
                  <span className="text-xs font-light m-0 p-0 hover:underline underline-offset-2 text-gray-500 hover:text-gray-900">
                    Markdown Tips
                  </span>
                </PopoverTrigger>
                <PopoverContent className="ml-8 bg-gray-100 w-full">
                  <div className="markdown-tips-container flex gap-8">
                    <ul className="markdown-tips-list">
                      <li>
                        <p>Header 1</p>
                        <span># text</span>
                      </li>
                      <li>
                        <p>Header 2</p>
                        <span>## text</span>
                      </li>
                      <li>
                        <p>Header 3</p>
                        <span>### text</span>
                      </li>
                      <li>
                        <p>Header 4</p>
                        <span>#### text</span>
                      </li>
                      <li>
                        <p>Header 5</p>
                        <span>##### text</span>
                      </li>
                      <li>
                        <p>Header 6</p>
                        <span>###### text</span>
                      </li>
                      <li>
                        <p>Bold</p>
                        <span>**text**</span>
                      </li>
                      <li>
                        <p>Italic</p>
                        <span>*text*</span>
                      </li>
                    </ul>
                    <span className="bg-gray-300 h-auto w-0.5 rounded-2xl"></span>
                    <ul className="markdown-tips-list">
                      <li>
                        <p>Strikethrough</p>
                        <span>~~text~~</span>
                      </li>
                      <li>
                        <p>Inline Code</p>
                        <span>`text`</span>
                      </li>
                      <li>
                        <p>Blockquote</p>
                        <span>&rsaquo; text</span>
                      </li>
                      <li>
                        <p>List</p>
                        <span>- text</span>
                      </li>
                      <li>
                        <p>Link</p>
                        <span>[text](link)</span>
                      </li>
                      <li>
                        <p>Image</p>
                        <span>![alt text](url)</span>
                      </li>
                      <li>
                        <p>Divide</p>
                        <span>---</span>
                      </li>
                    </ul>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Tabs defaultValue="markdown">
            <TabsList className="mb-2">
              <TabsTrigger value="markdown">Content Markdown</TabsTrigger>
              <TabsTrigger value="preview">Content Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="markdown">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        className="resize-none min-h-[30rem] overflow-scroll"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent value="preview" className="markdown-preview">
              <div className="p-8 border-slate-300 bg-gray-50 border rounded-lg max-h-[30rem] overflow-scroll">
                <MarkdownPreview markdown={postContent} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex gap-4 mt-10">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
            className="px-6"
          >
            Cancel
          </Button>
          <Button type="submit" className="px-10">
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default EditPost;
