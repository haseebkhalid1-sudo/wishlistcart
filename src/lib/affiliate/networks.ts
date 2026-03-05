export interface AffiliateNetwork {
  name: string
  domains: string[]
  buildUrl: (originalUrl: string, tag: string) => string | null
}

export const AFFILIATE_NETWORKS: AffiliateNetwork[] = [
  {
    name: 'amazon',
    domains: [
      'amazon.com', 'amazon.co.uk', 'amazon.ca', 'amazon.com.au',
      'amazon.de', 'amazon.fr', 'amazon.it', 'amazon.es', 'amazon.co.jp',
      'amazon.in', 'amazon.com.br', 'amazon.com.mx',
    ],
    buildUrl(originalUrl, tag) {
      try {
        const url = new URL(originalUrl)
        url.searchParams.set('tag', tag)
        // Remove existing affiliate tags
        url.searchParams.delete('linkCode')
        url.searchParams.delete('linkId')
        return url.toString()
      } catch {
        return null
      }
    },
  },
  {
    name: 'walmart',
    domains: ['walmart.com'],
    buildUrl(originalUrl, tag) {
      try {
        const url = new URL(originalUrl)
        url.searchParams.set('affiliateId', tag)
        return url.toString()
      } catch {
        return null
      }
    },
  },
  {
    name: 'target',
    domains: ['target.com'],
    buildUrl(originalUrl, tag) {
      try {
        const url = new URL(originalUrl)
        url.searchParams.set('afid', tag)
        return url.toString()
      } catch {
        return null
      }
    },
  },
  {
    name: 'bestbuy',
    domains: ['bestbuy.com'],
    buildUrl(originalUrl, tag) {
      try {
        const url = new URL(originalUrl)
        url.searchParams.set('ref', tag)
        return url.toString()
      } catch {
        return null
      }
    },
  },
]

export function getNetworkForDomain(hostname: string): AffiliateNetwork | null {
  const clean = hostname.replace(/^www\./, '')
  return AFFILIATE_NETWORKS.find((n) => n.domains.some((d) => clean === d || clean.endsWith(`.${d}`))) ?? null
}
