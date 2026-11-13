import { Check, ClipboardCheck, IdCard, Printer, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import QrCode from "../components/QrCode";
import { AppButton, PageHeader } from "../components/UI";
import { createLightningInvoice, payWithFlash } from "../lib/flashApi";

const checklist = [
  "Everyone knows where the recovery plan is kept",
  "Each key holder can still find their key",
  "We practiced a test recovery together",
  "Contact details in the plan are still correct",
];

export default function FlashPack() {
  const [invoice, setInvoice] = useState("");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    createLightningInvoice(21)
      .then((value) => setInvoice(value.invoice))
      .catch(() =>
        setError(
          "We couldn’t create a payment request. Please refresh and try again.",
        ),
      );
  }, []);

  async function pay() {
    setLoading(true);
    setError("");
    try {
      await payWithFlash(invoice);
      setPaid(true);
    } catch {
      setError("The payment didn’t go through. Please try again.");
    }
    setLoading(false);
  }

  return (
    <section className="page-wrap print:p-0">
      <div className="print:hidden">
        <PageHeader
          eyebrow="Flash Recovery Pack"
          title="Keep help close at hand."
          description="An optional extra: a printable emergency card and a yearly practice checklist. Your main recovery plan always stays free."
        />
      </div>

      {!paid ? (
        <div className="glass-card mx-auto max-w-lg text-center print:hidden">
          {invoice ? (
            <div className="mx-auto w-fit rounded-2xl border border-navy/8 p-3">
              <QrCode value={invoice} size={180} />
            </div>
          ) : (
            <div className="mx-auto h-52 w-52 animate-pulse rounded-2xl bg-navy/8" />
          )}
          <h2 className="mt-5 text-2xl font-bold text-navy">
            21 sats with Lightning
          </h2>
          <p className="mt-2 leading-7 text-slate-500">
            Scan the Lightning QR or use Flash for a one-tap demo payment.
          </p>
          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}
          <AppButton
            onClick={pay}
            loading={loading}
            disabled={!invoice}
            className="mt-6"
          >
            <Zap size={18} /> Pay with Flash
          </AppButton>
          <p className="mt-4 text-xs text-slate-400">Powered by Flash</p>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl space-y-5">
          <div className="flex items-center gap-3 rounded-2xl bg-teal/12 p-4 font-bold text-teal print:hidden">
            <Check size={22} /> Payment received in this demo. Your pack is
            unlocked.
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
