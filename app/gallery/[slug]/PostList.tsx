"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: string;
  gallery: string;
  title: string;
  content: string;
  nickname: string;
  image_url: string | null;
  created_at: string;
};

export function PostList({ gallery }: { gallery: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts?gallery=${gallery}`)
      .then((r) => r.json())
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [gallery]);

  if (loading) return <p className="text-neutral-500">Loading...</p>;
  if (posts.length === 0) return <p className="text-neutral-500">No posts yet. Be the first.</p>;

  return (
    <ul className="space-y-4">
      {posts.map((post) => (
        <li key={post.id}>
          <Link
            href={`/gallery/${gallery}/post/${post.id}`}
            className="block p-4 border border-neutral-800 rounded-lg hover:border-neutral-600 transition"
          >
            <h2 className="font-medium">{post.title}</h2>
            <p className="text-neutral-500 text-sm mt-1">
              {post.nickname} · {new Date(post.created_at).toLocaleDateString()}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
