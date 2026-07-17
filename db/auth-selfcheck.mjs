import assert from "node:assert/strict";
import {
  hashPassword,
  verifyPassword,
  createToken,
  verifyToken,
} from "../lib/auth-core.ts";

const stored = hashPassword("correct horse battery");
assert.equal(verifyPassword("correct horse battery", stored), true, "round-trip");
assert.equal(verifyPassword("wrong password", stored), false, "wrong password");

const secret = "test-secret";
const token = createToken("user-123", secret);
assert.equal(verifyToken(token, secret), "user-123", "token round-trip");

const sig = token.split(".")[1];
const forgedPayload = createToken("user-666", secret).split(".")[0];
assert.equal(verifyToken(`${forgedPayload}.${sig}`, secret), null, "tampered payload");
assert.equal(verifyToken(token.slice(0, -2) + "AA", secret), null, "tampered signature");
assert.equal(verifyToken("not-a-token", secret), null, "malformed token");
assert.equal(verifyToken(createToken("user-123", secret, -1000), secret), null, "expired token");

console.log("auth-selfcheck: 7 assertions passed");
