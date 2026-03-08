// VAPID key helpers for Web Push
// Generate keys with: npx web-push generate-vapid-keys
// Then add to Vercel env vars:
//   NEXT_PUBLIC_VAPID_PUBLIC_KEY  (public key — safe to expose)
//   VAPID_PRIVATE_KEY             (private key — server only)
//   VAPID_EMAIL                   (e.g. mailto:support@wishlistcart.com)

export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

export function assertVapidEnv() {
  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
    throw new Error('Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY env var')
  }
  if (!process.env.VAPID_PRIVATE_KEY) {
    throw new Error('Missing VAPID_PRIVATE_KEY env var')
  }
  if (!process.env.VAPID_EMAIL) {
    throw new Error('Missing VAPID_EMAIL env var')
  }
}
