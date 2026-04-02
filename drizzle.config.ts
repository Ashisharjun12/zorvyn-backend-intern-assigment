
import{_config} from "./src/config/config"
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: "./src/db/schema.ts",  
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url:_config.DATABASE_URL!,
    ssl: { rejectUnauthorized: false },
  }

} )

