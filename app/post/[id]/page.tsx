
"use client"

import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../../lib/firebase"
import { useParams } from "next/navigation"
import BackButton from "../../../components/BackButton"
import { Share2 } from "lucide-react"

export default function PostPage() {
  const [post, setPost] = useState<any>(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        const docRef = doc(db, "posts", id as string)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() })
        } else {
        }
      }
    }

    fetchPost()
  }, [id])

  if (!post) {
    return (
        <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-l-primary"></div>
        </div>
    )
  }

  const handleShare = () => {
      const url = `https://bloggin-app-six.vercel.app/post/${id}`;
      navigator.clipboard.writeText(url)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Failed to copy: ", err));
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <BackButton />
      <div className="bg-card border border-border rounded-lg shadow-sm p-8 mt-6">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="text-sm text-muted-foreground mb-6">
            <span>By {post.username || "Unknown"}</span>
            {" • "}
             
        </div>

        <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{post.description}</p>
        
        <div className="mt-8 pt-6 border-t border-border">
             <button 
                onClick={handleShare} 
                className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
            >
                Share this post <Share2 size={16} />
            </button>
        </div>
      </div>
    </main>
  )
}
