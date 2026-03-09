import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sanitize, isNumericPassword, checkAdminAuth } from "@/lib/utils";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { post_id, content, nickname = "hustler", password, turnstileToken } = body;

    if (!post_id || !content || !password) {
      return NextResponse.json(
        { error: "Missing required fields: post_id, content, password" },
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

    const safeContent = sanitize(content);

    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        post_id,
        nickname: safeNickname,
        content: safeContent,
        password,
        is_admin: adminCheck.isAdmin,
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
