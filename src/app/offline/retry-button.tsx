'use client'

export function RetryButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="inline-flex items-center justify-center px-6 py-3 bg-[#0F0F0F] text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
    >
      Try again
    </button>
  )
}
