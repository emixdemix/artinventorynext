'use client'

import { useEffect, useState } from 'react'
import { QRCode } from 'react-qrcode-logo'

const fetchQrPayload = async (): Promise<string | null> => {
  const session = localStorage.getItem('session')
  if (!session) return null

  const res = await fetch('/api/security/qr', {
    method: 'POST',
    headers: { 'X-Token': session },
  })
  if (!res.ok) return null
  const json = (await res.json()) as { qr?: string }
  return json.qr ?? null
}

export const SecurityTab = () => {
  const [qr, setQr] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setError(null)
    setLoading(true)
    setQr(null)
    try {
      const payload = await fetchQrPayload()
      if (!payload) {
        setError('Could not generate the code. Please sign in again.')
        return
      }
      setQr(payload)
    } catch (e) {
      setError('Could not generate the code.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="security">
      <header style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Connect a mobile device</h2>
        <p style={{ margin: 0, color: '#555' }}>
          Use this QR code to link the Artinventory mobile app to your account
          without typing in your email and a one-time code.
        </p>
      </header>

      <ol style={{ paddingLeft: 20, marginBottom: 24, lineHeight: 1.6 }}>
        <li>Open the Artinventory mobile app on your phone.</li>
        <li>
          From the sign-in screen, tap <strong>Scan QR</strong>.
        </li>
        <li>Point your phone&rsquo;s camera at the code below.</li>
      </ol>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          padding: 24,
          border: '1px solid #e5e5e5',
          borderRadius: 12,
          background: '#fafafa',
          minHeight: 320,
          justifyContent: 'center',
        }}
      >
        {loading ? <p style={{ margin: 0 }}>Generating&hellip;</p> : null}

        {error ? (
          <p style={{ margin: 0, color: '#c0392b' }}>{error}</p>
        ) : null}

        {qr && !loading ? (
          <>
            <QRCode
              value={qr}
              size={300}
              qrStyle="squares"
              ecLevel="M"
              quietZone={8}
            />
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: '#666',
                textAlign: 'center',
                maxWidth: 360,
              }}
            >
              The code expires with your current session. Anyone who scans it
              will be signed in as you, so don&rsquo;t share it.
            </p>
          </>
        ) : null}
      </div>

      <div className="buttonblock" style={{ marginTop: 24 }}>
        <button
          className="primaryButton"
          onClick={() => void generate()}
          disabled={loading}
        >
          Regenerate code
        </button>
      </div>
    </section>
  )
}
