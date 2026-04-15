'use client'

import { Layout } from '@/components/layout'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Layout>{children}</Layout>
}
