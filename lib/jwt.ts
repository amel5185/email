import { SignJWT, jwtVerify } from "jose";
export const COOKIE = "mc_session";
const key = () => {
  const s = process.env.AUTH_SECRET || "";
  if (s.length < 32) throw new Error("AUTH_SECRET minimal 32 karakter");
  return new TextEncoder().encode(s);
};
export const sign = () => new SignJWT({ u: "admin" }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(key());
export async function verify(t?: string) {
  if (!t) return false;
  try { await jwtVerify(t, key()); return true; } catch { return false; }
}
