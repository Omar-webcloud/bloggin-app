"use client";

import { useState } from "react";
import { auth, db } from "../../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Check if username exists
      const usernameDoc = await getDoc(doc(db, "usernames", username));
      if (usernameDoc.exists()) {
        setError("Username is already taken. Please choose another one.");
        setLoading(false);
        return;
      }

      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile
      await updateProfile(user, {
        displayName: username,
      });

      // Reserve username
      await setDoc(doc(db, "usernames", username), {
        uid: user.uid,
      });

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 relative z-10">
      <div className="w-full max-w-md p-6 sm:p-8 bg-card border border-border rounded-2xl shadow-xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 rounded-2xl bg-sage-500/10 text-sage-600 dark:text-sage-300 mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create Your Account</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Join the community of everyday storytellers and thinkers
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="e.g. omar_writer"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-sage-500/40 focus:border-sage-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-sage-500/40 focus:border-sage-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-sage-500/40 focus:border-sage-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-sage-500/40 focus:border-sage-500 focus:outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-sage-600 hover:bg-sage-500 dark:bg-sage-300 dark:hover:bg-sage-200 text-white dark:text-slate-950 transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-sage-600 dark:text-sage-300 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
