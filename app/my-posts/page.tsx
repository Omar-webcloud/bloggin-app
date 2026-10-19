"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, query, where, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { updateProfile, deleteUser } from "firebase/auth";
import { db } from "../../lib/firebase";
import Link from "next/link";
import BackButton from "../../components/BackButton";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import DeleteAccountModal from "../../components/DeleteAccountModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import { User, Plus, Edit, Trash2, ArrowRight } from "lucide-react";

interface Post {
  id: string;
  title: string;
  userId: string;
  description: string;
  category?: string;
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user, loading } = useAuth();
  const router = useRouter();

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [postToDeleteId, setPostToDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      setNewUsername(user.displayName || "");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (user) {
        const q = query(collection(db, "posts"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userPosts = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Post, "id">),
        }));
        setPosts(userPosts);
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user]);

  const handleDelete = (id: string) => {
    setPostToDeleteId(id);
    setShowDeletePostModal(true);
  };

  const confirmDeletePost = async () => {
    if (!user || !postToDeleteId) return;

    try {
      await deleteDoc(doc(db, "posts", postToDeleteId));
      setPosts(posts.filter((post) => post.id !== postToDeleteId));
      setShowDeletePostModal(false);
      setPostToDeleteId(null);
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  const handleUpdateUsername = async () => {
    if (!user || !newUsername.trim()) return;
    setUsernameError(null);

    const oldUsername = user.displayName;
    if (newUsername === oldUsername) {
      setIsEditingUsername(false);
      return;
    }

    try {
      const usernameDoc = await getDoc(doc(db, "usernames", newUsername));
      if (usernameDoc.exists()) {
        setUsernameError("Username is already taken.");
        return;
      }

      await setDoc(doc(db, "usernames", newUsername), { uid: user.uid });

      if (oldUsername) {
        await deleteDoc(doc(db, "usernames", oldUsername));
      }

      await updateProfile(user, { displayName: newUsername });
      setIsEditingUsername(false);
      window.location.reload();
    } catch (err: any) {
      setUsernameError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      const batch = writeBatch(db);
      posts.forEach((post) => {
        batch.delete(doc(db, "posts", post.id));
      });
      await batch.commit();

      if (user.displayName) {
        await deleteDoc(doc(db, "usernames", user.displayName));
      }

      await deleteUser(user);
      router.push("/");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <BackButton />
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm mt-4">
        
        {/* User Profile Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-border mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sage-600 to-sky-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
              {(user.displayName || "U").slice(0, 2).toUpperCase()}
            </div>
            <div>
              {isEditingUsername ? (
                <div className="flex gap-2 items-center flex-wrap">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-sage-500"
                  />
                  <button
                    className="px-3.5 py-1.5 bg-sage-600 hover:bg-sage-500 dark:bg-sage-300 dark:hover:bg-sage-200 text-white dark:text-slate-950 rounded-lg text-xs font-semibold transition-colors"
                    onClick={handleUpdateUsername}
                  >
                    Save
                  </button>
                  <button
                    className="px-3 py-1.5 border border-border text-muted-foreground hover:bg-muted rounded-lg text-xs font-medium transition-colors"
                    onClick={() => setIsEditingUsername(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <span className="text-xl sm:text-2xl font-bold text-foreground">
                    @{user.displayName || "Anonymous"}
                  </span>
                  <button
                    className="text-xs px-2.5 py-1 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    onClick={() => setIsEditingUsername(true)}
                  >
                    Edit
                  </button>
                </div>
              )}
              {usernameError && (
                <p className="text-rose-500 text-xs mt-1">{usernameError}</p>
              )}
              <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors border border-rose-500/20"
          >
            Delete Account
          </button>
        </div>

        {/* Posts header & Add CTA */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">My Published Stories</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-muted text-muted-foreground">
              {posts.length}
            </span>
          </div>
          <Link
            href="/create-post"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-sage-600 hover:bg-sage-500 dark:bg-sage-300 dark:hover:bg-sage-200 text-white dark:text-slate-950 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Story</span>
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <div
                key={post.id}
                className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
              >
                <div>
                  <Link
                    href={`/post/${post.id}`}
                    className="font-semibold text-foreground group-hover:text-sage-600 dark:group-hover:text-sage-300 transition-colors text-base"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1 max-w-xl">
                    {post.description.slice(0, 100)}...
                  </p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link
                    href={`/edit-post/${post.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              You haven&apos;t published any stories yet.
            </p>
            <Link
              href="/create-post"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-sage-600 dark:bg-sage-300 text-white dark:text-slate-950 shadow-sm"
            >
              <span>Write Your First Story</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />

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
  );
}
