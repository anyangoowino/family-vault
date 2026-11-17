// Vercel serverless function: asks Flash for a Lightning invoice (LNURL-pay).
// It only uses the public Lightning address, so no secret keys are involved.
const ADDRESS = "hao@flashapp.me";
const AMOUNT_SATS = 21;

export default async function handler(req, res) {
  try {
    const [name, domain] = ADDRESS.split("@");
    const options = {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    };

    const metaResponse = await fetch(
      `https://${domain}/.well-known/lnurlp/${name}`,
      options,
    );
    if (!metaResponse.ok)
      throw new Error("Flash did not answer the payment request.");
    const info = await metaResponse.json();
    if (info.status === "ERROR" || !info.callback) {
      throw new Error(info.reason || "Flash returned no payment details.");
    }

    const msats = AMOUNT_SATS * 1000;
    if (msats < info.minSendable || msats > info.maxSendable) {
      throw new Error(
        "The pack price is outside what this Flash address accepts.",
      );
    }

    const callback = new URL(info.callback);
    callback.searchParams.set("amount", String(msats));
    const invoiceResponse = await fetch(callback, options);
    const data = await invoiceResponse.json();
    if (!data.pr)
      throw new Error(data.reason || "Flash did not return an invoice.");

    res.setHeader("Cache-Control", "no-store");
    res
      .status(200)
      .json({ invoice: data.pr, amount: AMOUNT_SATS, to: ADDRESS });
  } catch (error) {
    res.status(502).json({ error: error.message || "Could not reach Flash." });
  }
}
