import "express-async-errors";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.mjs";
import membersRoutes from "./routes/members.mjs";
import rolesRoutes from "./routes/roles.mjs";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/roles", rolesRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`ETVG API listening on http://localhost:${port}`);
});
