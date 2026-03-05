import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your WishlistCart account',
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; message?: string }>
}) {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="font-serif text-display-md text-foreground">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign up free
        </Link>
      </p>
    </div>
  )
}
