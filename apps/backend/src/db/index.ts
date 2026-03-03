import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "../config/env.config.js";

const sqlClient = neon(env.DB_URL);
const db = drizzle({client: sqlClient});

export default db;