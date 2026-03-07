import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;

  if (!postId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const { error } = await supabase.from("post_likes").insert({ post_id: postId });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add like" }, { status: 500 });
  }

  const { count } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  return NextResponse.json({ success: true, like_count: count ?? 0 });
}
