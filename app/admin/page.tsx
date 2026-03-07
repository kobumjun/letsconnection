"use client";

import { useEffect, useState } from "react";

type Post = {
  id: string;
  gallery: string;
  title: string;
  content: string;
  nickname: string;
  created_at: string;
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/admin/verify")
      .then((r) => r.json())
      .then((data) => setIsLoggedIn(data.isAdmin));
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/admin/posts")
      .then((r) => {
        if (r.status === 401) {
          setIsLoggedIn(false);
          return [];
        }
        return r.json();
      })
      .then(setPosts);
  }, [isLoggedIn]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    setIsLoggedIn(true);
    setUsername("");
    setPassword("");
    fetch("/api/admin/posts").then((r) => r.json()).then(setPosts);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsLoggedIn(false);
    setPosts([]);
  }

  async function handleDeletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (!res.ok) {
      if (res.status === 401) {
        setIsLoggedIn(false);
        return;
      }
      alert("Delete failed");
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  if (isLoggedIn === null) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500">Loading...</p>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-xs space-y-4 p-6 border border-neutral-800 rounded-lg"
        >
          <h1 className="text-xl font-medium">Admin Login</h1>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded focus:outline-none focus:border-neutral-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded focus:outline-none focus:border-neutral-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-600 rounded hover:bg-neutral-700"
          >
            Login
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-neutral-500 hover:text-neutral-300"
        >
          Logout
        </button>
      </div>
      <p className="text-neutral-500 text-sm mb-6">
        All posts from all galleries. Admin can delete any post.
      </p>
      {posts.length === 0 ? (
        <p className="text-neutral-500">No posts.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="p-4 border border-neutral-800 rounded-lg flex justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-500 mb-1">
                  [{post.gallery}] · {post.nickname} · {new Date(post.created_at).toLocaleString()}
                </p>
                <h2 className="font-medium truncate">{post.title}</h2>
                <p className="text-neutral-500 text-sm mt-1 line-clamp-2">{post.content}</p>
              </div>
              <button
                onClick={() => handleDeletePost(post.id)}
                className="flex-shrink-0 text-sm text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
