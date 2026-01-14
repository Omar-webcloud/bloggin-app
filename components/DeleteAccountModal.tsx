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
    <div className="modal-overlay">
      <div className="modal-content">
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(220, 53, 69, 0.1)', borderRadius: '50%' }}>
            <AlertTriangle className="w-8 h-8" style={{ color: '#dc3545', width: '2rem', height: '2rem' }} />
          </div>
          
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Delete Account?</h2>
          
          <div style={{ 
              textAlign: 'left', 
              width: '100%', 
              backgroundColor: 'rgba(0,0,0,0.05)', 
              padding: '1rem', 
              borderRadius: 'var(--radius)',
              fontSize: '0.9rem' 
          }}>
            <p style={{ fontWeight: '600', color: '#dc3545', marginBottom: '0.5rem' }}>Warning: This action is permanent.</p>
            <ul style={{ paddingLeft: '1.5rem', margin: 0, listStyle: 'disc' }}>
              <li>Your profile will be permanently deleted.</li>
              <li>Your unique username will be released.</li>
              <li>All your published posts will be erased.</li>
              <li>You cannot recover this data later.</li>
            </ul>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
          <button 
            onClick={onClose}
            className="button-outline"
            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="button"
            style={{ 
                backgroundColor: '#dc3545', 
                color: 'white', 
                fontSize: '0.9rem', 
                padding: '0.5rem 1rem', 
                border: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            Yes, Delete My Account
          </button>
        </div>
      </div>
    </div>
  )
}
