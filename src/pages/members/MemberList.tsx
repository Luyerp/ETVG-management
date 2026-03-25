import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, canManageMembers, formatEntryDate } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { DeleteMemberModal } from "./DeleteMemberModal";
import type { MemberRow, MembersListResponse } from "./types";

export function MemberList() {
  const { user } = useAuth();
  const manage = canManageMembers(user?.roleDescription);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<MembersListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<MemberRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api<MembersListResponse>(`/api/members?page=${page}&limit=9`);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load members");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="members-page">
      <div className="members-toolbar">
        <h2 className="members-toolbar__title">Member Management</h2>
        {manage && (
          <Link to="/members/new" className="members-toolbar__add" title="Add member" aria-label="Add member">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="7" r="4" />
              <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
              <path d="M19 8v6M16 11h6" />
            </svg>
          </Link>
        )}
      </div>

      {loading && <p className="members-muted">Loading…</p>}
      {error && <p className="login-form__error">{error}</p>}

      {!loading && !error && (
        <div className="members-table-wrap">
          <table className="members-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Tel</th>
                <th>Date</th>
                <th>Roles</th>
                <th>Details</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>
                    {m.first_name} {m.last_name}
                  </td>
                  <td>{m.tel ?? "—"}</td>
                  <td>{formatEntryDate(m.entry_date)}</td>
                  <td>{m.role ?? "—"}</td>
                  <td>
                    <Link to={`/members/${m.id}`} className="btn-icon btn-icon--eye" title="View" aria-label="View">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </Link>
                  </td>
                  <td>
                    {manage ? (
                      <div className="members-actions">
                        <Link
                          to={`/members/${m.id}/edit`}
                          className="btn-icon btn-icon--edit"
                          title="Edit"
                          aria-label="Edit"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </Link>
                        <button
                          type="button"
                          className="btn-icon btn-icon--delete"
                          title="Delete"
                          aria-label="Delete"
                          onClick={() => setDeleteTarget(m)}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <span className="members-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="members-pagination">
          <button
            type="button"
            className="members-pagination__btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <span aria-hidden>‹</span> Previous
          </button>
          <button
            type="button"
            className="members-pagination__btn"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next <span aria-hidden>›</span>
          </button>
        </div>
      )}

      <DeleteMemberModal
        member={deleteTarget}
        open={deleteTarget != null}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => void load()}
      />
    </div>
  );
}
