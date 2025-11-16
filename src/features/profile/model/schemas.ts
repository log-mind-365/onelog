import { z } from "zod";

export const profileUserUUIDSchema = z.object({
  id: z.uuid(),
});
