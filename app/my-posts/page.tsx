
"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db, auth } from "../../lib/firebase"
import Link from "next/link"
import BackButton from "../../components/BackButton"

interface Post {
  id: string;
  title: string;
  author: string;
  description: string;
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchPosts = async () => {
      if (user) {
        const querySnapshot = await getDocs(collection(db, "posts"))
        const userPosts = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Post))
          .filter((post) => post.author === user.uid)
        setPosts(userPosts)
      }
    }

    fetchPosts()
  }, [user])

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "posts", id))
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("Error deleting document: ", error)
    }
  }

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
