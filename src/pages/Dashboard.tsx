export function Dashboard() {
  return (
    <div className="dashboard">
      <div className="stat-row">
        <article className="stat-card stat-card--gradient">
          <p className="stat-card__label">Activity</p>
          <p className="stat-card__value">$540.50</p>
          <div className="stat-card__spark" aria-hidden />
        </article>
        <article className="stat-card stat-card--light">
          <p className="stat-card__label">Spent this month</p>
          <p className="stat-card__value">$682.50</p>
          <span className="stat-card__mini-icon" aria-hidden>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="14" width="4" height="6" rx="1" fill="#624bff" opacity="0.35" />
              <rect x="10" y="10" width="4" height="10" rx="1" fill="#624bff" opacity="0.55" />
              <rect x="16" y="6" width="4" height="14" rx="1" fill="#624bff" />
            </svg>
          </span>
        </article>
        <article className="stat-card stat-card--gradient">
          <p className="stat-card__label">Activity</p>
          <p className="stat-card__value">$540.50</p>
          <div className="stat-card__spark" aria-hidden />
        </article>
        <article className="stat-card stat-card--light">
          <p className="stat-card__label">Earnings</p>
          <p className="stat-card__value">$350.40</p>
          <span className="stat-card__mini-icon" aria-hidden>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="14" width="4" height="6" rx="1" fill="#624bff" opacity="0.35" />
              <rect x="10" y="10" width="4" height="10" rx="1" fill="#624bff" opacity="0.55" />
              <rect x="16" y="6" width="4" height="14" rx="1" fill="#624bff" />
            </svg>
          </span>
        </article>
        <article className="stat-card stat-card--gradient">
          <p className="stat-card__label">Activity</p>
          <p className="stat-card__value">$540.50</p>
          <div className="stat-card__spark" aria-hidden />
        </article>
      </div>

      <section className="balance-panel">
        <div className="balance-panel__head">
          <div className="balance-panel__title-row">
            <h2 className="balance-panel__title">Balance</h2>
            <span className="balance-panel__badge balance-panel__badge--ok">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              On track
            </span>
          </div>
          <label className="balance-panel__period">
            <span className="visually-hidden">Period</span>
            <select defaultValue="monthly" className="balance-panel__select">
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </label>
        </div>

        <div className="balance-panel__body">
          <div className="balance-panel__float balance-panel__float--left">
            <span className="balance-panel__float-label">Sales</span>
            <span className="balance-panel__float-value">43.50%</span>
            <span className="balance-panel__pill balance-panel__pill--up">+2.45%</span>
          </div>
          <div className="balance-panel__float balance-panel__float--right">
            <span className="balance-panel__float-label">Balance</span>
            <span className="balance-panel__float-value">$52,422</span>
            <span className="balance-panel__pill balance-panel__pill--down">−4.75%</span>
          </div>

          <div className="balance-chart" aria-hidden>
            <svg className="balance-chart__svg" viewBox="0 0 800 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#624bff" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#624bff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,140 C80,120 120,160 200,100 S360,40 440,80 S600,20 800,50 L800,200 L0,200 Z"
                fill="url(#areaFill)"
              />
              <path
                d="M0,140 C80,120 120,160 200,100 S360,40 440,80 S600,20 800,50"
                fill="none"
                stroke="#624bff"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}
