"use client"

import { Copy, Code, Share2, Check } from "lucide-react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string
}

export default function ShareModal({ 
  isOpen, 
  onClose,
  postId
}: ShareModalProps) {
  const [mounted, setMounted] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedEmbed, setCopiedEmbed] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
      setCopiedLink(false)
      setCopiedEmbed(false)
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  const baseUrl = "https://bloggin-app-six.vercel.app"
  const shareUrl = `${baseUrl}/post/${postId}`
  const embedCode = `<iframe src="${shareUrl}" style="width:100%; height:500px; border:1px solid #e5e7eb; border-radius:8px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);" frameborder="0" title="Bloggin Post"></iframe>`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (err) {
      console.error("Failed to copy link", err)
    }
  }

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopiedEmbed(true)
      setTimeout(() => setCopiedEmbed(false), 2000)
    } catch (err) {
      console.error("Failed to copy embed code", err)
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-card from-card to-card/95 border border-border rounded-lg shadow-2xl w-full max-w-[500px] p-6 animate-[fadeIn_0.2s_ease-out]">
        
        <div className="flex flex-col items-center text-center gap-4 mb-6">
          <div className="p-3 rounded-full bg-primary/10 flex items-center justify-center">
            <Share2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold m-0">Share Post</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Copy Link</label>
            <div className="flex gap-2">
              <input 
                readOnly 
                value={shareUrl}
                className="flex-1 bg-muted p-2 rounded border border-input text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
              />
              <button 
                onClick={handleCopyLink}
                className="p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center justify-center min-w-[40px]"
                title="Copy Link"
              >
                {copiedLink ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Embed Post</label>
            <div className="flex gap-2">
              <input 
                readOnly 
                value={embedCode}
                className="flex-1 bg-muted p-2 rounded border border-input text-foreground outline-none focus:ring-1 focus:ring-primary font-mono text-xs"
              />
              <button 
                onClick={handleCopyEmbed}
                className="p-2 bg-secondary text-secondary-foreground border border-input rounded hover:bg-secondary/80 transition-colors flex items-center justify-center min-w-[40px]"
                title="Copy Embed Code"
              >
                {copiedEmbed ? <Check size={18} /> : <Code size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8 justify-center">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-border hover:bg-muted rounded-lg transition-colors text-sm font-medium text-foreground"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
