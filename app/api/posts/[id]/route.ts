import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { SESSION_COOKIE, ADMIN_PASSWORD } from "@/lib/utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;

  // Admin can delete without password
  if (session === ADMIN_PASSWORD) {
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");

  if (!password) {
    return NextResponse.json({ error: "Password required for delete" }, { status: 400 });
  }

  const { data: post, error } = await supabase
    .from("posts")
    .select("id, password")
    .eq("id", id)
    .single();

  if (error || !post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  if (post.password !== password) {
    return NextResponse.json({ error: "Invalid password" }, { status: 403 });
  }

  const { error: deleteError } = await supabase.from("posts").delete().eq("id", id);

  if (deleteError) {
    console.error(deleteError);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
