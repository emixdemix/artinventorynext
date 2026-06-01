import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="edit center">
      <h2>Not found</h2>
      <p>This list is no longer available, or the link is incorrect.</p>
      <p>
        <Link href="/">Go to artinventory.de</Link>
      </p>
    </section>
  )
}
