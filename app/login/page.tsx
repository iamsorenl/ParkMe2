"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/auth/actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main style={{ maxWidth: "20rem", margin: "2rem auto", padding: "1rem" }}>
      <h1>Log in</h1>
      <form
        action={action}
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required />
        {state?.error && <p style={{ color: "crimson" }}>{state.error}</p>}
        <button disabled={pending} type="submit">
          Log in
        </button>
      </form>
      <p>
        <Link href="/signup">Need an account? Sign up</Link>
      </p>
    </main>
  );
}
