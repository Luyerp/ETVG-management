import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/client";
import type { MemberRow, RoleOption } from "./types";

type Mode = "create" | "edit";

function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function MemberForm({ mode }: { mode: Mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [slotId, setSlotId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tel, setTel] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [withdrawDate, setWithdrawDate] = useState("");
  const [roleId, setRoleId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await api<RoleOption[]>("/api/roles");
        if (!cancelled) setRoles(list);
      } catch {
        if (!cancelled) setError("Could not load roles");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const m = await api<MemberRow>(`/api/members/${id}`);
        if (cancelled) return;
        setSlotId(m.slot_id != null ? String(m.slot_id) : "");
        setFirstName(m.first_name);
        setLastName(m.last_name);
        setTel(m.tel ?? "");
        setEntryDate(toDatetimeLocalValue(m.entry_date));
        setWithdrawDate(toDatetimeLocalValue(m.withdraw_date));
        setRoleId(m.role_id != null ? String(m.role_id) : "");
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        tel: tel.trim() || null,
        entry_date: entryDate ? new Date(entryDate).toISOString() : null,
        role_id: roleId ? Number(roleId) : null,
        slot_id: slotId.trim() ? Number(slotId) : null,
      };
      if (mode === "edit") {
        body.withdraw_date = withdrawDate ? new Date(withdrawDate).toISOString() : null;
      }
      if (mode === "create") {
        const created = await api<MemberRow & { role?: string }>("/api/members", {
          method: "POST",
          body: JSON.stringify(body),
        });
        navigate(`/members/${created.id}`);
      } else if (id) {
        await api(`/api/members/${id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        navigate(`/members/${id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="members-muted">Loading…</p>;
  }

  return (
    <div className="member-form-page">
      <button type="button" className="link-back" onClick={() => navigate("/members")}>
        ← Back to list
      </button>
      <h2 className="member-form-page__title">{mode === "create" ? "Create member" : "Edit member"}</h2>
      <form className="member-form" onSubmit={onSubmit}>
        <label className="member-form__field">
          <span>Slot ID</span>
          <input value={slotId} onChange={(e) => setSlotId(e.target.value)} inputMode="numeric" />
        </label>
        <label className="member-form__field">
          <span>First name</span>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </label>
        <label className="member-form__field">
          <span>Last name</span>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </label>
        <label className="member-form__field">
          <span>Tel</span>
          <input value={tel} onChange={(e) => setTel(e.target.value)} />
        </label>
        <label className="member-form__field">
          <span>Entry date</span>
          <input
            type="datetime-local"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
          />
        </label>
        {mode === "edit" && (
          <label className="member-form__field">
            <span>Withdraw date</span>
            <input
              type="datetime-local"
              value={withdrawDate}
              onChange={(e) => setWithdrawDate(e.target.value)}
            />
          </label>
        )}
        <label className="member-form__field">
          <span>Role</span>
          <select value={roleId} onChange={(e) => setRoleId(e.target.value)} required>
            <option value="">Select role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.description}
              </option>
            ))}
          </select>
        </label>
        {error && <p className="login-form__error">{error}</p>}
        <div className="member-form__actions">
          <button type="button" className="btn btn--ghost" onClick={() => navigate("/members")}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? "Saving…" : mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
