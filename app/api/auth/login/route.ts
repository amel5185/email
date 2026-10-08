import { createHash, timingSafeEqual } from "crypto";
import { z } from "zod";
import { NextResponse } from "next/server";
import { sign, COOKIE } from "@/lib/jwt";
import { limit } from "@/lib/ratelimit";
const h = (s: string) => createHash("sha256").update(s).digest();
const same = (a: string, b: string) => timingSafeEqual(h(a), h(b));
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  if (!(await limit("login:" + ip, 5, 600))) return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi nanti." }, { status: 429 });
  const p = z.object({ email: z.string().max(200), password: z.string().max(200) }).safeParse(await req.json().catch(() => null));
  const E = process.env.ADMIN_EMAIL, P = process.env.ADMIN_PASSWORD;
  if (!E || !P) return NextResponse.json({ error: "Server belum dikonfigurasi." }, { status: 500 });
  if (!p.success || !same(p.data.email, E) || !same(p.data.password, P)) return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await sign(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 604800 });
  return res;
}
