
"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore"
import { db } from "../../lib/firebase"
import Link from "next/link"
import BackButton from "../../components/BackButton"
import useAuth from "../../hooks/useAuth"
import { useRouter } from "next/navigation"

interface Post {
  id: string;
  title: string;
  userId: string;
  description: string;
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchPosts = async () => {
      if (user) {
        // Query only posts by this user to avoid downloading all posts
        const q = query(collection(db, "posts"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userPosts = querySnapshot.docs.map((doc) => ({
           id: doc.id,
           ...(doc.data() as Omit<Post, 'id'>)
        }));
        setPosts(userPosts)
      }
    }

    if (user) {
       fetchPosts()
    }
  }, [user])

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "posts", id))
        setPosts(posts.filter((post) => post.id !== id))
      } catch (error) {
        console.error("Error deleting document: ", error)
      }
    }
  }

  if (loading) return <p>Loading...</p>
  if (!user) return null

  return (
    <main className="container">
      <BackButton />
      <div className="my-posts-container">
        <h1>My Posts</h1>
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <span>{post.title}</span>
                <div className="post-actions">
                  <Link href={`/edit-post/${post.id}`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => handleDelete(post.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't created any posts yet.</p>
        )}
      </div>
    </main>
  )
}
