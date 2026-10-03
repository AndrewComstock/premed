export function Logo({ light = false }: { light?: boolean }) {
  const text = light ? "#ffffff" : "#0a2240";
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="Halcyra Life Sciences">
      <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
        <defs>
          <linearGradient id="hl-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00a3ad" />
            <stop offset="1" stopColor="#5a2d82" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="19" fill="url(#hl-g)" />
        <path
          d="M12 9c8 5 8 17 16 22M28 9c-8 5-8 17-16 22"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M15 15h10M15 25h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".8" />
      </svg>
      <span className="leading-none">
        <span className="block font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight" style={{ color: text }}>
          Halcyra
        </span>
        <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.22em]" style={{ color: light ? "#b9c6d8" : "#3c4f6b" }}>
          Life Sciences
        </span>
      </span>
    </span>
  );
}
