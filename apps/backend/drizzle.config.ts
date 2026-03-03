import dotenv from 'dotenv';
import { defineConfig } from "drizzle-kit";

dotenv.config();

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schema/**/*.ts",
    dbCredentials: {
        url: process.env.DB_MIG_URL!
    }
});