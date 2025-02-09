import { z } from "zod";

export const AuthUserInsertEvent = z.object({
  type: z.literal("INSERT"),
  table: z.literal("users"),
  record: z.object({
    id: z.string(),
    email: z.string(),
  }),
});

export type AuthUserInsertEventType = z.infer<typeof AuthUserInsertEvent>;
