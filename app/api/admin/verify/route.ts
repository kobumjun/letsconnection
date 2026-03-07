import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, ADMIN_PASSWORD } from "@/lib/utils";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  const isAdmin = session === ADMIN_PASSWORD;
  return NextResponse.json({ isAdmin });
}
