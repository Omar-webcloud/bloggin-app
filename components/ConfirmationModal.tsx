"use client"

import { AlertTriangle, LogOut, Trash2 } from "lucide-react"

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
  if (!isOpen) return null

  const getIcon = () => {
    switch(icon) {
      case "logout": return <LogOut className="w-8 h-8" style={{ color: type === 'danger' ? '#dc3545' : 'var(--primary)', width: '2rem', height: '2rem' }} />;
      case "trash": return <Trash2 className="w-8 h-8" style={{ color: '#dc3545', width: '2rem', height: '2rem' }} />;
      default: return <AlertTriangle className="w-8 h-8" style={{ color: '#dc3545', width: '2rem', height: '2rem' }} />;
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: type === 'danger' ? 'rgba(220, 53, 69, 0.1)' : 'rgba(0,0,0,0.05)', borderRadius: '50%' }}>
            {getIcon()}
          </div>
          
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>{title}</h2>
          
          <div style={{ 
              textAlign: 'center', 
              width: '100%', 
              color: '#666',
              fontSize: '0.95rem' 
          }}>
            <p style={{ margin: 0 }}>{message}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'center' }}>
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
    </div>
  )
}
