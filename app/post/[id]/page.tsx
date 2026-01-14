
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
          console.log("No such document!")
        }
      }
    }

    fetchPost()
  }, [id])

  if (!post) {
    return <div>Loading...</div>
  }

  const handleShare = () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Failed to copy: ", err));
  }

  return (
    <main className="container">
      <BackButton />
      <div className="post-container">
        <h1>{post.title}</h1>
        <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: "1rem" }}>
            <span>By {post.username || "Unknown"}</span>
            {" • "}
             {/* Note: Timestamp conversion logic would be needed here if displaying date, 
                 but keeping it simple as requested for now or assuming pre-formatted. 
                 Since 'post' is raw data, we might need a helper, but I'll stick to the title/desc update first 
                 with the Share button. */}
        </div>

        <p className="post-body">{post.description}</p>
        
        <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
             <button 
                onClick={handleShare} 
                style={{ 
                    background: 'none', 
                    border: '1px solid var(--primary)', 
                    borderRadius: '4px',
                    cursor: 'pointer', 
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem'
                }}
            >
                Share this post <Share2 size={16} />
            </button>
        </div>
      </div>
    </main>
  )
}
