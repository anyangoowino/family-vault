import { useState } from "react";
import { KeyRound, ShieldCheck, Users, Archive } from "lucide-react";
import { Link } from "react-router";
import { PageHeader, KeyChoice } from "../components/UI";
import VaultIllustration from "../components/VaultIllustration";

const keyInfo = [
  {
    id: "you",
    title: "Your key",
    subtitle: "Keep it with you for everyday peace of mind.",
    icon: KeyRound,
  },
  {
    id: "family",
    title: "Family key",
    subtitle: "Held by someone you trust, in a separate place.",
    icon: Users,
  },
  {
    id: "backup",
    title: "Backup key",
    subtitle: "Stored safely for unexpected moments.",
    icon: Archive,
  },
];

export default function Learn() {
  const [picked, setPicked] = useState([]);

  // tap a key to pick it; tapping again removes it; a 3rd pick drops the oldest
  function toggle(id) {
    setPicked((current) => {
      if (current.includes(id)) return current.filter((k) => k !== id);
      const next = [...current, id];
      return next.length > 2 ? next.slice(1) : next;
    });
  }

  const open = picked.length === 2;
  const message =
    picked.length === 0
      ? "Pick two keys to see what happens."
      : picked.length === 1
        ? "One key alone can’t open the vault."
        : "Two keys together: the vault opens.";

  return (
    <section className="page-wrap">
      <PageHeader
        eyebrow="2-of-3, in plain language"
        title="A vault your family can recover—even if one key is lost."
        description="Think of your vault as a safe with three different keys. Any two keys together can open it. One key alone never can."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_.9fr] lg:gap-10">
        <div>
          <VaultIllustration
            open={open}
            lit={3}
            className="aspect-[10/9] w-full"
          />
          <p
            className={`mt-3 rounded-2xl px-4 py-3 text-center text-sm font-bold ${
              open ? "bg-teal/12 text-teal" : "bg-navy/5 text-navy"
            }`}
            aria-live="polite"
          >
            {message}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-500">
            Tap two keys to try it:
          </p>
          {keyInfo.map((key) => (
            <KeyChoice
              key={key.id}
              title={key.title}
              subtitle={key.subtitle}
              icon={key.icon}
              selected={picked.includes(key.id)}
              onClick={() => toggle(key.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-[26px] bg-teal/10 p-6 sm:p-8">
        <ShieldCheck className="text-teal" />
        <h2 className="mt-3 text-xl font-bold text-navy">
          Why this protects you
        </h2>
        <p className="mt-2 max-w-2xl leading-7 text-slate-600">
          A lost or damaged key does not lock everyone out. A single person
          cannot move funds alone. Your written recovery plan tells your family
          exactly which two keys to bring together.
        </p>
      </div>

      <Link to="/setup" className="btn btn-primary mt-7 sm:w-auto">
        Try it in test mode
      </Link>
    </section>
  );
}
