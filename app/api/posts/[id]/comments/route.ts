import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sanitize, isNumericPassword } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;

  const { data: comments, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }

  return NextResponse.json(comments ?? []);
}
