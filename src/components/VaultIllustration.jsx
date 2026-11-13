export default function VaultIllustration({
  open = false,
  lit = 3,
  className = "",
}) {
  const keys = [
    { label: "You", x: 110 },
    { label: "Family", x: 200 },
    { label: "Backup", x: 290 },
  ];

  return (
    <div
      className={`overflow-hidden rounded-[28px] bg-gradient-to-br from-[#e6f4f1] via-[#f7f9fb] to-[#fdeedd] ${className}`}
    >
      <svg
        viewBox="0 0 400 360"
        className="h-full w-full"
        role="img"
        aria-label={
          open
            ? "A family vault, opened by two of its three keys"
            : "A closed family vault with three keys: You, Family and Backup"
        }
      >
        <defs>
          <linearGradient id="vf-door" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#245a70" />
            <stop offset="1" stopColor="#173f61" />
          </linearGradient>
          <radialGradient id="vf-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0" stopColor="#F4A259" stopOpacity="0.55" />
            <stop offset="1" stopColor="#F4A259" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* soft background circles */}
        <circle cx="62" cy="72" r="46" fill="#2A9D8F" opacity="0.09" />
        <circle cx="346" cy="250" r="62" fill="#F4A259" opacity="0.12" />

        {/* ground shadow and feet */}
        <ellipse
          cx="200"
          cy="268"
          rx="124"
          ry="10"
          fill="#12284C"
          opacity="0.1"
        />
        <rect x="132" y="250" width="28" height="14" rx="5" fill="#0e2040" />
        <rect x="240" y="250" width="28" height="14" rx="5" fill="#0e2040" />

        {/* vault body */}
        <rect x="100" y="50" width="200" height="205" rx="30" fill="#12284C" />

        {/* inside of the vault */}
        <rect x="116" y="66" width="168" height="173" rx="20" fill="#0b1b2b" />
        <rect
          x="116"
          y="66"
          width="168"
          height="173"
          rx="20"
          fill="url(#vf-glow)"
          style={{ opacity: open ? 1 : 0, transition: "opacity 700ms ease" }}
        />
        <g
          style={{
            opacity: open ? 1 : 0,
            transition: "opacity 700ms ease 200ms",
          }}
        >
          <circle cx="200" cy="152" r="26" fill="#F4A259" />
          <text
            x="200"
            y="163"
            textAnchor="middle"
            fontSize="30"
            fontWeight="800"
            fill="#12284C"
          >
            ₿
          </text>
        </g>

        {/* door (swings open from the left edge) */}
        <g
          style={{
            transformBox: "fill-box",
            transformOrigin: "left center",
            transform: open ? "scaleX(0.14)" : "scaleX(1)",
            transition: "transform 900ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <rect
            x="116"
            y="66"
            width="168"
            height="173"
            rx="20"
            fill="url(#vf-door)"
            stroke="#75D4C7"
            strokeOpacity="0.35"
          />
          <circle
            cx="200"
            cy="152"
            r="34"
            fill="none"
            stroke="#75D4C7"
            strokeWidth="6"
          />
          <line
            x1="166"
            y1="152"
            x2="234"
            y2="152"
            stroke="#F4A259"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <line
            x1="200"
            y1="118"
            x2="200"
            y2="186"
            stroke="#F4A259"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle cx="200" cy="152" r="8" fill="#F4A259" />
        </g>

        {/* hinges */}
        <rect x="111" y="95" width="9" height="24" rx="4" fill="#75D4C7" />
        <rect x="111" y="186" width="9" height="24" rx="4" fill="#75D4C7" />

        {/* the three keys */}
        {keys.map((key, i) => (
          <g
            key={key.label}
            style={{
              transform: `translate(${key.x - 20}px, ${open ? 286 : 294}px)`,
              transition: "transform 600ms ease, opacity 400ms ease",
              opacity: i < lit ? 1 : 0.35,
            }}
          >
            <circle
              cx="9"
              cy="0"
              r="9"
              fill="none"
              stroke="#F4A259"
              strokeWidth="4"
            />
            <line
              x1="18"
              y1="0"
              x2="40"
              y2="0"
              stroke="#F4A259"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1="33"
              y1="0"
              x2="33"
              y2="8"
              stroke="#F4A259"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1="40"
              y1="0"
              x2="40"
              y2="8"
              stroke="#F4A259"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <text
              x="20"
              y="32"
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="#12284C"
            >
              {key.label}
            </text>
          </g>
        ))}

        <text
          x="200"
          y="350"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#64748b"
        >
          Any two keys open the vault
        </text>
      </svg>
    </div>
  );
}
