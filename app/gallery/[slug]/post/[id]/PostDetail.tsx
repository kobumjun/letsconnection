"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Post = {
  id: string;
  gallery: string;
  title: string;
  content: string;
  nickname: string;
  image_url: string | null;
  created_at: string;
};

export function PostDetail({
  gallerySlug,
  postId,
}: {
  gallerySlug: string;
  postId: string;
}) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteMode, setDeleteMode] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/posts?id=${postId}`)
      .then((r) => {
        if (r.status === 404) throw new Error("Not found");
        return r.json();
      })
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [postId]);

  async function handleDelete() {
    if (!password) {
      setError("Enter password to delete");
      return;
    }
    const res = await fetch(`/api/posts/${postId}?password=${password}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Delete failed");
      return;
    }
    router.push(`/gallery/${gallerySlug}`);
    router.refresh();
  }

  if (loading) return <p className="text-neutral-500">Loading...</p>;
  if (!post) return <p className="text-neutral-500">Post not found.</p>;

  return (
    <article className="border border-neutral-800 rounded-lg p-6">
      <h1 className="text-2xl font-medium mb-2">{post.title}</h1>
      <p className="text-neutral-500 text-sm mb-4">
        {post.nickname} · {new Date(post.created_at).toLocaleString()}
      </p>
      <div className="prose prose-invert max-w-none mb-6 whitespace-pre-wrap">
        {post.content}
      </div>
      {post.image_url && (
        <div className="mb-6 rounded overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image_url}
            alt=""
            className="max-w-full h-auto max-h-96 object-contain"
          />
        </div>
      )}
      <div className="pt-4 border-t border-neutral-800">
        {!deleteMode ? (
          <button
            onClick={() => setDeleteMode(true)}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Delete post
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-neutral-400">Enter your numeric password to delete:</p>
            <input
              type="password"
              inputMode="numeric"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-sm w-40"
              placeholder="Password"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleDelete}
                className="px-3 py-1 text-sm bg-red-900/50 text-red-400 rounded hover:bg-red-900/70"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => {
                  setDeleteMode(false);
                  setPassword("");
                  setError("");
                }}
                className="px-3 py-1 text-sm text-neutral-400 hover:text-neutral-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
