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
    <main className="container">
      <BackButton />
      <div className="my-posts-container">
        {/* User Profile Section */}
        <div className="profile-header">
             <div className="user-info-section">
                 {isEditingUsername ? (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input 
                            type="text" 
                            value={newUsername} 
                            onChange={(e) => setNewUsername(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <button className="button" style={{ padding: '0.5rem' }} onClick={handleUpdateUsername}>Save</button>
                        <button className="button-outline" style={{ padding: '0.5rem' }} onClick={() => setIsEditingUsername(false)}>Cancel</button>
                    </div>
                ) : (
                    <>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>@{user.displayName || "Anonymous"}</span>
                        <button className="button-outline" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }} onClick={() => setIsEditingUsername(true)}>Edit Username</button>
                    </>
                )}
                {usernameError && <p style={{ color: 'red', fontSize: '0.8rem', width: '100%' }}>{usernameError}</p>}
            </div>
            
            <button 
                onClick={() => setIsDeleteModalOpen(true)}
                style={{ backgroundColor: '#dc3545', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
            >
                Delete Account
            </button>
        </div>

        <h1>My Posts</h1>
        
        <DeleteAccountModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteAccount}
        />

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
