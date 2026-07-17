"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/app/auth/actions";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <main style={{ maxWidth: "20rem", margin: "2rem auto", padding: "1rem" }}>
      <h1>Sign up</h1>
      <form
        action={action}
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
        />
        {state?.error && <p style={{ color: "crimson" }}>{state.error}</p>}
        <button disabled={pending} type="submit">
          Sign up
        </button>
      </form>
      <p>
        <Link href="/login">Have an account? Log in</Link>
      </p>
    </main>
  );
}
