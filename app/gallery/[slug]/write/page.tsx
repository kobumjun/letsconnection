import { notFound } from "next/navigation";
import Link from "next/link";
import { GALLERIES, type GallerySlug } from "@/lib/galleries";
import { WritePostForm } from "./WritePostForm";

export default async function WritePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gallery = GALLERIES[slug as GallerySlug];

  if (!gallery) notFound();

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-6 py-12">
      <Link
        href={`/?tab=${slug}`}
        className="text-neutral-500 hover:text-neutral-300 text-sm mb-8 block"
      >
        ← {gallery.title}
      </Link>
      <h1 className="text-2xl font-medium mb-8">Write Post</h1>
      <WritePostForm gallery={slug} />
    </main>
  );
}
