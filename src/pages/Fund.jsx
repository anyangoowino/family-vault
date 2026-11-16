import { Check, Copy, Info, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import EmptyVault from "../components/EmptyVault";
import QrCode from "../components/QrCode";
import { AppButton, PageHeader } from "../components/UI";
import { useVault } from "../lib/VaultContext";
import { getBalance } from "../lib/vaultApi";

export default function Fund() {
  const { vault } = useVault();
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(null);

  const address = vault?.address;

  // check the network now, then every 15 seconds while this page is open
  useEffect(() => {
    if (!address) return undefined;
    let active = true;
    async function check() {
      try {
        const result = await getBalance(address);
        if (active) setBalance(result);
      } catch {
        // keep waiting; the next check will try again
      }
    }
    check();
    const timer = setInterval(check, 15000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [address]);

  if (!vault)
    return (
      <EmptyVault message="Create your family vault first, then you can add test funds." />
    );

  const received = balance && balance.total > 0;

  return (
    <section className="page-wrap">
      <PageHeader
        eyebrow="Add test funds"
        title="Fund your practice vault"
        description="Send signet test bitcoin to this address. It has no real-world value."
      />

      <div className="glass-card mx-auto flex max-w-xl flex-col items-center text-center">
        <QrCode value={address} size={210} />
        <div className="mt-5 w-full break-all rounded-xl bg-navy/4 p-3 font-mono text-sm text-navy">
          {address}
        </div>
        <AppButton
          variant="secondary"
          className="mt-4"
          onClick={() => {
            navigator.clipboard?.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
        >
          <Copy size={18} />
          {copied ? "Copied address" : "Copy address"}
        </AppButton>

        {received ? (
          <div className="mt-6 w-full rounded-2xl bg-teal/12 p-5">
            <div className="flex items-center justify-center gap-2 font-bold text-teal">
              <Check size={20} /> Test funds
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {balance.total.toLocaleString()} sats
              {balance.pending > 0
                ? " (some still waiting for confirmation)"
                : ""}
            </p>
            <Link to="/dashboard" className="btn btn-primary mt-4">
              Go to my vault
            </Link>
          </div>
        ) : (
          <div className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-navy/5 p-4 text-sm font-semibold text-navy">
            <LoaderCircle size={18} className="animate-spin text-teal" />
            Waiting for your deposit…
          </div>
        )}

        <ol className="mt-6 w-full space-y-3 text-left text-sm leading-6 text-slate-600">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/12 text-xs font-bold text-teal">
              1
            </span>
            Copy the address above.
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/12 text-xs font-bold text-teal">
              2
            </span>
            Keep this page open..
          </li>
        </ol>

        <div className="mt-5 flex gap-2 rounded-xl bg-amber/12 p-4 text-left text-sm leading-6 text-slate-600">
          <Info className="mt-0.5 shrink-0 text-amber-dark" size={18} />
          It updates by itself when the coins arrive.
        </div>
      </div>
    </section>
  );
}
