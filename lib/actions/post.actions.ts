// utils/firebase.ts

import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase";

export const getBlogPosts = async () => {
  const blogCollection = collection(firestore, "posts");
  const snapshot = await getDocs(blogCollection);
  const blogPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return blogPosts;
};
