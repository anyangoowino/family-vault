import {
  broadcast,
  generateTestKey,
  getUtxos,
  isValidAddress,
  signRecovery,
  vaultFromXpubs,
} from "./bitcoin";

const wait = (ms = 650) => new Promise((resolve) => setTimeout(resolve, ms));

// Practice-key secrets live in their own tab storage.
// These are Signet test keys only. Real keys stay on a hardware wallet.
const SECRETS = "family-vault-test-secrets";

function readSecrets() {
  try {
    return JSON.parse(sessionStorage.getItem(SECRETS)) || {};
  } catch {
    return {};
  }
}

function writeSecrets(map) {
  try {
    sessionStorage.setItem(SECRETS, JSON.stringify(map));
  } catch {
    // Storage can be unavailable.
  }
}

export function clearTestSecrets() {
  try {
    sessionStorage.removeItem(SECRETS);
  } catch {
    // Nothing to clear.
  }
}

// Accept either a fingerprint or a full test key ID.
export function getTestMnemonic(fingerprintOrId) {
  const fingerprint = String(fingerprintOrId ?? "")
    .trim()
    .replace(/^test-/, "");

  return readSecrets()[fingerprint] || null;
}

export async function connectTrezor() {
  await wait(400);

  throw new Error(
    "Trezor support turns on once a device is connected. Use a test key for now.",
  );
}

const names = {
  You: "Your test key",
  Family: "Family test key",
  Backup: "Backup test key",
};

export async function createTestKey(owner = "You") {
  await wait(300);

  const key = generateTestKey();

  return {
    id: `test-${key.fingerprint}`,
    label: `${names[owner] || `${owner} test key`} · ${key.fingerprint}`,
    fingerprint: key.fingerprint,
    xpub: key.xpub,
    mnemonic: key.mnemonic,
  };
}

export async function createVault(keys) {
  await wait(500);

  if (
    !keys ||
    keys.length !== 3 ||
    keys.some((k) => !k?.xpub || !k?.fingerprint)
  ) {
    throw new Error("All three keys are needed to create the vault.");
  }

  const { address } = vaultFromXpubs(keys.map((k) => k.xpub));

  // Keep private practice phrases separate from public vault information.
  const secrets = {};

  keys.forEach((k) => {
    if (k.mnemonic) {
      secrets[k.fingerprint] = k.mnemonic;
    }
  });

  writeSecrets(secrets);

  return {
    address,
    policy: "2 of 3",
    network: "signet",

    // Public details only. Never put secret words in the vault object.
    keys: keys.map(({ id, label, fingerprint, xpub, option }) => ({
      id,
      label,
      fingerprint,
      xpub,
      option,
    })),
  };
}

// Balance in satoshis, split into confirmed and pending.
export async function getBalance(address) {
  const utxos = await getUtxos(address);

  const sum = (list) => list.reduce((total, u) => total + u.value, 0);

  const confirmed = sum(utxos.filter((u) => u.status?.confirmed));

  const pending = sum(utxos.filter((u) => !u.status?.confirmed));

  return {
    confirmed,
    pending,
    total: confirmed + pending,
  };
}

// A new address from the same vault (index 1).
export function getFreshAddress(vault) {
  return vaultFromXpubs(
    vault.keys.map((k) => k.xpub),
    1,
  ).address;
}

// Sign with two keys, then broadcast to Signet.
export async function recoverFunds({ vault, fingerprints, destination }) {
  if (
    !vault?.keys ||
    !Array.isArray(fingerprints) ||
    fingerprints.length !== 2
  ) {
    throw new Error("Choose exactly two keys to continue.");
  }

  if (!isValidAddress(destination)) {
    throw new Error(
      "That doesn't look like a valid Signet address. It should start with tb1.",
    );
  }

  // This now accepts both test-46F20CC9 and 46F20CC9.
  const mnemonics = fingerprints.map(getTestMnemonic);

  if (mnemonics.some((m) => !m)) {
    throw new Error(
      "These practice keys aren't available here. They only work in the tab where the vault was created.",
    );
  }

  const utxos = await getUtxos(vault.address);

  if (!utxos.length) {
    throw new Error(
      "The vault has no test funds yet. Add some on the Fund page first.",
    );
  }

  const signed = signRecovery({
    mnemonics,
    xpubs: vault.keys.map((k) => k.xpub),
    utxos,
    destination: destination.trim(),
  });

  const txid = await broadcast(signed.hex);

  return {
    txid: txid || signed.txid,
    amount: signed.amount,
    fee: signed.fee,
    destination: destination.trim(),
  };
}
