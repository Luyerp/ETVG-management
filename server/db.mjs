import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
const hasTemplatePlaceholders =
  typeof connectionString === "string" &&
  /USERNAME|USER|PASSWORD|HOST|PORT|DBNAME/i.test(connectionString);

if (hasTemplatePlaceholders) {
  console.warn(
    "DATABASE_URL looks like a template value. Falling back to PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD.",
  );
}

export const pool = connectionString && !hasTemplatePlaceholders
  ? new Pool({ connectionString })
  : new Pool({
      host: process.env.PGHOST || "localhost",
      port: Number(process.env.PGPORT || 5432),
      database: process.env.PGDATABASE || "ETVM_db",
      user: process.env.PGUSER || process.env.USER || "postgres",
      password: process.env.PGPASSWORD || "",
    });
