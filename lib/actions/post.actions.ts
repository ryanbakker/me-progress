import { db } from "@/firebase";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { Post, postConverter } from "../converters/Post";

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
