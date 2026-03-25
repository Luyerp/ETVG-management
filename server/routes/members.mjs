import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db.mjs";
import { requireAuth } from "../middleware/auth.mjs";

const router = Router();

async function getRoleDescription(roleId) {
  if (roleId == null) return null;
  const { rows } = await pool.query(`SELECT description FROM roles WHERE id = $1`, [roleId]);
  return rows[0]?.description ?? null;
}

function canManageMembers(roleDescription) {
  return roleDescription === "Leader" || roleDescription === "Assistance";
}

async function verifyPassword(inputPassword, storedPassword) {
  if (!storedPassword) return false;
  const stored = String(storedPassword);
  if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
    return bcrypt.compare(inputPassword, stored);
  }
  return inputPassword === stored;
}

router.get("/", requireAuth, async (req, res) => {
  const page = Math.max(1, parseInt(String(req.query.page || "1"), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || "9"), 10) || 9));
  const offset = (page - 1) * limit;

  const countResult = await pool.query(`SELECT COUNT(*)::int AS c FROM members`);
  const total = countResult.rows[0].c;

  const { rows } = await pool.query(
    `SELECT m.id, m.slot_id, m.first_name, m.last_name, m.tel, m.entry_date, m.withdraw_date,
            m.role_id, r.description AS role
     FROM members m
     LEFT JOIN roles r ON r.id = m.role_id
     ORDER BY m.id ASC
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  );

  res.json({
    items: rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  });
});

router.get("/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  const { rows } = await pool.query(
    `SELECT m.id, m.slot_id, m.first_name, m.last_name, m.tel, m.entry_date, m.withdraw_date,
            m.role_id, r.description AS role
     FROM members m
     LEFT JOIN roles r ON r.id = m.role_id
     WHERE m.id = $1`,
    [id],
  );
  if (!rows[0]) {
    return res.status(404).json({ error: "Member not found" });
  }
  res.json(rows[0]);
});

router.post("/", requireAuth, async (req, res) => {
  const roleDescription = req.user.roleDescription;
  if (!canManageMembers(roleDescription)) {
    return res.status(403).json({ error: "Only Leader or Assistance can add members" });
  }
  const { first_name, last_name, tel, entry_date, role_id, slot_id } = req.body || {};
  if (!first_name || !last_name) {
    return res.status(400).json({ error: "first_name and last_name are required" });
  }
  const { rows } = await pool.query(
    `INSERT INTO members (slot_id, first_name, last_name, tel, entry_date, role_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, slot_id, first_name, last_name, tel, entry_date, withdraw_date, role_id`,
    [
      slot_id ?? null,
      String(first_name).trim(),
      String(last_name).trim(),
      tel != null ? String(tel) : null,
      entry_date ? new Date(entry_date) : null,
      role_id != null ? Number(role_id) : null,
    ],
  );
  const row = rows[0];
  const rdesc = await getRoleDescription(row.role_id);
  res.status(201).json({ ...row, role: rdesc });
});

router.put("/:id", requireAuth, async (req, res) => {
  const roleDescription = req.user.roleDescription;
  if (!canManageMembers(roleDescription)) {
    return res.status(403).json({ error: "Only Leader or Assistance can edit members" });
  }
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  const { first_name, last_name, tel, entry_date, withdraw_date, role_id, slot_id } = req.body || {};
  if (!first_name || !last_name) {
    return res.status(400).json({ error: "first_name and last_name are required" });
  }
  const { rows } = await pool.query(
    `UPDATE members SET
       slot_id = $1,
       first_name = $2,
       last_name = $3,
       tel = $4,
       entry_date = $5,
       withdraw_date = $6,
       role_id = $7
     WHERE id = $8
     RETURNING id, slot_id, first_name, last_name, tel, entry_date, withdraw_date, role_id`,
    [
      slot_id ?? null,
      String(first_name).trim(),
      String(last_name).trim(),
      tel != null ? String(tel) : null,
      entry_date ? new Date(entry_date) : null,
      withdraw_date ? new Date(withdraw_date) : null,
      role_id != null ? Number(role_id) : null,
      id,
    ],
  );
  if (!rows[0]) {
    return res.status(404).json({ error: "Member not found" });
  }
  const row = rows[0];
  const rdesc = await getRoleDescription(row.role_id);
  res.json({ ...row, role: rdesc });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const roleDescription = req.user.roleDescription;
  if (!canManageMembers(roleDescription)) {
    return res.status(403).json({ error: "Only Leader or Assistance can delete members" });
  }
  const { password } = req.body || {};
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "password is required" });
  }
  const memberId = req.user.sub;
  const { rows: urows } = await pool.query(
    `SELECT password FROM members WHERE id = $1`,
    [memberId],
  );
  const u = urows[0];
  if (!u || !(await verifyPassword(password, u.password))) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  const del = await pool.query(`DELETE FROM members WHERE id = $1 RETURNING id`, [id]);
  if (!del.rows[0]) {
    return res.status(404).json({ error: "Member not found" });
  }
  res.status(204).send();
});

export default router;
