import { redirect } from "next/navigation";

const VALID_SLUGS = ["debate", "execution", "achievement", "philosophy"];

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (VALID_SLUGS.includes(slug)) {
    redirect("/");
  }
  redirect("/");
}
