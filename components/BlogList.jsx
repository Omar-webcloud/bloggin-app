"use client"

import { useEffect, useState } from "react"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User } from "lucide-react"

export default function BlogList() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("timestamp", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const blogData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setBlogs(blogData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading posts...</p>
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts yet. Be the first to write!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {blogs.map((blog) => (
        <Card key={blog.id} className="border-border bg-card hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-balance">{blog.title}</CardTitle>
            <CardDescription className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {blog.author}
              </span>
              {blog.timestamp && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(blog.timestamp.toDate()).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{blog.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
