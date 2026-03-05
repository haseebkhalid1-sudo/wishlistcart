import { getNetworkForDomain, AFFILIATE_NETWORKS } from './networks'

export function getNetworkName(url: string): string {
  try {
    const parsed = new URL(url)
    return getNetworkForDomain(parsed.hostname)?.name ?? 'unknown'
  } catch {
    return 'unknown'
  }
}

const AFFILIATE_TAGS: Record<string, string> = {
  amazon: process.env.AFFILIATE_TAG_AMAZON ?? '',
  walmart: process.env.AFFILIATE_TAG_WALMART ?? '',
  target: process.env.AFFILIATE_TAG_TARGET ?? '',
  bestbuy: process.env.AFFILIATE_TAG_BESTBUY ?? '',
}

/**
 * Builds an affiliate URL for supported networks.
 * Returns the original URL unchanged if the store is unsupported or tag not configured.
 */
export function buildAffiliateUrl(originalUrl: string): string {
  try {
    const url = new URL(originalUrl)
    const network = getNetworkForDomain(url.hostname)
    if (!network) return originalUrl

    const tag = AFFILIATE_TAGS[network.name]
    if (!tag) return originalUrl

    return network.buildUrl(originalUrl, tag) ?? originalUrl
  } catch {
    return originalUrl
  }
}

/**
 * Returns true if the URL belongs to a supported affiliate network with a configured tag.
 */
export function isAffiliateable(url: string): boolean {
  try {
    const parsed = new URL(url)
    const network = getNetworkForDomain(parsed.hostname)
    if (!network) return false
    return !!(AFFILIATE_TAGS[network.name])
  } catch {
    return false
  }
}
