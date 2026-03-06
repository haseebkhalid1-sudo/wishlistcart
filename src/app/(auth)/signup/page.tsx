import type { Metadata } from 'next'
import Link from 'next/link'
import { SignupForm } from './signup-form'

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create your free WishlistCart account',
}

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="font-serif text-display-md text-foreground">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Free forever. No credit card required.
        </p>
      </div>

      <SignupForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        By creating an account you agree to our terms and privacy policy.
      </p>
    </div>
  )
}
