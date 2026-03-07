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

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
}

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

  if (loading) return <p style={{ color: "#9ca3af" }}>Loading...</p>;
  if (posts.length === 0) return <p style={{ color: "#9ca3af" }}>No posts yet. Be the first.</p>;

  return (
    <ul>
      {posts.map((post, index) => (
        <li key={post.id}>
          <Link
            href={`/gallery/${gallery}/post/${post.id}`}
            className="block py-4 hover:opacity-90 transition-opacity"
          >
            <h2 className="text-lg font-medium mb-1" style={{ color: "#f5f5f5" }}>
              {post.title}
            </h2>
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              {post.nickname} • {formatRelativeTime(post.created_at)} •{" "}
              {post.comment_count ?? 0} comments • {post.like_count ?? 0} likes
            </p>
          </Link>
          {index < posts.length - 1 && (
            <div className="h-px w-full" style={{ backgroundColor: "#1f2937" }} />
          )}
        </li>
      ))}
    </ul>
  );
}
