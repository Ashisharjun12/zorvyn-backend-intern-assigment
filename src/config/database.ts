
import { _config } from './config.js';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema.js";

import { logger } from '../utils/logger.js';

const pool = new Pool({
  connectionString: _config.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const connectDB = async () => {
    try {
        const client = await pool.connect();
        logger.info("Successfully connected to the database");
        client.release();
    } catch (error) {
        logger.fatal(error, "Database connection failed");
        process.exit(1);
    }
};

export const db = drizzle(pool, { schema });
