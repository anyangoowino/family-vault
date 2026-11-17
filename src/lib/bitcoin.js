import * as btc from "@scure/btc-signer";
import { HDKey } from "@scure/bip32";
import { generateMnemonic, mnemonicToSeedSync } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";

const NETWORK = btc.TEST_NETWORK; // signet uses the same address format as testnet
const ACCOUNT_PATH = "m/48'/1'/0'/2'"; // multisig, native segwit, test networks

const toHex = (bytes) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

// Make a brand-new practice key. The secret words stay with the caller.
export function generateTestKey() {
  const mnemonic = generateMnemonic(wordlist, 128);
  return { mnemonic, ...describeKey(mnemonic) };
}

// Public details only: a short fingerprint and the public key (xpub).
export function describeKey(mnemonic) {
  const master = HDKey.fromMasterSeed(mnemonicToSeedSync(mnemonic));
  const account = master.derive(ACCOUNT_PATH);
  const fp = (master.fingerprint >>> 0)
    .toString(16)
    .padStart(8, "0")
    .toUpperCase();
  return { fingerprint: fp, xpub: account.publicExtendedKey };
}

function childPubkey(xpub, index = 0) {
  return HDKey.fromExtendedKey(xpub).derive(`m/0/${index}`).publicKey;
}

function sortPubkeys(pubkeys) {
  return [...pubkeys].sort((a, b) => toHex(a).localeCompare(toHex(b)));
}

// Build the 2-of-3 vault from the three public keys.
export function vaultFromXpubs(xpubs, index = 0) {
  if (xpubs.length !== 3)
    throw new Error("A 2-of-3 vault needs exactly three keys.");
  const pubkeys = sortPubkeys(xpubs.map((x) => childPubkey(x, index)));
  const payment = btc.p2wsh(btc.p2ms(2, pubkeys), NETWORK);
  return { address: payment.address, payment, pubkeys };
}

// Sign a recovery with two keys and return the finished transaction.
export function signRecovery({
  mnemonics,
  xpubs,
  utxos,
  destination,
  feeRate = 2,
}) {
  if (mnemonics.length < 2) throw new Error("Two keys are needed to recover.");
  const { payment } = vaultFromXpubs(xpubs);
  const total = utxos.reduce((sum, u) => sum + BigInt(u.value), 0n);
  const vsize = 11 + 105 * utxos.length + 43;
  const fee = BigInt(Math.ceil(vsize * feeRate));
  if (total <= fee + 546n)
    throw new Error("Not enough funds to cover the network fee.");

  const tx = new btc.Transaction();
  for (const u of utxos) {
    tx.addInput({
      txid: u.txid,
      index: u.vout,
      witnessUtxo: { script: payment.script, amount: BigInt(u.value) },
      witnessScript: payment.witnessScript,
    });
  }
  tx.addOutputAddress(destination, total - fee, NETWORK);

  for (const mnemonic of mnemonics) {
    const master = HDKey.fromMasterSeed(mnemonicToSeedSync(mnemonic));
    const child = master.derive(`${ACCOUNT_PATH}/0/0`);
    tx.sign(child.privateKey);
  }
  tx.finalize();
  return {
    hex: tx.hex,
    txid: tx.id,
    fee: Number(fee),
    amount: Number(total - fee),
  };
}

// Coins in the vault. This calls our own server function (api/utxo.js),
// which asks the signet explorer for us, so it works on any connection.
export async function getUtxos(address) {
  const res = await fetch(`/api/utxo?address=${encodeURIComponent(address)}`);
  if (!res.ok)
    throw new Error("Couldn’t check the vault balance. Please try again.");
  return res.json();
}

// Sends the signed transaction through our server function (api/broadcast.js).
export async function broadcast(hex) {
  const res = await fetch("/api/broadcast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hex }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(data.error || "The network rejected this transaction.");
  return data.txid;
}

export function isValidAddress(address) {
  try {
    btc.Address(NETWORK).decode(address.trim());
    return true;
  } catch {
    return false;
  }
}
