"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, deleteDoc, doc, query, where, getDoc, setDoc, writeBatch } from "firebase/firestore"
import { updateProfile, deleteUser } from "firebase/auth"
import { db, auth } from "../../lib/firebase"
import Link from "next/link"
import BackButton from "../../components/BackButton"
import useAuth from "../../hooks/useAuth"
import { useRouter } from "next/navigation"
import DeleteAccountModal from "../../components/DeleteAccountModal"
import ConfirmationModal from "../../components/ConfirmationModal"

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
  
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState("")
  const [usernameError, setUsernameError] = useState<string|null>(null)
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [showDeletePostModal, setShowDeletePostModal] = useState(false)
  const [postToDeleteId, setPostToDeleteId] = useState<string|null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (user) {
        setNewUsername(user.displayName || "")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchPosts = async () => {
      if (user) {
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

  const handleDelete = (id: string) => {
      setPostToDeleteId(id)
      setShowDeletePostModal(true)
  }

  const confirmDeletePost = async () => {
    if (!user || !postToDeleteId) return;
    
    try {
        await deleteDoc(doc(db, "posts", postToDeleteId))
        setPosts(posts.filter((post) => post.id !== postToDeleteId))
        setShowDeletePostModal(false)
        setPostToDeleteId(null)
    } catch (error) {
        console.error("Error deleting document: ", error)
    }
  }

  const handleUpdateUsername = async () => {
      if (!user || !newUsername.trim()) return;
      setUsernameError(null);
      
      const oldUsername = user.displayName;
      if (newUsername === oldUsername) {
          setIsEditingUsername(false);
          return;
      }

      try {
          // Check uniqueness
          const usernameDoc = await getDoc(doc(db, "usernames", newUsername));
          if (usernameDoc.exists()) {
              setUsernameError("Username is already taken.");
              return;
          }

          // Reserve new username
          await setDoc(doc(db, "usernames", newUsername), { uid: user.uid });
          
          // Delete old username reservation if it existed
          if (oldUsername) {
              await deleteDoc(doc(db, "usernames", oldUsername));
          }

          // Update profile
          await updateProfile(user, { displayName: newUsername });
          
          setIsEditingUsername(false);
          // Force reload to reflect changes in Navbar etc
          window.location.reload();
      } catch (err: any) {
          setUsernameError(err.message);
      }
  }

  const handleDeleteAccount = async () => {
      if (!user) return;
      
      try {
         // 1. Delete all posts
         const batch = writeBatch(db);
         posts.forEach(post => {
             batch.delete(doc(db, "posts", post.id));
         });
         await batch.commit();

         // 2. Delete username reservation
         if (user.displayName) {
             await deleteDoc(doc(db, "usernames", user.displayName));
         }

         // 3. Delete user account
         await deleteUser(user);
         
         // 4. Redirect
         router.push("/");
      } catch (error: any) {
          console.error("Error deleting account:", error);
          alert("Failed to delete account: " + error.message);
      }
  }

  if (loading) return <p>Loading...</p>
  if (!user) return null

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <BackButton />
      <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-sm">
        {/* User Profile Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-border mb-8 gap-4">
             <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                 {isEditingUsername ? (
                    <div className="flex gap-2 items-center flex-wrap w-full sm:w-auto">
                        <input 
                            type="text" 
                            value={newUsername} 
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="p-2 rounded border border-input bg-background text-foreground"
                        />
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors" onClick={handleUpdateUsername}>Save</button>
                        <button className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => setIsEditingUsername(false)}>Cancel</button>
                    </div>
                ) : (
                    <>
                        <span className="text-2xl font-bold">@{user.displayName || "Anonymous"}</span>
                        <button className="text-sm px-3 py-1 border border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => setIsEditingUsername(true)}>Edit Username</button>
                    </>
                )}
                {usernameError && <p className="text-red-500 text-xs w-full">{usernameError}</p>}
            </div>
            
            <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm font-medium w-full sm:w-auto"
            >
                Delete Account
            </button>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">My Posts</h1>
        
        <DeleteAccountModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteAccount}
        />

        {posts.length > 0 ? (
           <ul className="space-y-4">
             {posts.map((post) => (
               <li key={post.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-border last:border-0 gap-4">
                 <span className="font-medium text-lg">{post.title}</span>
                 <div className="flex gap-2 w-full sm:w-auto">
                   <Link href={`/edit-post/${post.id}`} className="flex-1 sm:flex-none">
                     <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors w-full sm:w-auto">Edit</button>
                   </Link>
                   <button onClick={() => handleDelete(post.id)} className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors flex-1 sm:flex-none">Delete</button>
                 </div>
               </li>
             ))}
           </ul>
        ) : (
           <p className="text-muted-foreground">You haven't created any posts yet.</p>
        )}
      </div>

       <ConfirmationModal
            isOpen={showDeletePostModal}
            onClose={() => setShowDeletePostModal(false)}
            onConfirm={confirmDeletePost}
            title="Delete Post?"
            message="Are you sure you want to delete this post? This action cannot be undone."
            confirmLabel="Delete"
            icon="trash"
            type="danger"
        />
    </main>
  )
}
