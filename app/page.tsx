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
    <main className="min-h-screen max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          LET&apos;S CONNECTION
        </h1>
        <p className="text-neutral-400 text-lg">Build energy. Move together.</p>
      </div>

      <div className="flex gap-2 mb-6">
        {(Object.entries(GALLERIES) as [GallerySlug, (typeof GALLERIES)[GallerySlug]][]).map(
          ([slug, gallery]) => (
            <button
              key={slug}
              onClick={() => setActiveTab(slug)}
              className={`flex-1 px-4 py-3 rounded-lg border transition ${
                activeTab === slug
                  ? "border-neutral-500 bg-neutral-800 text-neutral-100"
                  : "border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300"
              }`}
            >
              {gallery.title}
            </button>
          )
        )}
      </div>

      <Link
        href={`/gallery/${activeTab}/write`}
        className="block w-full mb-8 px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-lg hover:bg-neutral-700 text-center transition"
      >
        Write Post
      </Link>

      <p className="text-neutral-500 text-sm mb-4">{GALLERIES[activeTab].header}</p>
      <PostList gallery={activeTab} />
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen max-w-2xl mx-auto px-6 py-12 flex items-center justify-center">
        <p className="text-neutral-500">Loading...</p>
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}
