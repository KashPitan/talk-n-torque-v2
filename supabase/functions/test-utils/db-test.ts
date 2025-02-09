import postgres from "npm:postgres";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";

export type DbClient = PostgresJsDatabase<Record<string, never>> & {
  $client: postgres.Sql<{}>;
};

let dbClient: DbClient;

export const getDbClient = () => {
  if (dbClient) return dbClient;
  const connectionString = Deno.env.get("SUPABASE_DB_URL")!;
  const client = postgres(connectionString, { prepare: false });
  return drizzle({ client });
};
