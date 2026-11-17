export default async function handler(req, res) {
  const address = String(req.query.address || "");
  if (!/^tb1[a-z0-9]{20,90}$/.test(address)) {
    return res.status(400).json({ error: "Invalid signet address." });
  }
  try {
    const r = await fetch(
      `https://mempool.space/signet/api/address/${address}/utxo`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!r.ok) {
      return res
        .status(502)
        .json({ error: "The signet explorer returned an error." });
    }
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(await r.json());
  } catch {
    return res
      .status(504)
      .json({ error: "The signet network isn't answering. Try again." });
  }
}
