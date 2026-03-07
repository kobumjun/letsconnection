import { redirect } from "next/navigation";
import { GALLERIES, type GallerySlug } from "@/lib/galleries";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug in GALLERIES) {
    redirect(`/?tab=${slug}`);
  }
  redirect("/");
}
