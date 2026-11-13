# Family Vault 🛡️

**A self-custody inheritance planner for families.** Set up a shared bitcoin vault that any two of three trusted people can open, and leave your family a recovery plan they can actually understand.

> Built for the Satoshi Sister Circle hackathon. Practice mode runs on Bitcoin **signet** (test coins with no real value).

**Live demo:** _add your Vercel link here_

---

## The problem

When a spouse dies or a key is lost, women can lose access to family bitcoin. Self-custody is powerful, but a single key is a single point of failure, and the instructions are written for engineers, not families.

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

## Try it in 2 minutes

1. Open the app and tap **Create a test vault**.
2. Choose **Use a test key** for all three keys, then **Create my test vault**.
3. Open **Add funds**, copy the address, and paste it into any **signet faucet**.
4. Wait for the "Test funds received" message, then open **Recover**, choose any two keys, and tap **Recover funds**.
5. Open the transaction on the signet explorer to see it confirmed.

## What is real, and what is a demo

| Part | Status |
| --- | --- |
| Key generation, 2-of-3 address, signing, broadcast | **Real**, on signet |
| Balance and deposit detection | **Real**, via the public signet explorer |
| Recovery plan document | **Real**, personalised, printable |
| Trezor connection | **Designed but not tested on a device.** The button explains this. |
| Flash / Lightning payment in the Flash pack | **Demo only.** No real sats move. |

## Privacy and security

- **No server and no account.** Everything runs in your browser.
- Practice keys are created in your browser and kept only in that browser tab. Closing the tab removes them. They are test keys with no real value.
- Real funds should use a hardware wallet. This project is a prototype for **signet test coins only**. Don't use it with real bitcoin.

## Tech

React, Vite, Tailwind CSS v4, React Router, `@scure/btc-signer`, `@scure/bip32`, `@scure/bip39`, mempool.space signet API.

## Run it locally

```bash
git clone https://github.com/anyangoowino/family-vault.git
cd family-vault
npm install
npm run dev
```


## Credits

Built  for the Satoshi Sister Circle hackathon. Thanks to the organizers and sponsors, including Trezor and Flash.