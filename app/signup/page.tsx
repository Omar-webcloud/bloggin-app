
"use client"

import { useState } from "react"
import { auth, db } from "../../lib/firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    try {
      // Check if username exists
      const usernameDoc = await getDoc(doc(db, "usernames", username))
      if (usernameDoc.exists()) {
        setError("Username is already taken. Please choose another one.")
        return
      }

      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update profile
      await updateProfile(user, {
        displayName: username
      })

      // Reserve username
      await setDoc(doc(db, "usernames", username), {
        uid: user.uid
      })

      router.push("/")
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <main className="container">
      <div className="signup-container">
        <h1>Sign Up</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username (Unique)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ textDecoration: "none" }}>
            Log in
          </Link>
        </div>
      </div>
    </main>
  )
}
