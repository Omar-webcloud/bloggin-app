import { doc, getDoc } from "firebase/firestore"
import { db } from "../../../lib/firebase"
import BackButton from "../../../components/BackButton"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import PostActions from "./PostActions"
import { notFound } from "next/navigation"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const docRef = doc(db, "posts", id)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) {
    return {
      title: "Post Not Found | Bloggin",
    }
  }

  const post = docSnap.data()
  return {
    title: `${post.title} | Bloggin`,
    description: post.description?.substring(0, 160) || "Read this post on Bloggin App",
  }
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const docRef = doc(db, "posts", id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    notFound()
  }

  const post = { id: docSnap.id, ...docSnap.data() } as any

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <BackButton />
      <div className="bg-card border border-border rounded-lg shadow-sm p-8 mt-6">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="text-sm text-muted-foreground mb-6">
            <span>By {post.username || "Unknown"}</span>
            {" • "}
             
        </div>

        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-foreground/90">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.description}
          </ReactMarkdown>
        </div>
        
        <PostActions postId={id} />
      </div>
    </main>
  )
}
