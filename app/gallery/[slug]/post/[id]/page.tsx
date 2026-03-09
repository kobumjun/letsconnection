import Link from "next/link";
import { PostDetail } from "./PostDetail";

const VALID_SLUGS = ["debate", "execution", "achievement", "philosophy"];

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  if (!VALID_SLUGS.includes(slug)) {
    return null;
  }

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-6 py-12">
      <Link href="/" className="text-neutral-500 hover:text-neutral-300 text-sm mb-8 block">
        ← board
      </Link>
      <PostDetail gallerySlug="debate" postId={id} />
    </main>
  );
}
