import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { journalEntries, users } from "./schema";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, {
  schema: {
    users,
    journalEntries,
  },
});

export type DbClient = typeof db;
