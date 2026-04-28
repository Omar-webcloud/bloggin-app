export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mt-8 mb-6 h-9 w-20 bg-muted animate-pulse rounded-lg"></div>
      <div className="bg-card border border-border rounded-lg shadow-sm p-8 mt-6">
        <div className="h-10 w-3/4 bg-muted animate-pulse rounded mb-4"></div>
        <div className="h-4 w-1/3 bg-muted animate-pulse rounded mb-6"></div>
        
        <div className="space-y-4">
          <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-5/6 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-4/6 bg-muted animate-pulse rounded"></div>
        </div>
      </div>
    </main>
  )
}
