"use client";

import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "@/firebase";
import MarkdownPreview from "../shared/MarkdownPreview";

const postSchema = z.object({
  title: z.string(),
  content: z.string(),
  image: z.string(),
});

function PostForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [postContent, setPostContent] = useState("");

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      image: "",
    },
  });

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

      const postsCollection = collection(db, "posts");
      addDoc(postsCollection, {
        title: values.title,
        content: postContent,
        image: imageUrl,
        user: session.user.id,
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="markdown-preview">
          <h3>Content Preview</h3>

          <MarkdownPreview markdown={postContent} />
        </div>

        <div>
          <Button type="button" onClick={() => router.push("/")}>
            Cancel
          </Button>
          <Button type="submit">Post</Button>
        </div>
      </form>
    </Form>
  );
}

export default PostForm;
