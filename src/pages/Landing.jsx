import { motion } from "framer-motion";
import { Check, HeartHandshake, KeyRound, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import VaultIllustration from "../components/VaultIllustration";
import { ArrowLink } from "../components/UI";

const steps = [
  {
    icon: KeyRound,
    title: "Choose three trusted keys",
    text: "One for you, one for family, and one safe backup.",
  },
  {
    icon: ShieldCheck,
    title: "Any two can unlock it",
    text: "No single lost key can put your family’s bitcoin at risk.",
  },
  {
    icon: HeartHandshake,
    title: "Leave a calm, clear plan",
    text: "Your family gets plain-language steps, not a technical puzzle.",
  },
];

export default function Landing() {
  return (
    <>
      <section className="overflow-hidden px-5 pb-16 pt-9 sm:px-7 sm:pt-14 lg:pb-24">
        <div className="mx-auto grid max-w-[1100px] items-center gap-9 lg:grid-cols-[1.02fr_.98fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="eyebrow">
              <span className="h-2 w-2 rounded-full bg-teal" /> Self-custody,
              made human
            </div>
            <h1 className="mt-5 max-w-xl text-[42px] font-bold leading-[1.02] tracking-[-0.05em] text-navy sm:text-6xl">
              Protect your bitcoin.
              <br />
              <span className="text-gradient">Prepare your family.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-7 text-slate-600 sm:text-lg">
              Create a shared family vault and a recovery plan your loved ones
              can actually follow—without giving up control.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/setup" className="btn btn-primary sm:w-auto">
                Create a test vault
              </Link>
              <Link to="/learn" className="btn btn-secondary sm:w-auto">
                See how it works
              </Link>
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Check className="text-teal" size={17} /> Your bitcoin stays in
              your control
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-full bg-teal/10 blur-3xl" />
            <VaultIllustration className="aspect-[10/9] w-full" />
            <div className="glass mt-3 flex items-center gap-3 p-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/12 text-teal">
                <ShieldCheck size={21} />
              </div>
              <div>
                <div className="text-sm font-bold text-navy">
                  You stay in control
                </div>
                <div className="text-xs text-slate-500">
                  Your keys never leave your hands
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-6 sm:px-7">
        <div className="mx-auto grid max-w-[1100px] gap-4 md:grid-cols-2">
          <div className="soft-card">
            <div className="eyebrow">The problem</div>
            <h2 className="mt-3 text-xl font-bold text-navy">
              One lost key can lock a family out.
            </h2>
            <p className="mt-2 leading-7 text-slate-600">
              When a spouse dies or a key goes missing, families, can lose
              access to bitcoin they depended on. Most guides written are
              complex reducing chances for recovering the funds.
            </p>
          </div>
          <div className="soft-card">
            <div className="eyebrow">The solution</div>
            <h2 className="mt-3 text-xl font-bold text-navy">
              Three keys. Any two open the vault.
            </h2>
            <p className="mt-2 leading-7 text-slate-600">
              Family Vault builds a shared 2-of-3 vault and a plain-language
              recovery plan, so nobody is locked out and nobody holds all the
              power.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-7 lg:py-24">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-xl">
            <div className="eyebrow">A safer way to plan ahead</div>
            <h2 className="section-title mt-3">
              Three keys. Two needed.
              <br />
              One less thing to worry about.
            </h2>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <div className="soft-card" key={title}>
                <div className="mb-6 flex items-center justify-between">
                  <div className="icon-tile">
                    <Icon size={24} />
                  </div>
                  <span className="text-4xl font-bold text-navy/8">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-navy">{title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
          <ArrowLink to="/learn" className="mt-6">
            Learn about 2-of-3 protection
          </ArrowLink>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-7 lg:py-18">
        <div className="mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-6 rounded-[30px] bg-navy p-7 text-white sm:p-10 md:flex-row md:items-center">
          <div>
            <div className="text-sm font-bold uppercase tracking-[.14em] text-teal-light">
              Start safely
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              No need to worry family-vault got you covered.
            </h2>
            <p className="mt-2 max-w-xl text-white/65">
              Walk through every step.
            </p>
          </div>
          <Link
            to="/setup"
            className="btn btn-primary w-full shrink-0 md:w-auto"
          >
            Build vault
          </Link>
        </div>
      </section>
    </>
  );
}
