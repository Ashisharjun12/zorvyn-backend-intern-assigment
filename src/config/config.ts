
import { config } from "dotenv"
config({debug:true, override: true});


const { PORT, NODE_ENV, DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN } = process.env;

export const _config = {
    PORT,
    NODE_ENV,
    DATABASE_URL,
    JWT_SECRET,
    JWT_EXPIRES_IN
}

