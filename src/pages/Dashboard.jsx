import {
  ArrowDownToLine,
  ArrowUpRight,
  Copy,
  FileText,
  KeyRound,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import EmptyVault from "../components/EmptyVault";
import QrCode from "../components/QrCode";
import { PageHeader } from "../components/UI";
import { useVault } from "../lib/VaultContext";
import { getBalance } from "../lib/vaultApi";

export default function Dashboard() {
  const { vault } = useVault();
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(null);
  const [checking, setChecking] = useState(false);
  const [balanceError, setBalanceError] = useState("");

  const address = vault?.address;

  const refresh = useCallback(async () => {
    if (!address) return;
    setChecking(true);
    setBalanceError("");
    try {
      setBalance(await getBalance(address));
    } catch (err) {
      setBalanceError(err.message || "Couldn’t check the balance.");
    }
    setChecking(false);
  }, [address]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!vault)
    return (
      <EmptyVault message="Create your family vault first, then it will appear here." />
    );

  const created = new Date(vault.createdAt).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const total = balance?.total ?? 0;
  const funded = total > 0;

  function copy() {
    navigator.clipboard?.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="page-wrap">
      <PageHeader
        eyebrow="Your family vault"
        title="Everything is safe and ready."
        description="This vault uses bitcoin."
      />

      <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-navy to-[#1d6171] p-6 text-white shadow-xl shadow-navy/10 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="badge badge-dark">Signet • Test mode</span>
            <button
              onClick={refresh}
              className="icon-button text-white hover:bg-white/10"
              aria-label="Refresh balance"
            >
              <RefreshCw size={19} className={checking ? "animate-spin" : ""} />
            </button>
          </div>
          <div className="mt-8 text-sm text-white/60">Vault balance</div>
          <div className="mt-1 text-4xl font-bold tracking-tight">
            {(total / 1e8).toFixed(8)} BTC
          </div>
          <div className="mt-1 text-sm text-white/50">
            {checking
              ? "Checking the network…"
              : balanceError
                ? balanceError
                : balance?.pending > 0
                  ? `${balance.pending.toLocaleString()} sats waiting for confirmation`
                  : "Test funds • no real-world value"}
          </div>
          <div className="mt-8 flex gap-3">
            <Link
              to="/fund"
              className="btn bg-white text-navy hover:bg-white/90"
            >
              <ArrowDownToLine size={18} /> Add funds
            </Link>
            <Link
              to="/recovery"
              className="btn border border-white/20 bg-white/8 text-white hover:bg-white/15"
            >
              <ArrowUpRight size={18} /> Recover
            </Link>
          </div>
        </div>

        <div className="glass-card flex flex-col items-center text-center">
          <QrCode value={address} size={150} />
          <div className="mt-3 font-bold text-navy">Your vault address</div>
          <button
            onClick={copy}
            className="mt-2 flex min-h-12 max-w-full items-center gap-2 rounded-xl px-3 text-xs text-slate-500"
          >
            <span className="truncate">{address}</span>
            <Copy size={16} />
            {copied && <span className="text-teal">Copied</span>}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <div className="glass-card">
          <div className="flex items-center justify-between">
            <h2 className="card-title">Recent activity</h2>
            <span className="text-xs font-bold text-slate-400">SIGNET</span>
          </div>

          <div className="mt-5 flex items-center gap-4 border-t border-navy/6 pt-5">
            <div className="icon-tile">
              <ShieldCheck size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-navy">Vault created</div>
              <div className="text-sm text-slate-500">{created}</div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4 border-t border-navy/6 pt-5">
            <div className="icon-tile">
              <ArrowDownToLine size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-navy">
                {funded ? "Test funds received" : "Waiting for test funds"}
              </div>
              <div className="text-sm text-slate-500">
                {funded
                  ? `${total.toLocaleString()} sats in the vault`
                  : "Nothing received yet"}
              </div>
            </div>
            {!funded && (
              <Link to="/fund" className="text-sm font-bold text-teal">
                Add
              </Link>
            )}
          </div>
        </div>

        <div className="glass-card">
          <h2 className="card-title">Recovery readiness</h2>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/12 text-teal">
              <KeyRound size={21} />
            </div>
            <div>
              <div className="font-bold text-navy">
                {vault.keys?.length ?? 3} of 3 keys ready
              </div>
              <div className="text-sm text-slate-500">
                {vault.keys?.map((k) => k.fingerprint).join(" · ")}
              </div>
            </div>
          </div>
          <Link to="/recovery-plan" className="btn btn-secondary mt-5">
            <FileText size={18} /> View recovery plan
          </Link>
        </div>
      </div>
    </section>
  );
}
