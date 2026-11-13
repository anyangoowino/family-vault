import { LogoMark } from "./Logo";
import { Link } from "react-router";

export default function EmptyVault({
  message = "You haven’t created a vault yet.",
}) {
  return (
    <section className="page-wrap flex min-h-[60vh] items-center justify-center text-center">
      <div className="max-w-sm">
        <LogoMark className="mx-auto h-14 w-14" />
        <h1 className="mt-5 text-2xl font-bold text-navy">No vault yet</h1>
        <p className="mt-2 leading-7 text-slate-500">{message}</p>
        <Link to="/setup" className="btn btn-primary mt-6">
          Set up your vault
        </Link>
      </div>
    </section>
  );
}
