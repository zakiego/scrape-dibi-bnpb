import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const data = sqliteTable("data", {
	id: text("id").primaryKey(),
	kbi: text("kbi").notNull(),
	image: text("image"),
	createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});
