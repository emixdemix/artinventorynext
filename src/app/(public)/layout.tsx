'use client'

import { LayoutAnonim } from '@/components/layout'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <LayoutAnonim>{children}</LayoutAnonim>
}
