import { FormEvent, useState } from "react";
import { api } from "../../api/client";
import type { MemberRow } from "./types";

type Props = {
  member: MemberRow | null;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
};

export function DeleteMemberModal({ member, open, onClose, onDeleted }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!open || !member) return null;

  const m = member;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const target = m;
    if (!target) return;
    setError(null);
    setBusy(true);
    try {
      await api(`/api/members/${target.id}`, {
        method: "DELETE",
        body: JSON.stringify({ password }),
      });
      setPassword("");
      onDeleted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete");
    } finally {
      setBusy(false);
    }
  }

  function handleClose() {
    if (!busy) {
      setPassword("");
      setError(null);
      onClose();
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={handleClose}>
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-member-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="delete-member-title" className="modal-dialog__title">
          Delete member
        </h2>
        <p className="modal-dialog__text">
          Enter your account password to remove{" "}
          <strong>
            {m.first_name} {m.last_name}
          </strong>
          .
        </p>
        <form onSubmit={onSubmit} className="modal-dialog__form">
          <label className="login-form__field">
            <span>Your password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="login-form__error">{error}</p>}
          <div className="modal-dialog__actions">
            <button type="button" className="btn btn--ghost" onClick={handleClose} disabled={busy}>
              Cancel
            </button>
            <button type="submit" className="btn btn--danger" disabled={busy}>
              {busy ? "Deleting…" : "Delete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
