import { createContext, useContext, useEffect, useState } from "react";
import { clearTestSecrets } from "./vaultApi";

const VaultContext = createContext(null);
const STORAGE_KEY = "family-vault-public";

// Only PUBLIC details are kept here (address, key labels). Never private keys.
function load() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function VaultProvider({ children }) {
  const [vault, setVault] = useState(load);

  useEffect(() => {
    try {
      if (vault) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // storage can be unavailable; the app still works without it
    }
  }, [vault]);

  const saveVault = (data) =>
    setVault({ ...data, createdAt: new Date().toISOString() });
  const clearVault = () => {
    clearTestSecrets();
    setVault(null);
  };
  const updateVault = (patch) =>
    setVault((current) => (current ? { ...current, ...patch } : current));

  return (
    <VaultContext.Provider
      value={{ vault, saveVault, clearVault, updateVault }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (!context) throw new Error("useVault must be used inside VaultProvider");
  return context;
}
