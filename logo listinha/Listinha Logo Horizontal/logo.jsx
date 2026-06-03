// logo.jsx — "Listinha" wordmark + rubber-hose cartoon shopping cart.
// Exports to window: Cart, LogoIntegrated, LogoHorizontal.

const INK = "#241712";
const GRAY = "#B4BCC0";
const GRAY_DK = "#8B949A";
const CREAM = "#F6E9CF";
const RED = "#E8584A";
const CHEEK = "#F2A99C";

// ---- The little guy: a 3/4-front shopping cart with a happy 1930s face ----
function Cart({ size = 200, bob = true, style }) {
  return (
    <svg
      viewBox="0 0 200 196"
      width={size}
      height={(size * 196) / 200}
      style={{ display: "block", overflow: "visible", ...style }}
      aria-label="Carrinho de compras sorridente"
    >
      {/* ground shadow */}
      <ellipse className={bob ? "cart-shadow" : ""} cx="100" cy="184" rx="58" ry="9" fill="rgba(36,23,18,.16)" />

      <g className={bob ? "cart-bob" : ""}>
        {/* push handle */}
        <path
          d="M 48 60 L 28 38 Q 24 33 17 33 L 7 33"
          fill="none"
          stroke={INK}
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* basket */}
        <polygon
          points="46,57 154,57 136,150 64,150"
          fill={GRAY}
          stroke={INK}
          strokeWidth="7.5"
          strokeLinejoin="round"
        />
        {/* bottom frame + struts to wheels */}
        <line x1="60" y1="153" x2="140" y2="153" stroke={INK} strokeWidth="6.5" strokeLinecap="round" />
        <line x1="74" y1="153" x2="73" y2="164" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <line x1="126" y1="153" x2="127" y2="164" stroke={INK} strokeWidth="6" strokeLinecap="round" />

        {/* ---- FACE (friendly smiley) ---- */}
        {/* cheeks */}
        <circle cx="70" cy="112" r="8.5" fill={CHEEK} opacity="0.9" />
        <circle cx="130" cy="112" r="8.5" fill={CHEEK} opacity="0.9" />
        {/* eyes (blink) */}
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
        {/* simple happy smile */}
        <path d="M 79 115 Q 100 138 121 115" fill="none" stroke={INK} strokeWidth="6.5" strokeLinecap="round" />
      </g>

      {/* wheels (spin) */}
      <g className="cart-wheel" style={{ transformOrigin: "73px 168px" }}>
        <Wheel cx={73} cy={168} />
      </g>
      <g className="cart-wheel" style={{ transformOrigin: "127px 168px" }}>
        <Wheel cx={127} cy={168} />
      </g>
    </svg>
  );
}

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

// ---- Version B: horizontal lockup, cart to the right ----
function LogoHorizontal({ fontSize = 96 }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: fontSize * 0.18 }}>
      <span className="word">Listinha</span>
      <Cart size={fontSize * 1.55} style={{ marginBottom: -fontSize * 0.06 }} />
    </div>
  );
}

// ---- Version A: cart integrated as the dot of the first "i" ----
function LogoIntegrated({ fontSize = 104 }) {
  return (
    <div className="word" style={{ display: "flex", alignItems: "flex-end", lineHeight: 1 }}>
      <span>L</span>
      <span
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          margin: `0 ${fontSize * 0.012}px`,
        }}
      >
        <Cart size={fontSize * 0.78} bob={true} style={{ marginBottom: fontSize * 0.02 }} />
        <span
          className="i-stem"
          style={{
            width: fontSize * 0.165,
            height: fontSize * 0.5,
            borderRadius: fontSize * 0.08,
          }}
        />
      </span>
      <span>stinha</span>
    </div>
  );
}

Object.assign(window, { Cart, LogoHorizontal, LogoIntegrated });
