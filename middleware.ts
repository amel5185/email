import { NextRequest, NextResponse } from "next/server";
import { verify, COOKIE } from "@/lib/jwt";
export async function middleware(req: NextRequest) {
  const ok = await verify(req.cookies.get(COOKIE)?.value);
  const p = req.nextUrl.pathname;
  if (p === "/login") return ok ? NextResponse.redirect(new URL("/", req.url)) : NextResponse.next();
  if (!ok) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/((?!api|_next|favicon.ico).*)"] };
