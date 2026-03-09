"use client";

import Link from "next/link";
import { GALLERIES } from "@/lib/galleries";
import { PostList } from "@/app/components/PostList";

export default function HomePage() {
  const gallery = GALLERIES.debate;

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-6 py-8">
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="text-base font-medium" style={{ color: "#f5f5f5" }}>
          LET&apos;S CONNECTION
        </Link>
        <Link
          href={`/gallery/${gallery.slug}/write`}
          className="text-sm hover:underline"
          style={{ color: "#9ca3af" }}
        >
          Write Post
        </Link>
      </header>

      <nav className="flex justify-center mb-4">
        <span
          className="font-semibold text-base pb-1"
          style={{
            color: "#f5f5f5",
            borderBottom: "2px solid #f5f5f5",
          }}
        >
          {gallery.title}
        </span>
      </nav>

      <div
        className="h-px w-full mb-6"
        style={{ backgroundColor: "#1f2937" }}
      />

      <PostList gallery={gallery.slug} />
    </main>
  );
}
