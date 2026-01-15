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
      case "logout": return <LogOut className="w-8 h-8" style={{ color: type === 'danger' ? '#dc3545' : 'var(--primary)', width: '2rem', height: '2rem' }} />;
      case "trash": return <Trash2 className="w-8 h-8" style={{ color: '#dc3545', width: '2rem', height: '2rem' }} />;
      default: return <AlertTriangle className="w-8 h-8" style={{ color: '#dc3545', width: '2rem', height: '2rem' }} />;
    }
  }

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        
        <div className="modal-inner">
          <div className="modal-icon-wrapper" style={{ backgroundColor: type === 'danger' ? 'rgba(220, 53, 69, 0.1)' : 'rgba(0,0,0,0.05)' }}>
            {getIcon()}
          </div>
          
          <h2 className="modal-title">{title}</h2>
          
          <div className="modal-description">
            <p>{message}</p>
          </div>
        </div>

        <div className="modal-actions">
          <button 
            onClick={onClose}
            className="button-outline"
            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
          >
            {cancelLabel}
          </button>
          <button 
            onClick={onConfirm}
            className="button"
            style={{ 
                backgroundColor: type === 'danger' ? '#dc3545' : 'var(--primary)', 
                color: 'white', 
                fontSize: '0.9rem', 
                padding: '0.5rem 1rem', 
                border: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
