import Link from "next/link";
import { GALLERIES } from "@/lib/galleries";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          LET&apos;S CONNECTION
        </h1>
        <p className="text-neutral-400 text-lg mb-16">
          Build energy. Move together.
        </p>
        <nav className="flex flex-col gap-4">
          {Object.values(GALLERIES).map((gallery) => (
            <Link
              key={gallery.slug}
              href={`/gallery/${gallery.slug}`}
              className="block px-6 py-4 border border-neutral-700 rounded-lg hover:border-neutral-500 hover:bg-neutral-900/50 transition"
            >
              {gallery.title}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
