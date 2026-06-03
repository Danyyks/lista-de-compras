import "./Logo.css";

const INK = "#241712";
const GRAY = "#B4BCC0";
const GRAY_DK = "#8B949A";
const CREAM = "#F6E9CF";
const RED = "#E8584A";
const CHEEK = "#F2A99C";

function Wheel({ cx, cy }) {
  const r = 13;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={INK} strokeWidth="5.5" />
      <g stroke={INK} strokeWidth="2.6" strokeLinecap="round">
        <line x1={cx - r + 3} y1={cy} x2={cx + r - 3} y2={cy} />
        <line x1={cx} y1={cy - r + 3} x2={cx} y2={cy + r - 3} />
        <line x1={cx - 7} y1={cy - 7} x2={cx + 7} y2={cy + 7} />
        <line x1={cx - 7} y1={cy + 7} x2={cx + 7} y2={cy - 7} />
      </g>
      <circle cx={cx} cy={cy} r="3.4" fill={RED} stroke={INK} strokeWidth="1.6" />
    </g>
  );
}

export function Cart({ size = 200, bob = true, style }) {
  return (
    <svg
      viewBox="0 0 200 196"
      width={size}
      height={(size * 196) / 200}
      style={{ display: "block", overflow: "visible", ...style }}
      aria-hidden="true"
    >
      <ellipse className={bob ? "cart-shadow" : ""} cx="100" cy="184" rx="58" ry="9" fill="rgba(36,23,18,.16)" />

      <g className={bob ? "cart-bob" : ""}>
        <path
          d="M 48 60 L 28 38 Q 24 33 17 33 L 7 33"
          fill="none"
          stroke={INK}
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon
          points="46,57 154,57 136,150 64,150"
          fill={GRAY}
          stroke={INK}
          strokeWidth="7.5"
          strokeLinejoin="round"
        />
        <line x1="60" y1="153" x2="140" y2="153" stroke={INK} strokeWidth="6.5" strokeLinecap="round" />
        <line x1="74" y1="153" x2="73" y2="164" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <line x1="126" y1="153" x2="127" y2="164" stroke={INK} strokeWidth="6" strokeLinecap="round" />

        <circle cx="70" cy="112" r="8.5" fill={CHEEK} opacity="0.9" />
        <circle cx="130" cy="112" r="8.5" fill={CHEEK} opacity="0.9" />
        <g className="cart-eyes">
          <g>
            <ellipse cx="85" cy="94" rx="7" ry="9" fill={INK} />
            <circle cx="82.4" cy="90.4" r="2.4" fill="#fff" />
          </g>
          <g>
            <ellipse cx="115" cy="94" rx="7" ry="9" fill={INK} />
            <circle cx="112.4" cy="90.4" r="2.4" fill="#fff" />
          </g>
        </g>
        <path d="M 79 115 Q 100 138 121 115" fill="none" stroke={INK} strokeWidth="6.5" strokeLinecap="round" />
      </g>

      <g className="cart-wheel" style={{ transformOrigin: "73px 168px" }}>
        <Wheel cx={73} cy={168} />
      </g>
      <g className="cart-wheel" style={{ transformOrigin: "127px 168px" }}>
        <Wheel cx={127} cy={168} />
      </g>
    </svg>
  );
}

export function LogoHorizontal({ fontSize = 48 }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: fontSize * 0.18 }}>
      <span className="logo-word" style={{ fontSize }}>
        Listinha
      </span>
      <Cart size={fontSize * 1.55} style={{ marginBottom: -fontSize * 0.06 }} />
    </div>
  );
}
