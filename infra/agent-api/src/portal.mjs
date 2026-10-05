// Customer portal API.
//   POST /portal/login   { email, password } -> { token, expiresAt }
//   POST /portal/logout  (Bearer token)      -> 204
//   GET  /portal/me      (Bearer token)      -> { user, account, promotions, halcyraIQ }
//   POST /portal/iq/activate    (Bearer token, account admin) -> { halcyraIQ }
//   POST /portal/iq/deactivate  (Bearer token, account admin) -> { halcyraIQ: null }
//
// Portal data lives in PORTAL_DATA_TABLE as one partition per account
// (pk "ACCOUNT#<id>", sk "PROFILE" | "USER#.." | "ORDER#.." | "INSTRUMENT#.." |
// "CONSUMABLE#.." | "SHIPMENT#..") plus a "PROMOTIONS" partition. Seeded by
// scripts/seed-portal.mjs from seed/portal-seed.json. HalcyraIQ activation is stored
// per account at sk "IQ"; the seed script leaves it alone.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
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
    if (route === "POST /portal/iq/activate") return await setIQ(event, true);
    if (route === "POST /portal/iq/deactivate") return await setIQ(event, false);
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

  const iq = items.find((i) => i.sk === "IQ");
  const { passwordHash, disabled, ...publicUser } = user;
  return json(200, { user: { ...publicUser, id: user.userId }, account, promotions, halcyraIQ: iq ? publicIQ(iq) : null });
}

// Only an account admin can turn HalcyraIQ on or off for their institution.
async function setIQ(event, on) {
  const who = await authenticate(event);
  if (!who) return json(401, { error: "Sign in to continue." });
  const { Item: user } = await db.send(new GetCommand({ TableName: USERS, Key: { email: who.email } }));
  if (!user) return json(401, { error: "Sign in to continue." });
  if (user.role !== "admin") return json(403, { error: "Only an account admin can change HalcyraIQ." });

  const Key = { pk: `ACCOUNT#${who.accountId}`, sk: "IQ" };
  if (!on) {
    await db.send(new DeleteCommand({ TableName: DATA, Key }));
    return json(200, { halcyraIQ: null });
  }
  const item = { ...Key, type: "iq", activatedAt: new Date().toISOString(), activatedBy: user.name };
  await db.send(new PutCommand({ TableName: DATA, Item: item }));
  return json(200, { halcyraIQ: publicIQ(item) });
}

function publicIQ({ activatedAt, activatedBy }) {
  return { activatedAt, activatedBy };
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
