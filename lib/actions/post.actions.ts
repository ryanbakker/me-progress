import {
  getDocs,
  collection,
  query,
  orderBy,
  getDoc,
  doc,
} from "firebase/firestore";
import { Post, postConverter } from "../converters/Post";
import { db } from "@/firebase";

export async function getAllPosts(): Promise<Post[]> {
  const postsCollection = collection(db, "posts");
  const postsQuery = query(postsCollection, orderBy("timestamp", "desc"));

  try {
    const querySnapshot = await getDocs(postsQuery);
    const posts: Post[] = [];

    querySnapshot.forEach((doc) => {
      const post = postConverter.fromFirestore(doc, {});
      posts.push(post);
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export async function getPostById(postId: string): Promise<Post | null> {
  const postRef = doc(db, "posts", postId); // Use doc instead of collection

  try {
    const docSnapshot = await getDoc(postRef);

    if (docSnapshot.exists()) {
      const post = postConverter.fromFirestore(docSnapshot, {});
      return post;
    } else {
      console.error("Post not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
}
