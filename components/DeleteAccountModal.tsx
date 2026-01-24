"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteAccountModal({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-card from-card to-card/95 border border-border rounded-lg shadow-2xl w-full max-w-[400px] p-6 animate-[fadeIn_0.2s_ease-out]">
        
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-3 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          
          <h2 className="text-xl font-bold m-0">Delete Account?</h2>
          
          <div className="text-left w-full bg-black/5 dark:bg-white/5 p-4 rounded-lg text-sm">
            <p className="font-semibold text-red-500 mb-2 m-0">Warning: This action is permanent.</p>
            <ul className="pl-6 m-0 list-disc space-y-1">
              <li>Your profile will be permanently deleted.</li>
              <li>Your unique username will be released.</li>
              <li>All your published posts will be erased.</li>
              <li>You cannot recover this data later.</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg shadow-sm transition-colors text-sm font-medium border-none"
          >
            Yes, Delete My Account
          </button>
        </div>
      </div>
    </div>
  )
}
