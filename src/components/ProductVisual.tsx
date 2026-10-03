import type { CategoryId } from "@/lib/products";

// Stylized SVG "product shots" so the demo needs no photography.
// Swap for real renders by dropping images in /public and rendering <img> instead.

const palette: Record<CategoryId, [string, string]> = {
  genomics: ["#5a2d82", "#00a3ad"],
  "cell-analysis": ["#0a2240", "#00a3ad"],
  imaging: ["#1b1347", "#7b4fb3"],
  "chromatography-ms": ["#0a2240", "#5a2d82"],
  automation: ["#00676e", "#0a2240"],
  bioprocessing: ["#3f1d5e", "#00a3ad"],
  "sample-storage": ["#0a2240", "#4f7cac"],
  diagnostics: ["#5a2d82", "#c2417a"],
};

function Motif({ category }: { category: CategoryId }) {
  const s = { stroke: "#00a3ad", strokeWidth: 2.2, fill: "none", strokeLinecap: "round" as const };
  switch (category) {
    case "genomics":
      return (
        <g {...s}>
          <path d="M150 112c20 10 40 10 60 0s40-10 60 0" />
          <path d="M150 132c20-10 40-10 60 0s40 10 60 0" stroke="#7b4fb3" />
          {[160, 180, 200, 220, 240, 260].map((x) => (
            <line key={x} x1={x} y1="116" x2={x} y2="128" strokeWidth="1.5" opacity=".7" />
          ))}
        </g>
      );
    case "cell-analysis":
      return (
        <g {...s}>
          {[[175, 118, 9], [205, 128, 6], [232, 114, 8], [255, 130, 5], [190, 134, 4]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? "#7b4fb3" : "#00a3ad"} fillOpacity=".25" />
          ))}
        </g>
      );
    case "imaging":
      return (
        <g {...s}>
          <circle cx="210" cy="122" r="16" />
          <circle cx="210" cy="122" r="8" stroke="#7b4fb3" />
          <circle cx="210" cy="122" r="2" fill="#00a3ad" />
        </g>
      );
    case "chromatography-ms":
      return (
        <g {...s}>
          <path d="M150 136h20l6-24 6 24h14l5-14 5 14h16l7-30 7 30h14l4-8 4 8h12" />
        </g>
      );
    case "automation":
      return (
        <g {...s}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <path key={i} d={`M${166 + i * 12} 108v18l3 6 3-6v-18`} strokeWidth="1.6" />
          ))}
        </g>
      );
    case "bioprocessing":
      return (
        <g {...s}>
          <path d="M198 106v12l-14 22h52l-14-22v-12" />
          <path d="M190 132h40" stroke="#7b4fb3" />
        </g>
      );
    case "sample-storage":
      return (
        <g {...s}>
          <path d="M210 104v36M194 113l32 18M226 113l-32 18" />
        </g>
      );
    case "diagnostics":
      return (
        <g {...s}>
          <path d="M210 108v28M196 122h28" strokeWidth="4" />
          <path d="M150 122h30M240 122h30" strokeWidth="1.5" opacity=".6" />
        </g>
      );
  }
}

/** Instrument body shapes vary by category to give the catalog some visual variety. */
function Body({ category }: { category: CategoryId }) {
  const body = { fill: "#ffffff", stroke: "#cfd8e3", strokeWidth: 1.5 };
  const tall = category === "sample-storage" || category === "bioprocessing";
  if (tall) {
    return (
      <g>
        <rect x="140" y="40" width="140" height="190" rx="12" {...body} />
        <rect x="150" y="90" width="120" height="64" rx="6" fill="#0a2240" />
        <rect x="150" y="166" width="120" height="50" rx="6" fill="#eef2f6" />
        <rect x="262" y="176" width="4" height="30" rx="2" fill="#9aa9bc" />
        <circle cx="160" cy="58" r="4" fill="#00a3ad" />
      </g>
    );
  }
  return (
    <g>
      <rect x="90" y="70" width="240" height="140" rx="14" {...body} />
      <rect x="140" y="92" width="140" height="62" rx="6" fill="#0a2240" />
      <rect x="104" y="170" width="212" height="26" rx="5" fill="#eef2f6" />
      <rect x="104" y="92" width="24" height="62" rx="4" fill="#eef2f6" />
      <rect x="292" y="92" width="24" height="62" rx="4" fill="#eef2f6" />
      <circle cx="304" cy="183" r="5" fill="#00a3ad" />
      <rect x="110" y="179" width="60" height="8" rx="4" fill="#cfd8e3" />
    </g>
  );
}

export function ProductVisual({ category, className = "" }: { category: CategoryId; className?: string }) {
  const [a, b] = palette[category];
  const id = `pv-${category}`;
  return (
    <svg viewBox="0 0 420 260" className={className} role="img" aria-label="Product illustration">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width="420" height="260" fill={`url(#${id})`} />
      <circle cx="360" cy="40" r="90" fill="#ffffff" opacity=".06" />
      <circle cx="40" cy="240" r="70" fill="#ffffff" opacity=".05" />
      <ellipse cx="210" cy="234" rx="140" ry="10" fill="#000" opacity=".18" />
      <Body category={category} />
      <Motif category={category} />
    </svg>
  );
}
