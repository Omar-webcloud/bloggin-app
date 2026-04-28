"use client"

import { useState } from "react"
import { Share2 } from "lucide-react"
import ShareModal from "../../../components/ShareModal"

export default function PostActions({ postId }: { postId: string }) {
  const [showShareModal, setShowShareModal] = useState(false)

  return (
    <>
      <div className="mt-8 pt-6 border-t border-border">
        <button 
          onClick={() => setShowShareModal(true)} 
          className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
        >
          Share this post <Share2 size={16} />
        </button>
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        postId={postId}
      />
    </>
  )
}
