import { json } from "@/lib/api";
import { read, History } from "@/lib/store";

export const GET = async () => {
  return json(
    (await read<History[]>("history", []))
      .slice()
      .reverse()
  );
};
