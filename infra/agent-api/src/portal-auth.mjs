// Customer portal authentication, backed by two DynamoDB tables:
//   PORTAL_USERS_TABLE     email -> profile + scrypt password hash
//   PORTAL_SESSIONS_TABLE  sha256(token) -> session, expired by DynamoDB TTL
//
// This is the only module that knows how sign-in works. To move to Okta or Auth0,
// replace signIn/signOut with the IdP's hosted login and make authenticate() verify
// the IdP's JWT (issuer, audience, signature) and map its claims to a portal user.
// portal.mjs only calls authenticate() and needs { email, accountId, userId } back.
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const scryptAsync = promisify(scrypt);
const USERS = process.env.PORTAL_USERS_TABLE;
const SESSIONS = process.env.PORTAL_SESSIONS_TABLE;
const SESSION_HOURS = 8;

/**
 * Password hashes are stored as "scrypt$N$r$p$<salt b64>$<hash b64>".
 * infra/agent-api/scripts/seed-portal.mjs writes them in the same format.
 */
export async function hashPassword(password, salt = randomBytes(16)) {
  const N = 16384, r = 8, p = 1;
  const hash = await scryptAsync(password, salt, 64, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

async function verifyPassword(password, stored) {
  const [alg, N, r, p, salt, hash] = String(stored || "").split("$");
  if (alg !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const actual = await scryptAsync(password, Buffer.from(salt, "base64"), expected.length, {
    N: Number(N),
    r: Number(r),
    p: Number(p),
  });
  return timingSafeEqual(actual, expected);
}

const tokenKey = (token) => createHash("sha256").update(token).digest("base64url");

// Checked against when the email is unknown, so a miss costs the same time as a wrong password.
const DUMMY_HASH = await hashPassword("not-a-real-password");

/** Returns { token, expiresAt } or null when the email or password is wrong. */
export async function signIn(email, password) {
  const key = String(email || "").trim().toLowerCase();
  const { Item: user } = key ? await db.send(new GetCommand({ TableName: USERS, Key: { email: key } })) : {};
  const ok = await verifyPassword(String(password || ""), user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok || user.disabled) return null;

  const token = randomBytes(32).toString("base64url");
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_HOURS * 3600;
  await db.send(
    new PutCommand({
      TableName: SESSIONS,
      Item: {
        tokenHash: tokenKey(token),
        email: user.email,
        accountId: user.accountId,
        userId: user.userId,
        createdAt: new Date().toISOString(),
        expiresAt,
      },
    }),
  );
  return { token, expiresAt };
}

function bearer(event) {
  const header = event.headers?.authorization || event.headers?.Authorization || "";
  const m = /^Bearer\s+(\S+)$/i.exec(header);
  return m ? m[1] : null;
}

/** Returns the signed-in { email, accountId, userId } for a request, or null. */
export async function authenticate(event) {
  const token = bearer(event);
  if (!token) return null;
  const { Item } = await db.send(new GetCommand({ TableName: SESSIONS, Key: { tokenHash: tokenKey(token) } }));
  // TTL deletion can lag, so check expiry here too.
  if (!Item || Item.expiresAt < Date.now() / 1000) return null;
  return { email: Item.email, accountId: Item.accountId, userId: Item.userId };
}

export async function signOut(event) {
  const token = bearer(event);
  if (token) await db.send(new DeleteCommand({ TableName: SESSIONS, Key: { tokenHash: tokenKey(token) } }));
}
