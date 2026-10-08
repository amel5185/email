import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getSession } from "./auth";

export const json = (d: unknown, s = 200) =>
  NextResponse.json(d, { status: s });

export function guard(
  fn: (
    req: Request,
    ctx: { params: { id: string } }
  ) => Promise<Response>
) {
  return async (
    req: Request,
    ctx: { params: { id: string } }
  ) => {
    if (!(await getSession())) {
      return json(
        { error: "Tidak diizinkan." },
        401
      );
    }

    try {
      return await fn(req, ctx);
    } catch (e) {
      if (e instanceof ZodError) {
        return json(
          { error: "Input tidak valid." },
          400
        );
      }

      console.error(e);

      return json(
        { error: "Terjadi kesalahan." },
        500
      );
    }
  };
}
