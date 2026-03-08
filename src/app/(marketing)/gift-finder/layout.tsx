import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gift Finder — WishlistCart',
  description: 'Answer 5 questions and get AI-powered, personalized gift ideas instantly. Free tool.',
}

export default function GiftFinderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
