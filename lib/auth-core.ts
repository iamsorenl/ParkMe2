// Pure crypto helpers — no Next.js imports so db/auth-selfcheck.mjs can run them.
import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

export const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

export function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export function verifyPassword(password: string, stored: string) {
  const [scheme, saltB64, hashB64] = stored.split("$");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = scryptSync(
    password,
    Buffer.from(saltB64, "base64"),
    expected.length,
  );
  return (
    actual.length === expected.length && timingSafeEqual(actual, expected)
  );
}

const sign = (payload: string, secret: string) =>
  createHmac("sha256", secret).update(payload).digest("base64url");

export function createToken(userId: string, secret: string, ttlMs = SESSION_MS) {
  const payload = Buffer.from(
    JSON.stringify({ uid: userId, exp: Date.now() + ttlMs }),
  ).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyToken(token: string, secret: string): string | null {
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;
    const expected = Buffer.from(sign(payload, secret));
    const actual = Buffer.from(sig);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
      return null;
    const { uid, exp } = JSON.parse(
      Buffer.from(payload, "base64url").toString(),
    );
    if (typeof uid !== "string" || typeof exp !== "number" || Date.now() > exp)
      return null;
    return uid;
  } catch {
    return null;
  }
}
