import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-medium mb-2">404</h1>
      <p className="text-neutral-500 mb-6">Page not found.</p>
      <Link href="/" className="text-neutral-400 hover:text-neutral-200">
        ← home
      </Link>
    </main>
  );
}
