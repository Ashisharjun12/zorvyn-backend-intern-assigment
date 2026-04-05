
import{_config} from "./src/config/config"
import { defineConfig } from 'drizzle-kit';

const isTest = _config.NODE_ENV === 'test';

export default defineConfig({
  schema: "./src/db/schema.ts",  
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url:isTest ? _config.TEST_DATABASE_URL! : _config.DATABASE_URL!,
    ssl: { rejectUnauthorized: false },
  }

} )

