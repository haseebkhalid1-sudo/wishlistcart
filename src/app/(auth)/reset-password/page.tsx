import type { Metadata } from 'next'
import Link from 'next/link'
import { ResetPasswordForm } from './reset-password-form'

export const metadata: Metadata = {
  title: 'Reset password',
  description: 'Reset your WishlistCart password',
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="font-serif text-display-md text-foreground">Reset your password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <ResetPasswordForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
