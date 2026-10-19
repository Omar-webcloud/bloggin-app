import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { samplePosts } from "../../../lib/samplePosts";
import { normalizePost } from "../../../lib/postUtils";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import PostDetailView from "../../../components/PostDetailView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  
  // Try firestore
  try {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const post = docSnap.data();
      return {
        title: `${post.title} | Bloggin'`,
        description: post.description?.substring(0, 160) || "Read this story on Bloggin'",
      };
    }
  } catch {}

  // Try sample
  const sample = samplePosts.find((p) => p.id === id);
  if (sample) {
    return {
      title: `${sample.title} | Bloggin'`,
      description: sample.description?.substring(0, 160),
    };
  }

  return {
    title: "Story Not Found | Bloggin'",
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let post = null;

  try {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      post = normalizePost(docSnap.data(), docSnap.id);
    }
  } catch (err) {
    console.warn("Could not query firestore for post:", id, err);
  }

  if (!post) {
    const sample = samplePosts.find((p) => p.id === id);
    if (sample) {
      post = sample;
    }
  }

  if (!post) {
    notFound();
  }

  return <PostDetailView post={post} />;
}
