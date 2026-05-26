import { drizzle } from "drizzle-orm/postgres-js";
import postgress from "postgres";
import 'dotenv/config'
import * as schema from "@/db/schema"

if (!process.env.DATABASE_URL) {
    throw new Error("Database Url is not set!");
  }
const client = postgress(process.env.DATABASE_URL);

export const db = drizzle(client, { schema });

