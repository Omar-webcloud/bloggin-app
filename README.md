# Bloggin

A full-stack blogging platform built with Next.js, Firebase, and TypeScript. Users can create accounts, write Markdown-formatted posts, and share their work publicly. The platform supports real-time Firestore reads, server-side rendering for SEO-critical pages, and a responsive dark/light theme system with localStorage persistence.

**Live Demo:** [https://bloggin-app-six.vercel.app](https://bloggin-app-six.vercel.app)

---

## What This Project Demonstrates

Bloggin was built to put several modern web development patterns together in one coherent product. The architecture makes deliberate choices about which pages render on the server and which render on the client, why username uniqueness is enforced at the database layer rather than just the application layer, and how to structure Firebase security rules so that enforcement lives closest to the data rather than relying solely on UI-level guards.

If you are evaluating this codebase, the most technically interesting areas are the hybrid rendering strategy (described below), the Firestore security rules, the custom Markdown toolbar's cursor-aware text insertion, the cascading account deletion flow, and the dark mode implementation that respects system preferences while allowing user override.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript 5, strict mode |
| UI Library | React 19 |
| Styling | Tailwind CSS 3, shadcn/ui (New York style), Radix UI primitives |
| Typography | @tailwindcss/typography, Geist font |
| Animations | Framer Motion |
| Icons | Lucide React |
| Authentication | Firebase Authentication (email/password) |
| Database | Cloud Firestore |
| Storage | Firebase Storage (initialized, not yet used for uploads) |
| Analytics | Firebase Analytics, Vercel Analytics |
| Package Manager | pnpm 10 |
| Deployment | Vercel |
| Dev Environment | Google Project IDX (Nix, Node.js 20) |

---

## Application Architecture

### Rendering Strategy

Bloggin deliberately mixes Next.js rendering modes based on what each page actually needs.

The post detail page (`/post/[id]`) is a **Server Component**. It reads from Firestore on the server, generates per-post `<title>` and `<meta description>` tags via `generateMetadata`, and delivers fully rendered HTML to the client. This matters for SEO: search engine crawlers index the post content without needing to execute JavaScript.

Every other page (home feed, create, edit, login, signup, my posts) is a **Client Component**. These pages depend on real-time auth state, user-specific data fetching, and interactive UI patterns like search, pagination, and modal dialogs, making client-side rendering the right default.

Page transitions use a `template.tsx` layout wrapper with a Framer Motion fade-and-rise animation (opacity 0 to 1, y 20 to 0), scoped to avoid interfering with the persistent Navbar.

### Component Structure

```
app/
  layout.tsx             Root layout, Navbar, Inter font
  template.tsx           Framer Motion page transition wrapper
  page.tsx               Home feed (BlogList + footer with modals)
  login/page.tsx         Email/password login
  signup/page.tsx        Registration with username uniqueness check
  create-post/page.tsx   Auth-gated post creation with Markdown toolbar
  edit-post/[id]/        Auth-gated, owner-only post editing
  post/[id]/             Server-rendered post detail with SSR metadata
  my-posts/page.tsx      User dashboard: posts, username edit, account deletion
  posts/page.tsx         Secondary feed route using BlogList
  not-found.tsx          Custom 404 page

components/
  Navbar.tsx             Fixed nav with auth state, dark mode toggle
  BlogList.tsx           Feed with search, pagination, owner actions
  MarkdownToolbar.tsx    Selection-aware Markdown insertion toolbar
  ShareModal.tsx         Copy link and copy iframe embed code
  ConfirmationModal.tsx  Reusable confirmation dialog (logout, delete)
  DeleteAccountModal.tsx Dedicated account deletion confirmation
  HelpModal.tsx          Usage guide modal
  TermsModal.tsx         Terms and conditions modal
  BackButton.tsx         Browser history back navigation
  ui/                    Full shadcn/ui component library

hooks/
  useAuth.ts             Firebase onAuthStateChanged subscriber

lib/
  firebase.js            Firebase app initialization and exports
  utils.ts               Tailwind className utility (clsx + twMerge)
```

---

## Data Model

Firestore contains two top-level collections.

**posts**

| Field | Type | Notes |
|---|---|---|
| title | string | Post title, also used for Firestore prefix-range search queries |
| description | string | Markdown body content |
| userId | string | Firebase Auth UID of the post author |
| username | string | Display name at time of publish, denormalized for read performance |
| createdAt | Timestamp | Server timestamp set on create, used for `orderBy desc` |

**usernames**

| Field | Type | Notes |
|---|---|---|
| (document ID) | string | The username itself serves as the document ID |
| uid | string | Firebase Auth UID that owns this username |

The `usernames` collection acts as a reservation index. Before creating an account or updating a display name, the application does a `getDoc` on `usernames/{requestedUsername}`. If the document exists, the name is taken. If not, it `setDoc`s the reservation atomically before completing the profile update. When a username changes, the old reservation document is deleted and a new one is written.

---

## Authentication and Authorization

Firebase Authentication handles credential management. The `useAuth` hook subscribes to `onAuthStateChanged` and exposes `{ user, loading }` to any component that needs auth state. All protected pages check `loading` before redirecting to avoid a flash of redirect on initial mount.

The Firestore security rules enforce ownership at the database layer, not just in the UI:

```
posts/{postId}
  read:   public
  create: authenticated users
  update: authenticated AND request.auth.uid == resource.data.userId
  delete: authenticated AND request.auth.uid == resource.data.userId

usernames/{username}
  read:   public
  write:  authenticated users
```

This means that even if someone bypassed the application layer and made direct Firestore API calls, they could not modify or delete another user's posts. Edit pages also perform a server-side ownership check before loading post data: the page fetches the post, compares `post.userId` to `user.uid`, and surfaces an error if they do not match rather than rendering the edit form.

---

## Key Features

**Markdown Authoring**

The `MarkdownToolbar` component wraps a `<textarea>` and performs cursor-aware text insertion. It reads `selectionStart` and `selectionEnd` from the textarea ref. If the user has text selected, the toolbar wraps the selection in the appropriate Markdown syntax (for example, `**selected text**` for bold). If the cursor is placed without a selection, the toolbar inserts the syntax markers and positions the cursor between them. Post content is rendered with `react-markdown` and `remark-gfm`, which adds GitHub Flavored Markdown support including tables, strikethrough, and task lists. The `@tailwindcss/typography` plugin styles the rendered prose.

**Post Feed**

The home feed fetches all posts from Firestore ordered by `createdAt` descending. When a search term is present, the query switches to a Firestore prefix-range filter (`title >= search`, `title <= search + "\uf8ff"`) which approximates a starts-with search using Unicode's private use area as an upper bound. Pagination is client-side, with six posts per page.

**Dark Mode**

The Navbar initializes dark mode by checking `localStorage` for an explicit user preference, then falling back to `window.matchMedia("(prefers-color-scheme: dark)")`. The toggle writes to `localStorage` and adds or removes the `dark` class on `document.documentElement`. Tailwind's `darkMode: ["class"]` configuration picks this up. The two color palettes are defined as CSS custom properties in `globals.css` and consumed through Tailwind's extended theme configuration, so every component that uses `bg-background`, `text-foreground`, `bg-card`, and similar tokens responds automatically to the mode switch.

**Sharing**

Any post can be shared via a modal that presents both a direct URL and a pre-built `<iframe>` embed snippet with sensible default dimensions and box-shadow styling. Both options copy to the clipboard via the Clipboard API, with a visual confirmation state that resets after two seconds.

**Account Management**

The `/my-posts` dashboard lets users edit their display name with uniqueness checking, and delete their account entirely. The deletion flow is ordered to avoid partial state: it first batches and deletes all of the user's posts, then deletes the username reservation document, then calls Firebase Auth's `deleteUser` to remove the credential record, and finally redirects to the home page.

---

## Local Development

### Prerequisites

Node.js 18 or later and pnpm 10 are required. Install pnpm via `npm install -g pnpm` if it is not already available.

### Firebase Project

This repository contains a hardcoded Firebase configuration in `lib/firebase.js` pointing at the production project. For local development against your own Firebase project, replace the `firebaseConfig` object with the credentials from your Firebase console and deploy the Firestore rules from `firestore.rules`.

The Firestore indexes required for the ordered feed query (`orderBy("createdAt", "desc")`) are automatically created on first use in development. The prefix-range search query does not require a composite index.

### Installation

```bash
git clone https://github.com/your-username/bloggin.git
cd bloggin
pnpm install
pnpm dev
```

The development server starts at `http://localhost:3000`.

### Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start the production build locally |
| `pnpm lint` | Run ESLint via `next lint` |

---

## Deployment

The application is deployed on Vercel. Vercel automatically detects Next.js and applies the correct build configuration. The only setting needed is an environment variable for the Firebase project credentials if you move to an environment-variable pattern rather than the hardcoded config.

TypeScript build errors are currently suppressed via `ignoreBuildErrors: true` in `next.config.mjs`. This allows the project to deploy while type assertions are still being resolved, but it is worth removing for production use once any outstanding type issues are addressed.

---

## Notes for Reviewers

A few implementation decisions worth calling out explicitly:

The `username` field is denormalized onto every post document rather than being fetched by join. Firestore does not support joins, so this is the conventional approach. It means that if a user changes their display name, their historical posts will still show the name they had at the time of publishing. This is intentional behavior, consistent with how most publishing platforms handle author attribution.

The search implementation is a prefix-range Firestore query, not a full-text search. It matches posts whose titles start with the search string. A production system would replace this with a dedicated search service such as Algolia or Typesense. The current implementation is a deliberate scope decision that keeps the infrastructure simple while still providing useful search within the Firestore native query model.

Firebase Analytics is initialized conditionally with `typeof window !== 'undefined'` to prevent it from running during server-side rendering, where `window` is not available.

The `pnpm-workspace.yaml` is present but the workspace only contains a single package. It is included to keep the project compatible with monorepo expansion without requiring a configuration change later.
