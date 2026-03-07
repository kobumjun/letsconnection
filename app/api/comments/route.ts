import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sanitize, isNumericPassword } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { post_id, content, nickname = "hustler", password } = body;

    if (!post_id || !content || !password) {
      return NextResponse.json(
        { error: "Missing required fields: post_id, content, password" },
        { status: 400 }
      );
    }

    if (!isNumericPassword(password)) {
      return NextResponse.json(
        { error: "Password must be numeric only" },
        { status: 400 }
      );
    }

    const safeNickname = sanitize(nickname || "hustler");
    const safeContent = sanitize(content);

    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        post_id,
        nickname: safeNickname,
        content: safeContent,
        password,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
    }

    return NextResponse.json(comment);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
