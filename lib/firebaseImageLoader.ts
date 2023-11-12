import { ImageLoader } from "next/image";

const firebaseImageLoader: ImageLoader = ({ src, width, quality }) => {
  // Convert gs:// URL to Firebase Storage URL
  const firebaseStorageUrl = src.replace(
    "gs://",
    "https://firebasestorage.googleapis.com/v0/b/"
  );
  return firebaseStorageUrl;
};

export default firebaseImageLoader;
