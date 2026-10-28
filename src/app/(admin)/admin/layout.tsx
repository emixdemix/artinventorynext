'use client'

import { Header } from '@/components/header'
import { Waiting } from '@/components/waiting'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <Waiting />
    </>
  )
}
