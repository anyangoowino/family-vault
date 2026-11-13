import { Link } from "react-router";

export function LogoMark({ className = "h-9 w-9" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M24 3.8 41 10v12.2c0 10.9-6.8 18.3-17 22C13.8 40.5 7 33.1 7 22.2V10l17-6.2Z"
        fill="#12284C"
      />
      <path
        d="m16.5 27.5 7.4-8 7.6 8M16.5 27.5h15"
        stroke="#75D4C7"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16.5" cy="27.5" r="3.2" fill="#F4A259" />
      <circle cx="24" cy="19.4" r="3.2" fill="#F4A259" />
      <circle cx="31.5" cy="27.5" r="3.2" fill="#F4A259" />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex min-h-12 items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
    >
      <LogoMark />
      <span className="text-[17px] font-bold tracking-[-0.02em] text-navy">
        Family Vault
      </span>
    </Link>
  );
}
