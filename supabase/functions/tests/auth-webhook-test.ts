// Will load the .env file to Deno.env
import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { expect } from "jsr:@std/expect";
import { beforeAll, afterAll, describe, it } from "jsr:@std/testing/bdd";

import { AuthUserInsertEventType } from "../common/schemas.ts";
import { usersTable } from "../common/db/schema.ts";
import { eq } from "drizzle-orm";

import { v4 as uuidv4 } from "uuid";
import { DbClient, getDbClient } from "./test-utils/db-test.ts";
import { retryAssertion } from "./test-utils/retryAssertion.ts";
import { getSupabaseClient } from "./test-utils/drizzle-client.ts";

const client = getSupabaseClient();

describe("auth-webhook", () => {
  let db: DbClient;

  beforeAll(() => {
    db = getDbClient();
  });

  afterAll(() => {
    db.$client.end();
  });

  it("should add user to table when called", async () => {
    const id = uuidv4();

    const email = `${id.slice(0, 10)}-ci-user@ci.com`;

    const { error: func_error } = await client.functions.invoke(
      "auth-webhook",
      {
        body: JSON.stringify({
          type: "INSERT",
          table: "users",
          record: { email, id },
        } satisfies AuthUserInsertEventType),
      }
    );

    if (func_error) {
      throw new Error("Invalid response: " + func_error.message);
    }

    await retryAssertion(async () => {
      const response = await db
        .selectDistinct()
        .from(usersTable)
        .where(eq(usersTable.id, id));

      expect(response[0].id).toBe(id);
      expect(response[0].isApproved).toBe(false);
      expect(response[0].displayName).toBe(email);
      expect(response[0].email).toBe(email);
    });

    await cleanUpUser(db, id);
  });
});

const cleanUpUser = async (db: DbClient, id: string) => {
  console.log("running test cleanup");
  try {
    await db.delete(usersTable).where(eq(usersTable.id, id));
  } catch (error) {
    console.log("error during cleanup ", error);
  }
};
