import {
  Check,
  ExternalLink,
  HardDrive,
  KeyRound,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import EmptyVault from "../components/EmptyVault";
import { AppButton, KeyChoice, PageHeader } from "../components/UI";
import VaultIllustration from "../components/VaultIllustration";
import { useVault } from "../lib/VaultContext";
import { getFreshAddress, recoverFunds } from "../lib/vaultApi";

const roles = [
  { id: "yours", title: "Your key", icon: HardDrive },
  { id: "family", title: "Family key", icon: KeyRound },
  { id: "backup", title: "Backup key", icon: KeyRound },
];

export default function Recovery() {
  const { vault } = useVault();
  const [selected, setSelected] = useState([]);
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  if (!vault)
    return (
      <EmptyVault message="Create your family vault first, then you can practice a recovery." />
    );

  const open = selected.length === 2;
  const choices = roles.map((role, i) => ({
    ...role,
    subtitle: vault.keys?.[i]?.label || "Key ready",
  }));

  // pick up to two keys; tap again to remove one
  function toggle(id) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : current.length < 2
          ? [...current, id]
          : current,
    );
  }

  function fillFreshAddress() {
    setError("");
    setDestination(getFreshAddress(vault));
  }

  async function recover() {
    setLoading(true);
    setError("");
    try {
      const fingerprints = selected.map(
        (id) =>
          vault.keys[roles.findIndex((role) => role.id === id)].fingerprint,
      );
      setResult(await recoverFunds({ vault, fingerprints, destination }));
    } catch (err) {
      setError(err.message || "Recovery didn’t work. Please try again.");
    }
    setLoading(false);
  }

  return (
    <section className="page-wrap">
      <PageHeader
        eyebrow="Guided recovery"
        title="Bring any two keys together."
        description="Choose the two keys you have. When both are ready, the vault opens and you can choose where your test funds go."
      />

      <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <VaultIllustration
            open={open}
            lit={3}
            className="aspect-[10/9] w-full"
          />
        </div>

        <div className="glass-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="card-title">1. Choose two keys</h2>
            <span className={`badge ${open ? "bg-teal/12 text-teal" : ""}`}>
              {selected.length} of 2 chosen
            </span>
          </div>

          <div className="grid gap-3">
            {choices.map((choice) => (
              <KeyChoice
                key={choice.id}
                {...choice}
                selected={selected.includes(choice.id)}
                onClick={() => toggle(choice.id)}
              />
            ))}
          </div>

          <div
            className={`mt-7 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-35"}`}
          >
            <h2 className="card-title">2. Where should funds go?</h2>
            <label
              className="mt-4 block text-sm font-bold text-navy"
              htmlFor="destination"
            >
              Destination address (signet)
            </label>
            <input
              id="destination"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="Paste a signet address (starts with tb1)"
              className="input mt-2"
            />
            <button
              onClick={fillFreshAddress}
              className="btn btn-secondary mt-3"
            >
              <Wallet size={18} /> Use a fresh practice address
            </button>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              The practice address belongs to this same vault, so it’s safe for
              a demo.
            </p>

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}

            <AppButton
              className="mt-5"
              onClick={recover}
              loading={loading}
              disabled={!destination || !open}
            >
              Recover funds
            </AppButton>
          </div>
        </div>
      </div>

      {result && (
        <div className="modal-backdrop">
          <div className="bottom-sheet">
            <button
              className="absolute right-4 top-4 icon-button"
              onClick={() => setResult(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal/12 text-teal">
              <Check size={26} />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-navy">
              Funds are on their way
            </h2>
            <p className="mt-2 leading-7 text-slate-600">
              Two keys approved, and the transaction was sent to the signet
              network. {result.amount.toLocaleString()} sats are moving (network
              fee {result.fee.toLocaleString()} sats).
            </p>
            <a
              href={`https://mempool.space/signet/tx/${result.txid}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex min-h-12 items-center gap-2 break-all text-sm font-bold text-teal"
            >
              <ExternalLink size={16} className="shrink-0" />
              View it on the signet explorer
            </a>
            <Link to="/dashboard" className="btn btn-primary mt-4">
              Return to vault
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
