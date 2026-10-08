import { z } from "zod";
import { json } from "@/lib/api";
import { read, write, Account } from "@/lib/store";
import { encrypt } from "@/lib/crypto";
import { transport } from "@/lib/mailer";

const pub = ({ cred, ...a }: Account) => a;

export const GET = async () => {
  return json(
    (await read<Account[]>("accounts", [])).map(pub)
  );
};

const schema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email()
    .regex(/@(gmail|googlemail)\.com$/),

  appPassword: z
    .string()
    .transform((s) => s.replace(/\s/g, ""))
    .pipe(z.string().length(16)),
});

export const POST = async (req: Request) => {
  try {
    const d = schema.parse(await req.json());

    const all = await read<Account[]>("accounts", []);

    if (all.length >= 5) {
      return json(
        { error: "Maksimal 5 akun Gmail." },
        400
      );
    }

    if (all.some((a) => a.email === d.email)) {
      return json(
        { error: "Akun sudah ditambahkan." },
        400
      );
    }

    try {
      await transport(
        d.email,
        d.appPassword
      ).verify();
    } catch {
      return json(
        {
          error:
            "Autentikasi Gmail gagal. Periksa email dan App Password.",
        },
        400
      );
    }

    const now = new Date().toISOString();

    const a: Account = {
      id: crypto.randomUUID(),
      email: d.email,
      displayName: "",
      cred: encrypt(d.appPassword),
      createdAt: now,
      updatedAt: now,
    };

    await write("accounts", [...all, a]);

    return json(pub(a), 201);
  } catch (e: any) {
    return json(
      {
        error:
          e?.issues?.[0]?.message ||
          e?.message ||
          "Data tidak valid.",
      },
      400
    );
  }
};
