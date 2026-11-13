import {
  KeyRound,
  MapPin,
  Printer,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import EmptyVault from "../components/EmptyVault";
import { LogoMark } from "../components/Logo";
import { AppButton, PageHeader } from "../components/UI";
import { useVault } from "../lib/VaultContext";

const keyTitles = [
  "Key 1: the main key",
  "Key 2: the family key",
  "Key 3: the backup key",
];
const blank = "__________________";

export default function RecoveryPlan() {
  const { vault, updateVault } = useVault();

  if (!vault)
    return (
      <EmptyVault message="Create your family vault first, then we’ll write its recovery plan." />
    );

  const plan = vault.plan || {};
  const holders = plan.holders || [{}, {}, {}];

  function setFamily(value) {
    updateVault({ plan: { ...plan, familyName: value } });
  }

  function setHolder(index, field, value) {
    const next = [0, 1, 2].map((i) =>
      i === index
        ? { ...(holders[i] || {}), [field]: value }
        : holders[i] || {},
    );
    updateVault({ plan: { ...plan, holders: next } });
  }

  const today = new Date().toLocaleDateString([], { dateStyle: "long" });

  return (
    <section className="page-wrap print:p-0">
      <div className="print:hidden">
        <PageHeader
          eyebrow="Plain-language guide"
          title="Your family recovery plan"
          description="Fill in the details below. The plan updates as you type. Then print it or save it as a PDF and keep it somewhere trusted."
        />

        <div className="glass-card mx-auto mb-8 max-w-3xl">
          <h2 className="card-title">Details for your family</h2>
          <label
            className="mt-4 block text-sm font-bold text-navy"
            htmlFor="family"
          >
            Family name
          </label>
          <input
            id="family"
            className="input mt-2"
            placeholder="e.g. The Wanjiru family"
            value={plan.familyName || ""}
            onChange={(e) => setFamily(e.target.value)}
          />

          {keyTitles.map((title, i) => (
            <div key={title} className="mt-6 border-t border-navy/8 pt-5">
              <div className="font-bold text-navy">{title}</div>
              <label
                className="mt-3 block text-sm font-semibold text-slate-600"
                htmlFor={`name${i}`}
              >
                Who holds it?
              </label>
              <input
                id={`name${i}`}
                className="input mt-1.5"
                placeholder="Name"
                value={holders[i]?.name || ""}
                onChange={(e) => setHolder(i, "name", e.target.value)}
              />
              <label
                className="mt-3 block text-sm font-semibold text-slate-600"
                htmlFor={`place${i}`}
              >
                Where is it kept?
              </label>
              <input
                id={`place${i}`}
                className="input mt-1.5"
                placeholder="e.g. Home safe, bank box, with Auntie"
                value={holders[i]?.place || ""}
                onChange={(e) => setHolder(i, "place", e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <article className="mx-auto max-w-3xl rounded-[28px] border border-navy/10 bg-white p-6 shadow-sm sm:p-10 print:max-w-none print:border-0 print:p-0 print:shadow-none">
        <div className="flex items-center justify-between border-b border-navy/10 pb-6">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <h1 className="text-xl font-bold text-navy">
                Family Vault Recovery Plan
              </h1>
              <p className="text-sm text-slate-500">
                {plan.familyName || "Our family"} • Signet practice vault
              </p>
            </div>
          </div>
          <ShieldCheck className="hidden text-teal sm:block" />
        </div>

        <h2 className="mt-7 text-xl font-bold text-navy">What this is</h2>
        <p className="mt-2 leading-7 text-slate-600">
          Our family keeps its bitcoin in a shared vault with three keys. Any{" "}
          <strong>two</strong> of the three keys can open it. One key alone
          cannot. This page explains who has each key and what to do if someone
          needs to recover the funds.
        </p>

        <div className="mt-6 rounded-2xl bg-teal/10 p-5">
          <strong className="text-navy">The most important thing:</strong>
          <p className="mt-1 leading-7 text-slate-600">
            You need any two of the three keys below. Never type private words
            into a website, and never share them with someone offering help.
          </p>
        </div>

        <h2 className="mt-8 text-xl font-bold text-navy">Who holds the keys</h2>
        <div className="mt-4 grid gap-4">
          {keyTitles.map((title, i) => (
            <div key={title} className="rounded-2xl border border-navy/10 p-5">
              <div className="flex gap-3">
                <KeyRound className="mt-0.5 shrink-0 text-teal" size={21} />
                <div>
                  <h3 className="font-bold text-navy">{title}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    Held by: {holders[i]?.name || blank}
                  </p>
                  <p className="mt-1 flex items-start gap-2 text-sm font-semibold text-slate-600">
                    <MapPin size={15} className="mt-0.5 shrink-0" />
                    Kept at: {holders[i]?.place || blank}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-8 text-xl font-bold text-navy">
          When two keys are together
        </h2>
        <ol className="mt-3 list-inside list-decimal space-y-3 leading-7 text-slate-600">
          <li>Gather any two of the three people or places above.</li>
          <li>Open Family Vault on a trusted phone or computer.</li>
          <li>Choose “Recover” and select the two keys you have.</li>
          <li>Connect each key only when the guide asks you to.</li>
          <li>
            Check the destination address together, out loud, before sending.
          </li>
        </ol>

        <div className="mt-8 rounded-2xl border border-amber/40 bg-amber/10 p-5">
          <div className="flex items-center gap-2 font-bold text-navy">
            <TriangleAlert size={18} className="text-amber-dark" /> Please never
          </div>
          <ul className="mt-2 list-inside list-disc space-y-1.5 leading-7 text-slate-600">
            <li>
              Share a recovery phrase or private key with anyone, even someone
              who says they work for us.
            </li>
            <li>Rush. A calm, slow recovery is a safe recovery.</li>
            <li>Keep all three keys in one place.</li>
          </ul>
        </div>

        <div className="mt-8 break-all border-t border-navy/10 pt-5 text-xs text-slate-400">
          Written on {today} • Vault address: {vault.address}
        </div>
      </article>

      <AppButton
        onClick={() => window.print()}
        className="mx-auto mt-6 sm:w-auto print:hidden"
      >
        <Printer size={18} /> Print or save as PDF
      </AppButton>
    </section>
  );
}
