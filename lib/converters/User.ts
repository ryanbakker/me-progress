import { db } from "@/firebase";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  query,
  where,
} from "firebase/firestore";
import { User } from "next-auth";

const userConverter: FirestoreDataConverter<User> = {
  toFirestore: function (admin: User): DocumentData {
    return {
      email: admin.email,
      image: admin.image,
      name: admin.name,
    };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      email: data.email,
      image: data.image,
      name: data.name,
    };
  },
};

export const getUserByEmailRef = (email: string) =>
  query(collection(db, "users"), where("email", "==", email)).withConverter(
    userConverter
  );
