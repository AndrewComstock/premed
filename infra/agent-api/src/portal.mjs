// Customer portal API.
//   POST /portal/login   { email, password } -> { token, expiresAt }
//   POST /portal/logout  (Bearer token)      -> 204
//   GET  /portal/me      (Bearer token)      -> { user, account, promotions }
//
// Portal data lives in PORTAL_DATA_TABLE as one partition per account
// (pk "ACCOUNT#<id>", sk "PROFILE" | "USER#.." | "ORDER#.." | "INSTRUMENT#.." |
// "CONSUMABLE#.." | "SHIPMENT#..") plus a "PROMOTIONS" partition. Seeded by
// scripts/seed-portal.mjs from seed/portal-seed.json.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { authenticate, signIn, signOut } from "./portal-auth.mjs";

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const USERS = process.env.PORTAL_USERS_TABLE;
const DATA = process.env.PORTAL_DATA_TABLE;

const json = (statusCode, body) => ({
  statusCode,
  headers: { "content-type": "application/json", "cache-control": "no-store" },
  body: body === undefined ? "" : JSON.stringify(body),
});

export async function handler(event) {
  const route = `${event.requestContext?.http?.method} ${event.rawPath}`;
  try {
    if (route === "POST /portal/login") return await login(event);
    if (route === "POST /portal/logout") {
      await signOut(event);
      return json(204);
    }
    if (route === "GET /portal/me") return await me(event);
    return json(404, { error: "Not found." });
  } catch (err) {
    console.error("Portal request failed", route, err);
    return json(500, { error: "The portal is unavailable right now." });
  }
}

async function login(event) {
  let req;
  try {
    req = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Body must be JSON." });
  }
  if (typeof req.email !== "string" || typeof req.password !== "string" || req.password.length > 200) {
    return json(400, { error: "Expected { email, password }." });
  }
  const session = await signIn(req.email, req.password);
  if (!session) return json(401, { error: "Incorrect email or password." });
  return json(200, session);
}

async function me(event) {
  const who = await authenticate(event);
  if (!who) return json(401, { error: "Sign in to continue." });

  const [{ Item: user }, items, promos] = await Promise.all([
    db.send(new GetCommand({ TableName: USERS, Key: { email: who.email } })),
    queryAll(`ACCOUNT#${who.accountId}`),
    queryAll("PROMOTIONS"),
  ]);
  if (!user) return json(401, { error: "Sign in to continue." });

  const profile = items.find((i) => i.sk === "PROFILE");
  if (!profile) return json(404, { error: "Account not found." });
  // seq keeps the seed file's order; DynamoDB returns items sorted by sk.
  const of = (type) =>
    items
      .filter((i) => i.type === type)
      .sort((a, b) => a.seq - b.seq)
      .map(strip);

  const account = {
    ...strip(profile),
    users: of("user"),
    orders: of("order"),
    instruments: of("instrument"),
    consumables: of("consumable"),
    shipments: of("shipment"),
  };
  const promotions = promos
    .sort((a, b) => a.seq - b.seq)
    .map(strip)
    .filter((p) => (p.accountId ? p.accountId === account.id : p.sectors.includes(account.sector)));

  const { passwordHash, disabled, ...publicUser } = user;
  return json(200, { user: { ...publicUser, id: user.userId }, account, promotions });
}

async function queryAll(pk) {
  const out = [];
  let ExclusiveStartKey;
  do {
    const res = await db.send(
      new QueryCommand({
        TableName: DATA,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: { ":pk": pk },
        ExclusiveStartKey,
      }),
    );
    out.push(...(res.Items ?? []));
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return out;
}

function strip({ pk, sk, type, seq, ...rest }) {
  return rest;
}
