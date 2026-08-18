import { pgTable, serial, text, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const validationHistoryTable = pgTable("validation_history", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  passed: boolean("passed").notNull(),
  blockedBy: text("blocked_by"),
  checks: jsonb("checks").notNull().$type<Array<{
    name: string;
    passed: boolean;
    category: string;
    description: string;
  }>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertValidationHistorySchema = createInsertSchema(validationHistoryTable).omit({ id: true, createdAt: true });
export type InsertValidationHistory = z.infer<typeof insertValidationHistorySchema>;
export type ValidationHistory = typeof validationHistoryTable.$inferSelect;
    
