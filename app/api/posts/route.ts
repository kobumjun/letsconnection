import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sanitize, isNumericPassword, checkAdminAuth } from "@/lib/utils";
import { verifyTurnstileToken } from "@/lib/turnstile";

async function getLikeCounts(postIds: string[]) {
  if (postIds.length === 0) return new Map<string, number>();
  const { data } = await supabase
    .from("post_likes")
    .select("post_id")
    .in("post_id", postIds);
  const counts = new Map<string, number>();
  for (const id of postIds) counts.set(id, 0);
  for (const row of data ?? []) {
    counts.set(row.post_id, (counts.get(row.post_id) ?? 0) + 1);
  }
  return counts;
}

async function getCommentCounts(postIds: string[]) {
  if (postIds.length === 0) return new Map<string, number>();
  const { data } = await supabase
    .from("comments")
    .select("post_id")
    .in("post_id", postIds);
  const counts = new Map<string, number>();
  for (const id of postIds) counts.set(id, 0);
  for (const row of data ?? []) {
    counts.set(row.post_id, (counts.get(row.post_id) ?? 0) + 1);
  }
  return counts;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gallery = searchParams.get("gallery");
  const id = searchParams.get("id");

  if (id) {
    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const [likeCounts, commentCounts] = await Promise.all([
      getLikeCounts([id]),
      getCommentCounts([id]),
    ]);

    return NextResponse.json({
      ...post,
      like_count: likeCounts.get(id) ?? 0,
      comment_count: commentCounts.get(id) ?? 0,
    });
  }

  if (!gallery || gallery !== "debate") {
    return NextResponse.json({ error: "Invalid gallery" }, { status: 400 });
  }

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .in("gallery", ["execution", "achievement", "philosophy", "debate"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }

  const list = posts ?? [];
  const postIds = list.map((p: { id: string }) => p.id);
  const [likeCounts, commentCounts] = await Promise.all([
    getLikeCounts(postIds),
    getCommentCounts(postIds),
  ]);

  const enriched = list.map((p: { id: string }) => ({
    ...p,
    like_count: likeCounts.get(p.id) ?? 0,
    comment_count: commentCounts.get(p.id) ?? 0,
  }));

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gallery, title, content, nickname = "hustler", password, image_url, turnstileToken } =
      body;

    if (!gallery || !title || !content || !password) {
      return NextResponse.json(
        { error: "Missing required fields: gallery, title, content, password" },
        { status: 400 }
      );
    }

    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Captcha verification failed" },
        { status: 400 }
      );
    }

    const captchaValid = await verifyTurnstileToken(turnstileToken);
    if (!captchaValid) {
      return NextResponse.json(
        { error: "Captcha verification failed" },
        { status: 400 }
      );
    }

    if (gallery !== "debate") {
      return NextResponse.json({ error: "Invalid gallery" }, { status: 400 });
    }

    const safeNickname = sanitize(nickname || "hustler");
    const adminCheck = checkAdminAuth(safeNickname, password);

    if (adminCheck.error) {
      return NextResponse.json({ error: adminCheck.error }, { status: 403 });
    }

    if (!adminCheck.isAdmin && !isNumericPassword(password)) {
      return NextResponse.json(
        { error: "Password must be numeric only" },
        { status: 400 }
      );
    }

    const safeTitle = sanitize(title);
    const safeContent = sanitize(content);

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        gallery: "debate",
        title: safeTitle,
        content: safeContent,
        nickname: safeNickname,
        password,
        image_url: image_url || null,
        is_admin: adminCheck.isAdmin,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }

    return NextResponse.json(post);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
