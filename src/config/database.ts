
import { _config } from './config.js';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema.js";

const pool = new Pool({
  connectionString: _config.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});


export const db = drizzle(pool, { schema });
