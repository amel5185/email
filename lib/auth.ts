import { cookies } from "next/headers";
import { verify, COOKIE } from "./jwt";
export const getSession = async () => verify(cookies().get(COOKIE)?.value);
