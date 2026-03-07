"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { GALLERIES, type GallerySlug } from "@/lib/galleries";
import { PostList } from "@/app/components/PostList";

const VALID_TABS: GallerySlug[] = ["execution", "achievement", "philosophy"];

function HomeContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: GallerySlug = VALID_TABS.includes(tabParam as GallerySlug)
    ? (tabParam as GallerySlug)
    : "execution";
  const [activeTab, setActiveTab] = useState<GallerySlug>(initialTab);

  useEffect(() => {
    if (VALID_TABS.includes(tabParam as GallerySlug)) {
      setActiveTab(tabParam as GallerySlug);
    }
  }, [tabParam]);

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-6 py-8">
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="text-base font-medium" style={{ color: "#f5f5f5" }}>
          LET&apos;S CONNECTION
        </Link>
        <Link
          href={`/gallery/${activeTab}/write`}
          className="text-sm hover:underline"
          style={{ color: "#9ca3af" }}
        >
          Write Post
        </Link>
      </header>

      <nav className="flex justify-center gap-6 mb-4">
        {(Object.entries(GALLERIES) as [GallerySlug, (typeof GALLERIES)[GallerySlug]][]).map(
          ([slug, gallery]) => (
            <button
              key={slug}
              onClick={() => setActiveTab(slug)}
              className="font-semibold text-base pb-1 transition"
              style={{
                color: "#f5f5f5",
                borderBottom: activeTab === slug ? "2px solid #f5f5f5" : "2px solid transparent",
              }}
            >
              {gallery.title}
            </button>
          )
        )}
      </nav>

      <div
        className="h-px w-full mb-6"
        style={{ backgroundColor: "#1f2937" }}
      />

      <PostList gallery={activeTab} />
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen max-w-2xl mx-auto px-6 py-12 flex items-center justify-center">
          <p style={{ color: "#9ca3af" }}>Loading...</p>
        </main>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
