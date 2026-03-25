import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db.mjs";
import { requireAuth, signToken } from "../middleware/auth.mjs";

const router = Router();

async function verifyPassword(inputPassword, storedPassword) {
  if (!storedPassword) return false;
  const stored = String(storedPassword);
  // Support either bcrypt-hashed passwords or plain text passwords from members table.
  if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
    return bcrypt.compare(inputPassword, stored);
  }
  return inputPassword === stored;
}

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }
  const { rows } = await pool.query(
    `SELECT m.id, m.username, m.password, m.role_id,
            m.first_name, m.last_name,
            r.description AS role_description
     FROM members m
     LEFT JOIN roles r ON r.id = m.role_id
     WHERE m.username = $1`,
    [String(username).trim()],
  );
  const member = rows[0];
  if (!member || !(await verifyPassword(password, member.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = signToken({
    sub: member.id,
    roleId: member.role_id,
    roleDescription: member.role_description ?? "",
  });
  res.json({
    token,
    user: {
      id: member.id,
      username: member.username,
      displayName: `${member.first_name ?? ""} ${member.last_name ?? ""}`.trim() || member.username,
      roleId: member.role_id,
      roleDescription: member.role_description ?? "",
      memberId: member.id,
    },
  });
});

router.get("/me", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT m.id, m.username, m.first_name, m.last_name, m.role_id, r.description AS role_description
     FROM members m
     LEFT JOIN roles r ON r.id = m.role_id
     WHERE m.id = $1`,
    [req.user.sub],
  );
  const member = rows[0];
  if (!member) {
    return res.status(404).json({ error: "Member not found" });
  }
  const displayName =
    `${member.first_name ?? ""} ${member.last_name ?? ""}`.trim() || member.username;

  res.json({
    id: member.id,
    username: member.username,
    roleId: member.role_id,
    roleDescription: member.role_description ?? "",
    memberId: member.id,
    displayName,
  });
});

export default router;
