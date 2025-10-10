import { clients } from "@/drizzle/schema";

export type ClientRead = typeof clients.$inferSelect;
