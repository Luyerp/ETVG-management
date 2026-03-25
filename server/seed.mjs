/**
 * Seed script: roles, sample members, users (bcrypt passwords).
 * Run after schema/etvm.sql: node server/seed.mjs
 * Default password for all seeded users: password
 */
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { pool } from "./db.mjs";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const PASSWORD = process.env.SEED_PASSWORD || "password";

async function seed() {
  const hash = await bcrypt.hash(PASSWORD, 10);

  await pool.query(`
    INSERT INTO roles (description) VALUES ('Leader'), ('Assistance'), ('Member')
    ON CONFLICT (description) DO NOTHING
  `);

  const { rows: roleRows } = await pool.query(`SELECT id, description FROM roles ORDER BY id`);
  const roleId = (name) => roleRows.find((r) => r.description === name)?.id;

  const leaderId = roleId("Leader");
  const assistId = roleId("Assistance");
  const memberId = roleId("Member");
  if (!leaderId || !assistId || !memberId) {
    throw new Error("Roles missing after seed");
  }

  const memberRows = [
    ["Christine", "Brooks", "647287938", "2026-09-04", leaderId],
    ["Rosie", "Pearson", "6454344", "2026-05-28", assistId],
    ["Darrell", "Caldwell", "888", "2026-11-23", assistId],
    ["Gilbert", "Johnston", "5551234", "2026-01-15", memberId],
    ["Ricardo", "Hawkins", "5552345", "2026-02-20", memberId],
    ["Bruce", "Lane", "5553456", "2026-03-10", memberId],
    ["Henry", "Warren", "5554567", "2026-04-05", memberId],
    ["Nicole", "Foster", "5555678", "2026-06-12", memberId],
    ["Ricardo", "Green", "5556789", "2026-07-18", memberId],
  ];

  const count = await pool.query(`SELECT COUNT(*)::int AS c FROM members`);
  if (count.rows[0].c === 0) {
    for (const [fn, ln, tel, day, rid] of memberRows) {
      await pool.query(
        `INSERT INTO members (first_name, last_name, tel, entry_date, role_id)
         VALUES ($1, $2, $3, $4::timestamp, $5)`,
        [fn, ln, tel, day, rid],
      );
    }
    console.log(`Inserted ${memberRows.length} members.`);
  } else {
    console.log("Members table not empty — skipping member inserts.");
  }

  await pool.query(
    `INSERT INTO users (username, password_hash, display_name, role_id, member_id)
     VALUES ($1, $2, $3, $4, NULL)
     ON CONFLICT (username) DO NOTHING`,
    ["moni", hash, "Moni Roy", leaderId],
  );
  await pool.query(
    `INSERT INTO users (username, password_hash, display_name, role_id, member_id)
     VALUES ($1, $2, $3, $4, NULL)
     ON CONFLICT (username) DO NOTHING`,
    ["alice", hash, "Alice Assistant", assistId],
  );
  await pool.query(
    `INSERT INTO users (username, password_hash, display_name, role_id, member_id)
     VALUES ($1, $2, $3, $4, NULL)
     ON CONFLICT (username) DO NOTHING`,
    ["member1", hash, "Member User", memberId],
  );

  console.log("Seed users (password: " + PASSWORD + "): moni (Leader), alice (Assistance), member1 (Member)");
  await pool.end();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
