"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TurnstileWidget } from "@/app/components/TurnstileWidget";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function WritePostForm({ gallery }: { gallery: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("hustler");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!content.trim()) {
      setError("Content is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (!turnstileToken) {
      setError("Please complete the verification");
      return;
    }
    if (imageFile && imageFile.size > MAX_IMAGE_SIZE) {
      setError("Image must be under 5MB");
      return;
    }

    setLoading(true);
    let imageUrl: string | null = null;

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          const data = await uploadRes.json();
          throw new Error(data.error || "Upload failed");
        }
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.imageUrl;
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gallery: "debate",
          title: title.trim(),
          content: content.trim(),
          nickname: nickname.trim() || "hustler",
          password,
          image_url: imageUrl,
          turnstileToken,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create post");
      }

      const post = await res.json();
      router.push(`/gallery/debate/post/${post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="text-red-400 text-sm p-3 bg-red-950/50 rounded">{error}</p>
      )}
      <div>
        <label className="block text-sm text-neutral-400 mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded focus:outline-none focus:border-neutral-500"
          placeholder="Post title"
          maxLength={200}
        />
      </div>
      <div>
        <label className="block text-sm text-neutral-400 mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded focus:outline-none focus:border-neutral-500 min-h-[150px]"
          placeholder="Write your post..."
        />
      </div>
      <div>
        <label className="block text-sm text-neutral-400 mb-2">Nickname</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded focus:outline-none focus:border-neutral-500"
          placeholder="hustler"
          maxLength={50}
        />
        <p className="text-neutral-500 text-xs mt-1">Default: hustler</p>
      </div>
      <div>
        <label className="block text-sm text-neutral-400 mb-2">
          Password (for delete)
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded focus:outline-none focus:border-neutral-500"
          placeholder="Numeric or admin password"
          maxLength={20}
          required
        />
      </div>
      <div>
        <label className="block text-sm text-neutral-400 mb-2">
          Image (optional, max 5MB)
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-neutral-800 file:text-neutral-200"
        />
      </div>
      <div className="py-2">
        <TurnstileWidget
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken(null)}
          resetTrigger={turnstileReset}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded hover:bg-neutral-700 disabled:opacity-50 transition"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
