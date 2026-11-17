# Family Vault

**A self-custody inheritance planner for families.** Set up a shared bitcoin vault that any two of three trusted people can open, and leave your family a recovery plan they can actually understand.

> Built for the Satoshi Sister Circle Sovereign Stack Hackathon. The vault runs on Bitcoin **signet**, the public test network, so you can try every step with free coins.

**Live demo:** https://family-vault-eight-phi.vercel.app

---

## The problem

When a spouse dies or a key is lost, the remaining family can lose access to family bitcoin. Self-custody is powerful, but a single key is a single point of failure, and the instructions are written for engineers, not families.

## The idea

Three keys. **Any two** open the vault. One key alone never can.

- Lose one key? The family can still recover.
- One person alone can't move the money.
- A plain-language recovery plan tells your family exactly what to do.

## What you can do in the app

1. **Learn:** tap any two keys and watch the vault open.
2. **Set up:** a 5-step guided wizard creates three keys and a real 2-of-3 signet vault address.
3. **Fund:** send coins from a signet faucet to the vault. The page detects the deposit by itself.
4. **Recover:** pick any two keys, choose a destination, and the app signs and broadcasts a real signet transaction.
5. **Recovery plan:** fill in who holds each key and where it's kept, then print it or save it as a PDF.
6. **Family Recovery Pack:** an optional printable emergency card and yearly checklist, unlocked with a 21 sat Lightning payment through Flash.

The whole app is designed phone-first and works on phones, tablets and desktops.

## Try it in 2 minutes

1. Open the [live app](https://family-vault-eight-phi.vercel.app) and tap **Create your vault**.
2. Choose **Create a software key** for all three keys, then **Create my vault**.
3. Open **Add funds**, copy the address, and paste it into any **signet faucet**.
4. Wait for the "Deposit received" message, then open **Recover**, choose any two keys, and tap **Recover funds**.
5. Open the transaction on the signet explorer to see it confirmed.

> Keep everything in **one browser tab**. The software keys live only in that tab, so closing it removes them.

## What is real, and what is not yet

| Part | Status |
| --- | --- |
| Key generation, 2-of-3 address, signing, broadcast | **Real**, on signet |
| Balance and deposit detection | **Real**, via the public signet explorer |
| Recovery plan document | **Real**, personalised, printable |
| Flash pack payment | **Real** Lightning invoice from Flash (21 sats to the project's Flash wallet). Unlocking relies on the payer's confirmation for now. |
| Trezor connection | **Designed but not tested on a device.** The button explains this. |

## How it works

- Each key is a standard BIP39 seed with a BIP32 multisig account path (`m/48'/1'/0'/2'`).
- The vault is a native SegWit **2-of-3 multisig** (P2WSH) built from the three public keys, so the address is the same whatever order the keys are added in.
- Recovery builds a transaction that spends the vault's coins, signs it with any two of the three keys, and broadcasts it to signet.
- Key creation and signing run in the browser. Only public data (addresses, balances, the final transaction) touches the network.
- One small serverless function (`api/invoice.js`) fetches a Lightning invoice from Flash. It uses only a public Lightning address and handles no keys or user data.

## Privacy and security

- **No accounts, no database, and no server that ever sees a key.**
- Software keys are created in your browser and kept only in that browser tab. On signet they hold no real value.
- The site sends security headers, including a strict content-security policy that limits scripts to the site itself and network calls to the signet explorer.
- Real funds belong on a hardware wallet. This project is a prototype for **signet coins**. Please don't use it with real bitcoin.

## Roadmap

- Test the Trezor connection on a physical device and ship it as a supported key source
- Automatic payment confirmation for the Flash pack
- Deposit and recovery notifications for key holders
- Multiple vaults and shareable, key-free recovery guides
- Plain-language guides in more languages, starting with Swahili

## Tech

React, Vite, Tailwind CSS v4, React Router, `@scure/btc-signer`, `@scure/bip32`, `@scure/bip39`, mempool.space signet API, Flash Lightning payments, deployed on Vercel.

## Run it locally

```bash
git clone https://github.com/anyangoowino/family-vault.git
cd family-vault
npm install
npm run dev
```

Then open http://localhost:5173. The Flash invoice only loads on the deployed site, because the serverless function runs on Vercel.

## Team

- **Hellen Anyango:** developer
- **Thato Khumalo:** team member

## Credits

Built for the Satoshi Sister Circle Sovereign Stack Hackathon. Thanks to the organizers and sponsors, including Trezor and Flash.