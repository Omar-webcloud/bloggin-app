"use client"

import { AlertTriangle, LogOut, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  type?: "danger" | "warning" | "default"
  icon?: "alert" | "logout" | "trash"
}

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = "Confirm", 
  cancelLabel = "Cancel",
  type = "danger",
  icon = "alert"
}: ConfirmationModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  const getIcon = () => {
    switch(icon) {
      case "logout": return <LogOut className={`w-8 h-8 ${type === 'danger' ? 'text-red-500' : 'text-primary'}`} />;
      case "trash": return <Trash2 className="w-8 h-8 text-red-500" />;
      default: return <AlertTriangle className="w-8 h-8 text-red-500" />;
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-card from-card to-card/95 border border-border rounded-lg shadow-2xl w-full max-w-[400px] p-6 animate-[fadeIn_0.2s_ease-out]">
        
        <div className="flex flex-col items-center text-center gap-4">
          <div className={`p-3 rounded-full flex items-center justify-center ${type === 'danger' ? 'bg-red-500/10' : 'bg-black/5 dark:bg-white/5'}`}>
            {getIcon()}
          </div>
          
          <h2 className="text-xl font-bold m-0">{title}</h2>
          
          <div className="text-center w-full text-muted-foreground text-[0.95rem] m-0">
            <p className="m-0">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-center sm:flex-row flex-col">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors text-sm font-medium w-full sm:w-auto"
          >
            {cancelLabel}
          </button>
          <button 
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium border-none shadow-sm transition-colors w-full sm:w-auto ${type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
