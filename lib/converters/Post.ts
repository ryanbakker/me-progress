import { db } from "@/firebase";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  orderBy,
  query,
} from "firebase/firestore";

export interface User {
  id: string;
  email: string;
  name: string;
  image: string;
}

export interface Post {
  id?: string;
  title: string;
  image: string;
  content: string;
  timestamp: Date;
  user: User;
}

const postConverter: FirestoreDataConverter<Post> = {
  toFirestore: function (post: Post): DocumentData {
    return {
      title: post.title,
      image: post.image,
      content: post.content,
      timestamp: post.timestamp,
      user: post.user,
    };
  },

  fromFirestore: function (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Post {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      title: data.title,
      image: data.image,
      content: data.content,
      timestamp: data.timestamp?.toDate(),
      user: data.user,
    };
  },
};

export const postsRef = (postId: string) =>
  collection(db, "posts", postId, "posts").withConverter(postConverter);

export const sortedPostsRef = (postId: string) =>
  query(postsRef(postId), orderBy("timestamp", "desc"));
