// Loads the customer portal demo data into DynamoDB.
//
//   cd infra/agent-api && npm install
//   PORTAL_DEMO_PASSWORD='<choose one>' npm run seed:portal
//
// Every demo user gets PORTAL_DEMO_PASSWORD (stored as a scrypt hash, never in
// plain text). Re-running replaces the demo data and resets those passwords; items
// no longer in seed/portal-seed.json are removed. Table names default to the ones
// in template.yaml; override with PORTAL_USERS_TABLE / PORTAL_DATA_TABLE.
import { readFile } from "node:fs/promises";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

process.env.PORTAL_USERS_TABLE ||= "halcyra-portal-users";
process.env.PORTAL_DATA_TABLE ||= "halcyra-portal-data";
process.env.PORTAL_SESSIONS_TABLE ||= "halcyra-portal-sessions";
const { hashPassword } = await import("../src/portal-auth.mjs");

const password = process.env.PORTAL_DEMO_PASSWORD;
if (!password || password.length < 8) {
  console.error("Set PORTAL_DEMO_PASSWORD (8+ characters) to the password demo users should sign in with.");
  process.exit(1);
}

const USERS = process.env.PORTAL_USERS_TABLE;
const DATA = process.env.PORTAL_DATA_TABLE;
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});
const seed = JSON.parse(await readFile(new URL("../seed/portal-seed.json", import.meta.url), "utf8"));

const dataItems = [];
const userItems = [];
for (const account of seed.accounts) {
  const { users, orders, instruments, consumables, shipments, ...profile } = account;
  const pk = `ACCOUNT#${account.id}`;
  dataItems.push({ pk, sk: "PROFILE", type: "profile", seq: 0, ...profile });
  const add = (type, prefix, list, key) =>
    list.forEach((item, i) => dataItems.push({ pk, sk: `${prefix}#${item[key]}`, type, seq: i, ...item }));
  add("user", "USER", users, "id");
  add("order", "ORDER", orders, "id");
  add("instrument", "INSTRUMENT", instruments, "serial");
  add("consumable", "CONSUMABLE", consumables, "sku");
  add("shipment", "SHIPMENT", shipments, "id");

  for (const u of users) {
    const { id, ...rest } = u;
    userItems.push({
      ...rest,
      email: u.email.toLowerCase(),
      userId: id,
      accountId: account.id,
      passwordHash: await hashPassword(password),
    });
  }
}
seed.promotions.forEach((p, i) => dataItems.push({ pk: "PROMOTIONS", sk: `PROMO#${p.id}`, type: "promotion", seq: i, ...p }));

// Remove items that are no longer in the seed file.
const keep = new Set(dataItems.map((i) => `${i.pk}|${i.sk}`));
const stale = [];
for (const pk of new Set(dataItems.map((i) => i.pk))) {
  let ExclusiveStartKey;
  do {
    const res = await db.send(
      new QueryCommand({
        TableName: DATA,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: { ":pk": pk },
        ProjectionExpression: "pk, sk",
        ExclusiveStartKey,
      }),
    );
    for (const it of res.Items ?? []) if (!keep.has(`${it.pk}|${it.sk}`)) stale.push(it);
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);
}

await batchWrite(DATA, dataItems.map((Item) => ({ PutRequest: { Item } })));
await batchWrite(DATA, stale.map((Key) => ({ DeleteRequest: { Key } })));
await batchWrite(USERS, userItems.map((Item) => ({ PutRequest: { Item } })));

console.log(
  `Loaded ${dataItems.length} portal items (${seed.accounts.length} accounts, ${seed.promotions.length} promotions) ` +
    `into ${DATA}, removed ${stale.length} stale, and ${userItems.length} users into ${USERS}.`,
);

async function batchWrite(table, requests) {
  for (let i = 0; i < requests.length; i += 25) {
    let pending = { [table]: requests.slice(i, i + 25) };
    for (let attempt = 0; pending[table]?.length; attempt++) {
      if (attempt > 5) throw new Error(`Could not write to ${table}`);
      if (attempt) await new Promise((r) => setTimeout(r, 200 * 2 ** attempt));
      const res = await db.send(new BatchWriteCommand({ RequestItems: pending }));
      pending = res.UnprocessedItems ?? {};
    }
  }
}
