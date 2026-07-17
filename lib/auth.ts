import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { createToken, verifyToken, SESSION_MS } from "./auth-core";

export { hashPassword, verifyPassword } from "./auth-core";

export async function createSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set("session", createToken(userId, process.env.SESSION_SECRET!), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MS / 1000,
  });
}

export async function deleteSession() {
  (await cookies()).delete("session");
}

export const getUserId = cache(async (): Promise<string | null> => {
  const token = (await cookies()).get("session")?.value;
  return token ? verifyToken(token, process.env.SESSION_SECRET!) : null;
});
