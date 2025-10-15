"use client"

import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function Logout() {
  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error("Error signing out:", err)
    }
  }

  return (
    <Button onClick={handleLogout} variant="outline" className="border-border bg-transparent">
      <LogOut className="w-4 h-4 mr-2" />
      Sign out
    </Button>
  )
}
