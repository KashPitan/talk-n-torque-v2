import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { db } from "../common/db/db.ts";
import { usersTable } from "../common/db/schema.ts";
import { AuthUserInsertEvent } from "../common/schemas.ts";
// import { corsHeaders } from "../common/cors.ts";

Deno.serve(async (req) => {
  console.log("auth-webhook invoked");
  try {
    const payload = await req.json();
    const {
      record: { email, id },
    } = AuthUserInsertEvent.parse(payload);

    console.log(JSON.stringify(payload, null, 2));

    await db.insert(usersTable).values({
      displayName: email,
      email,
      id,
      isApproved: false,
    });

    return new Response("ok");
  } catch (error) {
    console.log(error);
  }
  return new Response("not ok");
});
