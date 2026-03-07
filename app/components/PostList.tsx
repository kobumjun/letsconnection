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
  like_count: number;
  comment_count: number;
};

export function PostList({ gallery }: { gallery: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
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
            <div className="flex gap-4">
              {post.image_url && (
                <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden bg-neutral-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="font-medium truncate">{post.title}</h2>
                <p className="text-neutral-500 text-sm mt-1">
                  {post.nickname} · {new Date(post.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-4 mt-2 text-neutral-500 text-sm">
                  <span>♥ {post.like_count ?? 0}</span>
                  <span>💬 {post.comment_count ?? 0}</span>
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
