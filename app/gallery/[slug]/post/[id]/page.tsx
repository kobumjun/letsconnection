import { notFound } from "next/navigation";
import Link from "next/link";
import { GALLERIES, type GallerySlug } from "@/lib/galleries";
import { PostDetail } from "./PostDetail";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const gallery = GALLERIES[slug as GallerySlug];

  if (!gallery) notFound();

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-6 py-12">
      <Link href="/" className="text-neutral-500 hover:text-neutral-300 text-sm mb-8 block">
        ← board
      </Link>
      <PostDetail gallerySlug={slug} postId={id} />
    </main>
  );
}
