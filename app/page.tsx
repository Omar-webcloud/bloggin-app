"use client";

import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { auth, db } from "../lib/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Share2 } from "lucide-react";
import ConfirmationModal from "../components/ConfirmationModal";
import HelpModal from "../components/HelpModal";
import TermsModal from "../components/TermsModal";
import ShareModal from "../components/ShareModal";

interface Post {
  id: string;
  title: string;
  description: string;
  userId: string;
  username?: string;
  createdAt: any;
}

export default function Component() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [postToDeleteId, setPostToDeleteId] = useState<string | null>(null);
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [sharePostId, setSharePostId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuPostId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      let q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      if (search) {
        q = query(
          collection(db, "posts"),
          where("title", ">=", search),
          where("title", "<=", search + "\uf8ff")
        );
      }
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Post, 'id'>),
      }));
      setPosts(postsData);
      setIsLoading(false);
    };

    fetchPosts();
  }, [search]);

  const handleDelete = (postId: string) => {
      setPostToDeleteId(postId);
      setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!postToDeleteId) return;

    try {
        await deleteDoc(doc(db, "posts", postToDeleteId));
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postToDeleteId));
        router.refresh();
        setShowDeleteModal(false);
        setPostToDeleteId(null);
    } catch (error) {
        console.error("Error deleting post:", error);
    }
  };

  const handleEdit = (postId: string) => {
    router.push(`/edit-post/${postId}`);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    return new Date(timestamp.seconds * 1000).toLocaleString();
  }

  const handleShare = (postId: string) => {
    setSharePostId(postId);
    setShowShareModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto px-4 flex-grow">
        <div className="my-8">
          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 rounded-lg border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-l-primary"></div>
            </div>
          ) : (
            posts.map((post) => (
              <div className="relative bg-card rounded-lg overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col group" key={post.id}>
                {user && user.uid === post.userId && (
                  <div className="absolute top-0 right-4 z-10">
                    <div className="relative inline-block text-left">
                      <button 
                        className="text-2xl p-2 bg-transparent text-foreground hover:bg-black/10 rounded-full transition-colors leading-none" 
                        onClick={(e) => {
                            e.stopPropagation();
                            e.nativeEvent.stopImmediatePropagation();
                            setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id);
                        }}
                      >
                        ⋮
                      </button>
                      {activeMenuPostId === post.id && (
                          <div className="absolute right-0 mt-2 w-32 bg-card rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                            <div className="py-1">
                                <div 
                                    onClick={(e) => { e.stopPropagation(); handleEdit(post.id); }}
                                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted cursor-pointer"
                                >
                                    Edit
                                </div>
                                <div 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted cursor-pointer"
                                >
                                    Delete
                                </div>
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                  <div className="text-xs text-muted-foreground mb-4">
                    <span>By {post.username || "Unknown"}</span>
                    {" • "}
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <p 
                    className="mb-4 text-muted-foreground flex-grow whitespace-pre-wrap overflow-hidden relative"
                    style={{ 
                        height: '6rem', 
                        maskImage: 'linear-gradient(180deg, #000 60%, transparent)',
                        WebkitMaskImage: 'linear-gradient(180deg, #000 60%, transparent)'
                    }}
                  >
                    {post.description}
                  </p>
                  
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-border">
                    <Link href={`/post/${post.id}`} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                      Full Blog
                    </Link>
                    <button 
                        onClick={() => handleShare(post.id)} 
                        className="flex items-center gap-2 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors text-sm"
                    >
                        Share <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      <footer className="mt-16 py-8 border-t border-border text-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-4 mb-4">
            <button 
                onClick={() => setShowHelpModal(true)} 
                className="text-muted-foreground hover:text-foreground transition-colors"
            >
                Help
            </button>
            <button 
                onClick={() => setShowTermsModal(true)} 
                className="text-muted-foreground hover:text-foreground transition-colors"
            >
                Terms and Conditions
            </button>
          </div>
          <p className="text-muted-foreground">&copy; BLOGGIN App by Omar. All rights reserved.</p>
        </div>
      </footer>
      
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Post?"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete"
        icon="trash"
        type="danger"
      />

      <HelpModal 
        isOpen={showHelpModal} 
        onClose={() => setShowHelpModal(false)} 
      />
      <TermsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
      />
      
      {sharePostId && (
        <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            postId={sharePostId}
        />
      )}
    </div>
  );
}
