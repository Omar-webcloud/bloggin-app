
"use client"

import BlogList from "../../components/BlogList"
import BackButton from "../../components/BackButton"

export default function PostsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-3xl font-bold ml-4">All Posts</h1>
      </div>
      <BlogList />
    </main>
  )
}
