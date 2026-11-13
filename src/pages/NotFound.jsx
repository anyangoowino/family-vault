import { Link } from "react-router";
import { LogoMark } from "../components/Logo";

export default function NotFound() {
  return (
    <section className="page-wrap flex min-h-[68vh] items-center justify-center text-center">
      <div>
        <LogoMark className="mx-auto h-16 w-16" />
        <div className="mt-5 text-sm font-bold uppercase tracking-[.18em] text-teal">
          404
        </div>
        <h1 className="mt-2 text-3xl font-bold text-navy">
          This page isn’t in the plan.
        </h1>
        <p className="mt-3 text-slate-500">
          Your vault is safe. Let’s get you back home.
        </p>
        <Link to="/" className="btn btn-primary mt-7">
          Return home
        </Link>
      </div>
    </section>
  );
}
