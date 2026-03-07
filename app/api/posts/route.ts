import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sanitize, isNumericPassword } from "@/lib/utils";
import { GALLERIES, type GallerySlug } from "@/lib/galleries";

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
    return NextResponse.json(post);
  }

  if (!gallery || !(gallery in GALLERIES)) {
    return NextResponse.json({ error: "Invalid gallery" }, { status: 400 });
  }

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("gallery", gallery)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }

  return NextResponse.json(posts ?? []);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gallery, title, content, nickname = "hustler", password, image_url } = body;

    if (!gallery || !title || !content || !password) {
      return NextResponse.json(
        { error: "Missing required fields: gallery, title, content, password" },
        { status: 400 }
      );
    }

    if (!(gallery in GALLERIES)) {
      return NextResponse.json({ error: "Invalid gallery" }, { status: 400 });
    }

    if (!isNumericPassword(password)) {
      return NextResponse.json(
        { error: "Password must be numeric only" },
        { status: 400 }
      );
    }

    const safeNickname = sanitize(nickname || "hustler");
    const safeTitle = sanitize(title);
    const safeContent = sanitize(content);

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        gallery,
        title: safeTitle,
        content: safeContent,
        nickname: safeNickname,
        password,
        image_url: image_url || null,
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
