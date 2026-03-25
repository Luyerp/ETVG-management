import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, canManageMembers, formatEntryDate } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import type { MemberRow } from "./types";

export function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [member, setMember] = useState<MemberRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const manage = canManageMembers(user?.roleDescription);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const row = await api<MemberRow>(`/api/members/${id}`);
        if (!cancelled) setMember(row);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="members-muted">Loading…</p>;
  }
  if (error || !member) {
    return (
      <div>
        <p className="login-form__error">{error || "Not found"}</p>
        <button type="button" className="btn btn--ghost" onClick={() => navigate("/members")}>
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="member-detail">
      <div className="member-detail__toolbar">
        <button type="button" className="link-back" onClick={() => navigate("/members")}>
          ← Back
        </button>
        {manage && (
          <Link to={`/members/${member.id}/edit`} className="btn btn--primary">
            Edit
          </Link>
        )}
      </div>
      <h2 className="member-detail__title">
        {member.first_name} {member.last_name}
      </h2>
      <dl className="member-detail__grid">
        <dt>ID</dt>
        <dd>{member.id}</dd>
        <dt>Slot ID</dt>
        <dd>{member.slot_id ?? "—"}</dd>
        <dt>Tel</dt>
        <dd>{member.tel ?? "—"}</dd>
        <dt>Entry date</dt>
        <dd>{formatEntryDate(member.entry_date)}</dd>
        <dt>Withdraw date</dt>
        <dd>{formatEntryDate(member.withdraw_date)}</dd>
        <dt>Role</dt>
        <dd>{member.role ?? "—"}</dd>
      </dl>
    </div>
  );
}
