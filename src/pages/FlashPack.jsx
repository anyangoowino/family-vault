import {
  Check,
  ClipboardCheck,
  Copy,
  IdCard,
  Printer,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import QrCode from "../components/QrCode";
import { AppButton, PageHeader } from "../components/UI";
import { FLASH_ADDRESS, createLightningInvoice } from "../lib/flashApi";

const checklist = [
  "Everyone knows where the recovery plan is kept",
  "Each key holder can still find their key",
  "We practiced a recovery together",
  "Contact details in the plan are still correct",
];

export default function FlashPack() {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setPayment(await createLightningInvoice());
    } catch (err) {
      setPayment(null);
      setError(err.message || "We couldn’t get a payment request from Flash.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function copy(text, label) {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1600);
  }

  return (
    <section className="page-wrap print:p-0">
      <div className="print:hidden">
        <PageHeader
          eyebrow="Family Recovery Pack"
          title="Keep help close at hand."
          description="A printable emergency card and a yearly practice checklist, unlocked with a 21 sat Lightning payment through Flash. Your main recovery plan always stays free."
        />
      </div>

      {!paid ? (
        <div className="glass-card mx-auto max-w-lg text-center print:hidden">
          {loading && (
            <div className="mx-auto h-52 w-52 animate-pulse rounded-2xl bg-navy/8" />
          )}

          {payment && (
            <>
              <div className="mx-auto w-fit rounded-2xl border border-navy/8 p-3">
                <QrCode value={payment.invoice} size={200} />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-navy">
                Pay {payment.amount} sats with Flash
              </h2>
              <p className="mt-2 leading-7 text-slate-500">
                Scan with Flash or any Lightning wallet. Payments go to the
                project’s Flash wallet.
              </p>
              <a
                href={`lightning:${payment.invoice}`}
                className="btn btn-primary mt-6"
              >
                <Zap size={18} /> Open in Flash
              </a>
              <button
                onClick={() => copy(payment.invoice, "invoice")}
                className="btn btn-secondary mt-3"
              >
                <Copy size={18} />
                {copied === "invoice" ? "Copied invoice" : "Copy invoice"}
              </button>
              <button
                onClick={() => setPaid(true)}
                className="mt-5 min-h-12 text-sm font-bold text-teal"
              >
                I’ve paid, unlock my pack
              </button>
            </>
          )}

          {error && (
            <div className="text-left">
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                You can still pay from any Lightning wallet by sending 21 sats
                to this Lightning address:
              </p>
              <button
                onClick={() => copy(FLASH_ADDRESS, "address")}
                className="mt-2 flex min-h-12 w-full items-center justify-between gap-2 rounded-xl bg-navy/5 px-4 text-sm font-bold text-navy"
              >
                {FLASH_ADDRESS}
                <Copy size={16} />
              </button>
              {copied === "address" && (
                <p className="mt-1 text-xs text-teal">Copied</p>
              )}
              <AppButton variant="secondary" onClick={load} className="mt-4">
                <RefreshCw size={17} /> Try again
              </AppButton>
              <button
                onClick={() => setPaid(true)}
                className="mx-auto mt-4 block min-h-12 text-sm font-bold text-teal"
              >
                I’ve paid, unlock my pack
              </button>
            </div>
          )}

          <p className="mt-5 text-xs text-slate-400">
            Lightning payments with Flash
          </p>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl space-y-5">
          <div className="flex items-center gap-3 rounded-2xl bg-teal/12 p-4 font-bold text-teal print:hidden">
            <Check size={22} /> Thank you. Your pack is unlocked.
          </div>

          <div className="rounded-[26px] border-2 border-dashed border-navy/25 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-2 font-bold text-navy">
              <IdCard className="text-teal" size={22} /> Emergency card
            </div>
            <h2 className="mt-3 text-2xl font-bold text-navy">
              If you are reading this, stay calm.
            </h2>
            <ol className="mt-4 list-inside list-decimal space-y-2 leading-7 text-slate-600">
              <li>Find our printed Family Vault Recovery Plan.</li>
              <li>Gather any two of the three key holders.</li>
              <li>Open Family Vault and choose “Recover”.</li>
              <li>Never share a private key or recovery phrase with anyone.</li>
            </ol>
            <p className="mt-4 text-sm text-slate-400">
              Keep this card with your recovery plan.
            </p>
          </div>

          <div className="glass-card print:hidden">
            <div className="flex items-center gap-2 font-bold text-navy">
              <ClipboardCheck className="text-teal" size={22} /> Yearly practice
              checklist
            </div>
            <ul className="mt-4 space-y-3">
              {checklist.map((item) => (
                <li key={item}>
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 text-slate-600">
                    <input type="checkbox" className="h-5 w-5 accent-teal" />
                    {item}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <AppButton
            onClick={() => window.print()}
            variant="secondary"
            className="print:hidden"
          >
            <Printer size={18} /> Print the emergency card
          </AppButton>
        </div>
      )}
    </section>
  );
}
