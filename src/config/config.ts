
import { config } from "dotenv"
config({debug:true});


const { PORT, NODE_ENV, DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, APP_URL ,TEST_DATABASE_URL} = process.env;

export const _config = {
    PORT: PORT || 8000,
    NODE_ENV,
    DATABASE_URL,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    APP_URL,
    TEST_DATABASE_URL
}

