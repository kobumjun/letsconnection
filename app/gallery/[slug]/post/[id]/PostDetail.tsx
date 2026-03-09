"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LIKED_KEY = "hustler_liked_posts";

function getLikedPosts(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LIKED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addLikedPost(postId: string) {
  const set = new Set(getLikedPosts());
  set.add(postId);
  localStorage.setItem(LIKED_KEY, JSON.stringify(Array.from(set)));
}

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
  is_admin?: boolean;
};

type Comment = {
  id: string;
  post_id: string;
  nickname: string;
  content: string;
  created_at: string;
  is_admin?: boolean;
};

function AuthorWithBadge({
  nickname,
  isAdmin,
}: {
  nickname: string;
  isAdmin?: boolean;
}) {
  return (
    <span>
      {nickname}
      {isAdmin && (
        <span className="ml-1 text-[10px] text-neutral-400" title="verified">
          ✓
        </span>
      )}
    </span>
  );
}

export function PostDetail({
  gallerySlug,
  postId,
}: {
  gallerySlug: string;
  postId: string;
}) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteMode, setDeleteMode] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    setLiked(getLikedPosts().includes(postId));
  }, [postId]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/posts?id=${postId}`).then((r) => {
        if (r.status === 404) throw new Error("Not found");
        return r.json();
      }),
      fetch(`/api/posts/${postId}/comments`)
        .then((r) => (r.ok ? r.json() : []))
        .then((data) => (Array.isArray(data) ? data : [])),
    ])
      .then(([p, c]) => {
        setPost(p);
        setComments(c);
        setLikeCount(p?.like_count ?? 0);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [postId]);

  async function handleLike() {
    if (liked || liking) return;
    setLiking(true);
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setLikeCount(data.like_count ?? likeCount + 1);
      addLikedPost(postId);
      setLiked(true);
    }
    setLiking(false);
  }

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
    router.push("/");
    router.refresh();
  }

  function onCommentAdded(comment: Comment) {
    setComments((prev) => [...prev, comment]);
  }

  function onCommentDeleted(commentId: string) {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }

  if (loading) return <p className="text-neutral-500">Loading...</p>;
  if (!post) return <p className="text-neutral-500">Post not found.</p>;

  return (
    <article className="border border-neutral-800 rounded-lg p-6">
      <h1 className="text-2xl font-medium mb-2">{post.title}</h1>
      <p className="text-neutral-500 text-sm mb-4">
        <AuthorWithBadge nickname={post.nickname} isAdmin={post.is_admin} />
        {" · "}
        {new Date(post.created_at).toLocaleString()}
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

      <div className="flex items-center gap-4 py-4 border-t border-neutral-800">
        <button
          onClick={handleLike}
          disabled={liked || liking}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition ${
            liked
              ? "text-red-400 cursor-default"
              : "text-neutral-400 hover:text-red-400 hover:bg-neutral-800/50"
          }`}
        >
          {liked ? "♥ Liked" : "♥ Like"} · {likeCount}
        </button>
      </div>

      <div className="pt-6 border-t border-neutral-800">
        <CommentForm postId={postId} onAdded={onCommentAdded} />
        <CommentList comments={comments} onDeleted={onCommentDeleted} />
      </div>

      <div className="pt-6 mt-6 border-t border-neutral-800">
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

function CommentForm({
  postId,
  onAdded,
}: {
  postId: string;
  onAdded: (c: Comment) => void;
}) {
  const [nickname, setNickname] = useState("hustler");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!content.trim()) {
      setError("Content is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_id: postId,
        content: content.trim(),
        nickname: nickname.trim() || "hustler",
        password,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to add comment");
      setLoading(false);
      return;
    }
    onAdded(data);
    setContent("");
    setPassword("");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3">
      <h3 className="text-sm font-medium text-neutral-400">Add comment</h3>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Your comment..."
        className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded text-sm resize-none"
        rows={3}
      />
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="hustler"
          className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-sm w-32"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (for delete)"
          className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded text-sm w-36"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm hover:bg-neutral-700 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}

function CommentList({
  comments,
  onDeleted,
}: {
  comments: Comment[];
  onDeleted: (id: string) => void;
}) {
  if (!Array.isArray(comments) || comments.length === 0) {
    return (
      <p className="text-neutral-500 text-sm py-4">No comments yet.</p>
    );
  }

  const sortedComments = [...comments].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <ul className="space-y-4">
      {sortedComments.map((c) => (
        <CommentItem key={c.id} comment={c} onDeleted={onDeleted} />
      ))}
    </ul>
  );
}

function CommentItem({
  comment,
  onDeleted,
}: {
  comment: Comment;
  onDeleted: (id: string) => void;
}) {
  const [deleteMode, setDeleteMode] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!password) {
      setError("Enter password");
      return;
    }
    const res = await fetch(`/api/comments/${comment.id}?password=${password}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Delete failed");
      return;
    }
    onDeleted(comment.id);
  }

  return (
    <li className="py-3 border-b border-neutral-800/50 last:border-0">
      <p className="text-neutral-500 text-xs mb-1">
        <AuthorWithBadge nickname={comment.nickname} isAdmin={comment.is_admin} />
        {" · "}
        {new Date(comment.created_at).toLocaleString()}
      </p>
      <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
      {!deleteMode ? (
        <button
          onClick={() => setDeleteMode(true)}
          className="text-xs text-red-400 hover:text-red-300 mt-2"
        >
          Delete
        </button>
      ) : (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="password"
            inputMode="numeric"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value.replace(/\D/g, ""));
              setError("");
            }}
            placeholder="Password"
            className="px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-xs w-24"
          />
          <button
            onClick={handleDelete}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              setDeleteMode(false);
              setPassword("");
              setError("");
            }}
            className="text-xs text-neutral-500"
          >
            Cancel
          </button>
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
      )}
    </li>
  );
}
