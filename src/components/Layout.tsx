import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "./Sidebar";

const titles: Record<string, { greeting: string; headline: string; frame: string }> = {
  "/": { greeting: "Hi there,", headline: "Welcome to ETVG!", frame: "Dashboard" },
  "/create-activity": { greeting: "Hi there,", headline: "Create Activity", frame: "New activity" },
  "/leave": { greeting: "Hi there,", headline: "Leave Management", frame: "Requests & approvals" },
  "/attendance": { greeting: "Hi there,", headline: "Attendance Tracking", frame: "Time & presence" },
  "/item-delivery": { greeting: "Hi there,", headline: "Item Delivery", frame: "Shipments" },
  "/activity-management": { greeting: "Hi there,", headline: "Activity Management", frame: "Overview" },
  "/voting": { greeting: "Hi there,", headline: "Voting System", frame: "Polls & ballots" },
};

function getHeader(pathname: string) {
  if (pathname === "/members/new") {
    return { greeting: "", headline: "Create member", frame: "" };
  }
  if (/^\/members\/\d+\/edit$/.test(pathname)) {
    return { greeting: "", headline: "Edit member", frame: "" };
  }
  if (/^\/members\/\d+$/.test(pathname)) {
    return { greeting: "", headline: "Member details", frame: "" };
  }
  if (pathname.startsWith("/members")) {
    return { greeting: "", headline: "Member Management", frame: "" };
  }
  return titles[pathname] ?? titles["/"];
}

export function Layout() {
  const { pathname } = useLocation();
  const header = getHeader(pathname);
  const isMembersRoot = pathname === "/members";
  const isMembersArea = pathname.startsWith("/members");
  const showIntro = !isMembersArea;
  const { user } = useAuth();
  const roleLabel = user?.roleDescription?.toUpperCase() ?? "";
  const initials =
    user?.displayName
      ?.split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <header className={"app-header" + (isMembersArea ? " app-header--members" : "")}>
          <div className="app-header__left">
            {showIntro && (
              <div className="app-header__intro">
                <p className="app-header__greeting">{header.greeting}</p>
                <h1 className="app-header__headline">{header.headline}</h1>
                <p className="app-header__frame">{header.frame}</p>
              </div>
            )}
            {isMembersArea && !isMembersRoot && (
              <div className="app-header__intro app-header__intro--solo">
                <h1 className="app-header__headline app-header__headline--sub">{header.headline}</h1>
              </div>
            )}
          </div>
          <div className="app-header__user">
            <div className="app-header__avatar" aria-hidden>
              {initials}
            </div>
            <div className="app-header__user-text">
              <span className="app-header__name">{user?.displayName ?? "—"}</span>
              <span className="app-header__role">{roleLabel}</span>
            </div>
            <button type="button" className="app-header__chevron" aria-label="Account menu">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        </header>
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
