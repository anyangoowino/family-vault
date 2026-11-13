import { NavLink, Outlet, useLocation } from "react-router";
import {
  Home,
  KeyRound,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "./Logo";

const desktopLinks = [
  ["How it works", "/learn"],
  ["Recovery", "/recovery"],
  ["Your vault", "/dashboard"],
];

const mobileLinks = [
  { label: "Home", to: "/", icon: Home },
  { label: "Learn", to: "/learn", icon: ShieldCheck },
  { label: "Vault", to: "/dashboard", icon: LayoutDashboard },
  { label: "Recover", to: "/recovery", icon: KeyRound },
];

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // close the phone menu whenever the page changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-cloud text-ink">
      <header className="sticky top-0 z-40 border-b border-navy/8 bg-cloud/88 backdrop-blur-xl">
        <div className="mx-auto flex h-17 max-w-[1100px] items-center justify-between px-5 sm:px-7">
          <Logo />
          <nav
            className="hidden items-center gap-7 md:flex"
            aria-label="Main navigation"
          >
            {desktopLinks.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "text-teal" : ""}`
                }
              >
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/setup"
              className="btn btn-primary min-h-11 px-5 py-2.5"
            >
              Set up your vault
            </NavLink>
          </nav>
          <button
            className="icon-button md:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-navy/8 bg-white px-5 py-4 shadow-lg md:hidden">
            {desktopLinks.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                className="flex min-h-12 items-center border-b border-navy/6 font-semibold text-navy"
              >
                {label}
              </NavLink>
            ))}
            <NavLink to="/setup" className="btn btn-primary mt-4">
              Set up your vault
            </NavLink>
          </div>
        )}
      </header>

      <main className="pb-24 md:pb-0">
        <Outlet />
      </main>

      <footer className="border-t border-navy/8 bg-white pb-20 md:pb-0">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-3 px-5 py-7 text-center text-xs text-slate-500 sm:px-7 md:flex-row md:items-center md:justify-between md:text-left md:text-sm">
          <span>Family vault. Flash. Trezor.</span>
          <div className="flex justify-center gap-6">
            <NavLink to="/flash-pack">Flash pack</NavLink>
            <NavLink to="/settings">Settings</NavLink>
            <NavLink to="/recovery-plan">Recovery plan</NavLink>
          </div>
        </div>
      </footer>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 grid h-[76px] grid-cols-4 border-t border-navy/10 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
        aria-label="Mobile navigation"
      >
        {mobileLinks.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `mobile-nav ${isActive ? "active" : ""}`
            }
          >
            <Icon
              size={21}
              strokeWidth={isActivePath(location.pathname, to) ? 2.4 : 1.8}
            />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function isActivePath(path, to) {
  return to === "/" ? path === "/" : path.startsWith(to);
}
