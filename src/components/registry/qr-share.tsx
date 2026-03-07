'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Download } from 'lucide-react'

interface QrShareProps {
  url: string
  size?: number
}

export function QrShare({ url, size = 200 }: QrShareProps) {
  const downloadUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}`

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        style={{ padding: 16, background: '#ffffff', borderRadius: 8, display: 'inline-block' }}
      >
        <QRCodeSVG value={url} size={size} />
      </div>
      <p className="text-xs text-muted-foreground text-center">Scan to open registry</p>
      <a
        href={downloadUrl}
        download="qr-registry.png"
        className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors inline-flex items-center gap-1"
      >
        <Download className="h-3 w-3" />
        Download QR code
      </a>
    </div>
  )
}
