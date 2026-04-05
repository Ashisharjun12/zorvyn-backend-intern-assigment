
import { _config } from './config.js';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema.js";
import { logger } from '../utils/logger.js';

const isTest = _config.NODE_ENV === 'test'
const connectionString = isTest ? _config.TEST_DATABASE_URL : _config.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});


if (isTest) {
    logger.info("Connecting to Testing Database...");
}

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
