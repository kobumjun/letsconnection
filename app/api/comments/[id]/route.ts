import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");

  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  if (!password) {
    return NextResponse.json({ error: "Password required for delete" }, { status: 400 });
  }

  const { data: comment, error } = await supabase
    .from("comments")
    .select("id, password")
    .eq("id", id)
    .single();

  if (error || !comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }
  if (comment.password !== password) {
    return NextResponse.json({ error: "Invalid password" }, { status: 403 });
  }

  await supabase.from("comments").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
