import {
  Check,
  ChevronLeft,
  HardDrive,
  KeyRound,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { AppButton, KeyChoice, Progress } from "../components/UI";
import VaultIllustration from "../components/VaultIllustration";
import { connectTrezor, createVault, createTestKey } from "../lib/vaultApi";
import { useVault } from "../lib/VaultContext";

const stepCopy = [
  {
    title: "Let’s build your safety net",
    text: "You’ll choose three keys in different places. We’ll guide you one at a time.",
  },
  {
    title: "Choose your key",
    text: "This is the key you keep close. Use a device or practice with a safe test key.",
  },
  {
    title: "Choose a family key",
    text: "Pick someone you trust. They cannot access the vault without one more key.",
  },
  {
    title: "Choose a backup key",
    text: "Keep this away from the other two, in a place your recovery plan names.",
  },
  {
    title: "Everything looks ready",
    text: "Review your three-key plan. We’ll create a test vault on signet.",
  },
];

const owners = { key1: "You", key2: "Family", key3: "Backup" };

export default function Wizard() {
  const { saveVault } = useVault();
  const [step, setStep] = useState(1);
  const [keys, setKeys] = useState({});
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState("");

  async function choose(type, option) {
    setLoading(true);
    setError("");
    try {
      const result =
        option === "trezor"
          ? await connectTrezor()
          : await createTestKey(owners[type]);
      setKeys((current) => ({ ...current, [type]: { ...result, option } }));
    } catch {
      setError(
        "We couldn’t add that key. Please try again, or use a test key.",
      );
    }
    setLoading(false);
  }

  async function next() {
    if (step < 5) return setStep((value) => value + 1);
    setLoading(true);
    setError("");
    try {
      const result = await createVault([keys.key1, keys.key2, keys.key3]);
      saveVault(result);
      setCreated(true);
    } catch {
      setError("We couldn’t create the vault. Please try again.");
    }
    setLoading(false);
  }

  if (created)
    return (
      <section className="page-wrap flex min-h-[70vh] items-center justify-center">
        <div className="glass-card w-full max-w-lg text-center">
          <VaultIllustration
            open
            lit={3}
            className="mx-auto mb-5 aspect-[10/9] w-full max-w-xs"
          />
          <div className="badge">Signet • Test mode</div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy">
            Your family vault is ready.
          </h1>
          <p className="mt-3 leading-7 text-slate-600">
            No real bitcoin was used. Explore the dashboard, then practice a
            recovery together.
          </p>
          <Link to="/dashboard" className="btn btn-primary mt-7">
            Open my vault
          </Link>
          <Link to="/recovery-plan" className="btn btn-secondary mt-3">
            View recovery plan
          </Link>
        </div>
      </section>
    );

  const copy = stepCopy[step - 1];
  const currentKey = `key${step - 1}`;
  const canContinue = step === 1 || step === 5 || Boolean(keys[currentKey]);
  const keysAdded = Object.keys(keys).length;

  return (
    <section className="page-wrap">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={() => setStep((value) => Math.max(1, value - 1))}
            className={`icon-button ${step === 1 ? "invisible" : ""}`}
            aria-label="Go back"
          >
            <ChevronLeft />
          </button>
          <span className="badge">Test mode • Signet</span>
        </div>

        <Progress current={step} />

        <VaultIllustration
          lit={keysAdded}
          className="mx-auto mb-5 aspect-[10/9] max-h-56 w-full"
        />

        <div className="glass-card">
          <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-teal/12 text-teal">
            {step === 1 ? (
              <ShieldCheck />
            ) : step === 5 ? (
              <Check />
            ) : (
              <KeyRound />
            )}
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-[-.035em] text-navy">
            {copy.title}
          </h1>
          <p className="mt-3 leading-7 text-slate-600">{copy.text}</p>

          {step === 1 && (
            <div className="mt-6 rounded-2xl bg-navy/4 p-5">
              {[
                "About 5 minutes",
                "No real funds needed",
                "Nothing private is stored",
              ].map((item) => (
                <div
                  key={item}
                  className="flex min-h-9 items-center gap-3 text-sm font-semibold text-navy"
                >
                  <Check size={17} className="text-teal" />
                  {item}
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="mt-6 grid gap-3">
              <KeyChoice
                icon={HardDrive}
                title="Connect Trezor"
                subtitle="Use your hardware wallet"
                selected={keys.key1?.option === "trezor"}
                onClick={() => choose("key1", "trezor")}
              />
              <KeyChoice
                icon={KeyRound}
                title="Use a test key"
                subtitle="Best for your first practice"
                selected={keys.key1?.option === "test"}
                onClick={() => choose("key1", "test")}
              />
            </div>
          )}

          {step === 3 && (
            <div className="mt-6 grid gap-3">
              <KeyChoice
                icon={UserRound}
                title="Family member’s test key"
                subtitle="For a partner, sister, or trusted person"
                selected={keys.key2?.option === "family"}
                onClick={() => choose("key2", "family")}
              />
              <KeyChoice
                icon={HardDrive}
                title="Connect their Trezor"
                subtitle="They should be beside you"
                selected={keys.key2?.option === "trezor"}
                onClick={() => choose("key2", "trezor")}
              />
            </div>
          )}

          {step === 4 && (
            <div className="mt-6 grid gap-3">
              <KeyChoice
                icon={KeyRound}
                title="Create backup test key"
                subtitle="Practice storing it separately"
                selected={keys.key3?.option === "backup"}
                onClick={() => choose("key3", "backup")}
              />
              <KeyChoice
                icon={HardDrive}
                title="Use another Trezor"
                subtitle="A dedicated backup device"
                selected={keys.key3?.option === "trezor"}
                onClick={() => choose("key3", "trezor")}
              />
            </div>
          )}

          {step === 5 && (
            <div className="mt-6 grid gap-3">
              {["Your key", "Family key", "Backup key"].map((label, i) => (
                <div
                  className="flex items-center gap-3 rounded-2xl border border-navy/8 bg-white p-4"
                  key={label}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/12 text-teal">
                    <Check size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-navy">{label}</div>
                    <div className="text-sm text-slate-500">
                      {keys[`key${i + 1}`]?.label || "Test key ready"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <AppButton
            onClick={next}
            loading={loading}
            disabled={!canContinue}
            className="mt-7"
          >
            {step === 5 ? "Create my test vault" : "Continue"}
          </AppButton>
        </div>
      </div>
    </section>
  );
}
