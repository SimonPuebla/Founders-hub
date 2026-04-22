"use client";

const FLIGHTS = [
  { from: "MAD", to: "LIS", airline: "Iberia", date: "Apr 30", time: "11:25", iso: "2026-04-30" },
  { from: "LIS", to: "MAD", airline: "Iberia", date: "May 3", time: "12:30", iso: "2026-05-03" },
  { from: "MAD", to: "MIA", airline: "Iberia", date: "May 3", time: "16:25", iso: "2026-05-03" },
  { from: "MIA", to: "EZE", airline: "Delta", date: "May 9", time: "23:55", iso: "2026-05-09" },
];

const AIRLINE_COLOR: Record<string, string> = {
  Iberia: "var(--blue)",
  Delta: "var(--red)",
};

function daysUntil(isoDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(isoDate);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function UpcomingTripsWidget() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = FLIGHTS.filter((f) => new Date(f.iso) >= today);

  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Upcoming Trips</p>
        {upcoming.length > 0 && (
          <span
            className="text-[11px] font-medium px-1.5 py-0.5 rounded-md tabular-nums"
            style={{ color: "var(--blue)", background: "var(--blue-light)" }}
          >
            {upcoming.length}
          </span>
        )}
      </div>

      {upcoming.length === 0 ? (
        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>No upcoming flights.</p>
      ) : (
        <div className="space-y-0.5">
          {upcoming.map((f, i) => {
            const days = daysUntil(f.iso);
            const isToday = days === 0;
            const isSoon = days <= 3;
            const airlineColor = AIRLINE_COLOR[f.airline] || "var(--text-muted)";

            return (
              <div
                key={i}
                className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg transition-colors"
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {/* Route */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>
                      {f.from}
                    </span>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>→</span>
                    <span className="text-[13px] font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>
                      {f.to}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] font-medium" style={{ color: airlineColor }}>
                      {f.airline}
                    </span>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>·</span>
                    <span className="text-[11px] tabular-nums" style={{ color: "var(--text-muted)" }}>
                      {f.date} {f.time}
                    </span>
                  </div>
                </div>

                {/* Days badge */}
                <span
                  className="text-[11px] font-medium px-1.5 py-0.5 rounded tabular-nums shrink-0"
                  style={{
                    color: isToday ? "var(--red)" : isSoon ? "var(--amber)" : "var(--text-muted)",
                    background: isToday ? "var(--red-light)" : isSoon ? "var(--amber-light)" : "var(--bg)",
                  }}
                >
                  {isToday ? "Today" : `${days}d`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
