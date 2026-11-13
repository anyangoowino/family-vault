import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { Link } from "react-router";

export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <div className="mb-7 max-w-2xl">
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h1 className="mt-2 text-3xl font-bold leading-[1.08] tracking-[-0.035em] text-navy sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 text-[15px] leading-7 text-slate-600 sm:text-base">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

export function AppButton({
  children,
  variant = "primary",
  loading,
  className = "",
  ...props
}) {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <LoaderCircle className="animate-spin" size={19} /> : null}
      {children}
    </button>
  );
}

export function ArrowLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`inline-flex min-h-12 items-center gap-2 font-bold text-navy hover:text-teal ${className}`}
    >
      {children}
      <ArrowRight size={18} />
    </Link>
  );
}

export function Progress({ current, total = 5 }) {
  return (
    <div className="mb-7">
      <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
        <span>
          Step {current} of {total}
        </span>
        <span>{Math.round((current / total) * 100)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-navy/8">
        <div
          className="h-full rounded-full bg-teal transition-all duration-500"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function KeyChoice({ title, subtitle, selected, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={`choice-card ${selected ? "selected" : ""}`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${selected ? "bg-teal text-white" : "bg-navy/6 text-navy"}`}
      >
        {selected ? <Check size={21} /> : Icon ? <Icon size={21} /> : null}
      </span>
      <span className="text-left">
        <span className="block font-bold text-navy">{title}</span>
        <span className="mt-0.5 block text-sm text-slate-500">{subtitle}</span>
      </span>
    </button>
  );
}
