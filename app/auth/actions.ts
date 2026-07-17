"use server";

import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import {
  createSession,
  deleteSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";

type State = { error: string } | undefined;

// Valid stored hash so unknown-email logins do the same scrypt work as real ones.
const DUMMY_HASH = hashPassword("dummy password");

function readCredentials(
  formData: FormData,
): { error: string } | { email: string; password: string } {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email.includes("@") || email.length > 254)
    return { error: "Enter a valid email address" };
  if (password.length < 8 || password.length > 256)
    return { error: "Password must be 8–256 characters" };
  return { email, password };
}

export async function signup(_state: State, formData: FormData): Promise<State> {
  const creds = readCredentials(formData);
  if ("error" in creds) return creds;

  let id: string;
  try {
    const rows = (await sql`
      INSERT INTO account (email, password_hash)
      VALUES (${creds.email}, ${hashPassword(creds.password)})
      RETURNING id
    `) as { id: string }[];
    id = rows[0].id;
  } catch (e) {
    if ((e as { code?: string }).code === "23505")
      return { error: "Email already registered" };
    throw e;
  }
  await createSession(id);
  redirect("/");
}

export async function login(_state: State, formData: FormData): Promise<State> {
  const creds = readCredentials(formData);
  if ("error" in creds) return creds;

  const rows = (await sql`
    SELECT id, password_hash FROM account WHERE email = ${creds.email}
  `) as { id: string; password_hash: string }[];
  const account = rows[0];
  const ok = verifyPassword(creds.password, account?.password_hash ?? DUMMY_HASH);
  if (!account || !ok) return { error: "Invalid email or password" };

  await createSession(account.id);
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
