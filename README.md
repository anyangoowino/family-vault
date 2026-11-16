# Family Vault

**A self-custody inheritance planner for families.** Set up a shared bitcoin vault that any two of three trusted people can open, and leave your family a recovery plan they can actually understand.

> Built for the Satoshi Sister Circle Sovereign Stack Hackathon. Practice mode runs on Bitcoin **signet** (test coins with no real value).

**Live demo:** https://family-vault-eight-phi.vercel.app

---

## The problem

When a spouse dies or a key is lost, one or remaining family can lose access to family bitcoin. Self-custody is powerful, but a single key is a single point of failure, and the instructions are written for engineers, not families.

## The idea

Three keys. **Any two** open the vault. One key alone never can.

- Lose one key? The family can still recover.
- One person alone can't move the money.
- A plain-language recovery plan tells your family exactly what to do.

## What you can do in the app

1. **Learn:** tap any two keys and watch the vault open.
2. **Set up:** a 5-step guided wizard creates three keys and a real 2-of-3 signet vault address.
3. **Fund:** send free test coins to the vault. The page detects the deposit by itself.
4. **Recover:** pick any two keys, choose a destination, and the app signs and broadcasts a real signet transaction.
5. **Recovery plan:** fill in who holds each key and where it's kept, then print it or save it as a PDF.
6. **Flash pack (demo):** an optional printable emergency card and yearly checklist, unlocked with a demo Lightning payment.

The whole app works on phones, tablets and desktops.

## Try it in 2 minutes

1. Open the [live app](https://family-vault-eight-phi.vercel.app) and tap **Create a test vault**.
2. Choose **Use a test key** for all three keys, then **Create my test vault**.
3. Open **Add funds**, copy the address, and paste it into any **signet faucet**.
4. Wait for the "Test funds received" message, then open **Recover**, choose any two keys, and tap **Recover funds**.
5. Open the transaction on the signet explorer to see it confirmed.

> Keep everything in **one browser tab**. The practice keys live only in that tab, so closing it removes them.

## What is real, and what is a demo

| Part | Status |
| --- | --- |
| Key generation, 2-of-3 address, signing, broadcast | **Real**, on signet |
| Balance and deposit detection | **Real**, via the public signet explorer |
| Recovery plan document | **Real**, personalised, printable |
| Trezor connection | **Designed but not tested on a device.** The button explains this. |
| Flash / Lightning payment in the Flash pack | **Demo only.** No real sats move. |

## How it works

- Each key is a standard BIP39 seed with a BIP32 multisig account path (`m/48'/1'/0'/2'`).
- The vault is a native SegWit **2-of-3 multisig** (P2WSH) built from the three public keys, so the address is the same whatever order the keys are added in.
- Recovery builds a transaction that spends the vault's coins, signs it with any two of the three keys, and broadcasts it to signet.
- All of this runs in the browser. Only public data (addresses, balances, the final transaction) touches the network.

## Privacy and security

- **No server, no account, no database.** Nothing is stored remotely.
- Practice keys are created in your browser and kept only in that browser tab. They are test keys with no real value.
- The site sends security headers, including a strict content-security policy that limits scripts to the site itself and network calls to the signet explorer.
- Real funds belong on a hardware wallet. This project is a prototype for **signet test coins only**. Please don't use it with real bitcoin.

## Roadmap

- Test the Trezor connection on a physical device and ship it as a supported key source
- Real Lightning payments for the Flash pack
- Deposit and recovery notifications for key holders
- Multiple vaults and shareable, key-free recovery guides
- Plain-language guides in more languages, starting with Swahili

## Tech

React, Vite, Tailwind CSS v4, React Router, `@scure/btc-signer`, `@scure/bip32`, `@scure/bip39`, mempool.space signet API, deployed on Vercel.

## Run it locally

```bash
git clone https://github.com/anyangoowino/family-vault.git
cd family-vault
npm install
npm run dev
```

Then open http://localhost:5173.

## Team

- **Hellen Anyango:** developer
- **Thato:** team member

## Credits

Built for the Satoshi Sister Circle Sovereign Stack Hackathon. Thanks to the organizers and sponsors, including Trezor and Flash.
