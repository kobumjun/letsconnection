import { notFound } from "next/navigation";
import Link from "next/link";
import { GALLERIES, type GallerySlug } from "@/lib/galleries";
import { PostList } from "./PostList";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gallery = GALLERIES[slug as GallerySlug];

  if (!gallery) notFound();

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-6 py-12">
      <Link href="/" className="text-neutral-500 hover:text-neutral-300 text-sm mb-8 block">
        ← home
      </Link>
      <h1 className="text-2xl font-medium mb-2">{gallery.title}</h1>
      <p className="text-neutral-500 text-sm mb-8">{gallery.header}</p>
      <Link
        href={`/gallery/${slug}/write`}
        className="inline-block mb-8 px-4 py-2 bg-neutral-800 border border-neutral-600 rounded hover:bg-neutral-700 transition"
      >
        Write Post
      </Link>
      <PostList gallery={slug} />
    </main>
  );
}
