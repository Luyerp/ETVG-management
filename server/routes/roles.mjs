import { Router } from "express";
import { pool } from "../db.mjs";
import { requireAuth } from "../middleware/auth.mjs";

const router = Router();

router.get("/", requireAuth, async (_req, res) => {
  const { rows } = await pool.query(`SELECT id, description FROM roles ORDER BY id`);
  res.json(rows);
});

export default router;
