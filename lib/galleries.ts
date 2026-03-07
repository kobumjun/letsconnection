export const GALLERIES = {
  execution: {
    slug: "execution",
    title: "Execution Log",
    header: "too much talk. just move",
  },
  achievement: {
    slug: "achievement",
    title: "Achievement",
    header: "make it.",
  },
  philosophy: {
    slug: "philosophy",
    title: "Philosophy",
    header: "think hard",
  },
} as const;

export type GallerySlug = keyof typeof GALLERIES;
