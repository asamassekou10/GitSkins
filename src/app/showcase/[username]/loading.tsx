/**
 * Loading skeleton for showcase pages
 * Provides better UX while content loads
 */

export default function ShowcaseLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-16 bg-gray-800/50 rounded-xl w-96 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-gray-800/30 rounded-lg w-64 mx-auto animate-pulse" />
        </div>

        {/* Theme Selector Skeleton */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 w-24 bg-gray-800/50 rounded-xl animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* Card Skeleton */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-800">
            <div className="aspect-[800/600] bg-gray-800/30 rounded-xl animate-pulse flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 w-32 bg-gray-800/50 rounded-xl animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
