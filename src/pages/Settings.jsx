import { FileText, RotateCcw, TestTube2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { PageHeader } from "../components/UI";
import { useVault } from "../lib/VaultContext";

export default function Settings() {
  const { vault, clearVault } = useVault();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  function startOver() {
    clearVault();
    navigate("/setup");
  }

  return (
    <section className="page-wrap">
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Keep your practice vault and family plan up to date."
      />

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="glass-card flex items-center gap-4">
          <div className="icon-tile">
            <TestTube2 />
          </div>
          <div className="flex-1">
            <div className="font-bold text-navy">Network</div>
            <div className="text-sm text-slate-500">
              Signet test mode: no real money
            </div>
          </div>
          <span className="badge">Practice only</span>
        </div>

        <Link
          to="/recovery-plan"
          className="glass-card flex items-center gap-4"
        >
          <div className="icon-tile">
            <FileText />
          </div>
          <div className="flex-1">
            <div className="font-bold text-navy">Recovery plan</div>
            <div className="text-sm text-slate-500">
              Review and print your family guide
            </div>
          </div>
        </Link>

        {vault && (
          <div className="glass-card">
            <div className="flex items-center gap-4">
              <div className="icon-tile">
                <RotateCcw />
              </div>
              <div className="flex-1">
                <div className="font-bold text-navy">Start over</div>
                <div className="text-sm text-slate-500">
                  Clear this practice vault and set up a fresh one
                </div>
              </div>
            </div>
            {!confirming ? (
              <button
                onClick={() => setConfirming(true)}
                className="btn btn-secondary mt-4"
              >
                Clear practice vault
              </button>
            ) : (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={startOver}
                  className="btn btn-primary sm:w-auto"
                >
                  Yes, start over
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="btn btn-secondary sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
