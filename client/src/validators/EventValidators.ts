import { z } from "zod";

export const EventSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(5).max(500),
  date: z.string().min(8),
});

export type EventInput = z.infer<typeof EventSchema>; 