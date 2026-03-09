export const GALLERIES = {
  debate: {
    slug: "debate",
    title: "Debate",
    header: "think. discuss. decide.",
  },
} as const;

export type GallerySlug = keyof typeof GALLERIES;
