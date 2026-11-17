export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only." });
  }
  const hex = req.body?.hex;
  if (!/^[0-9a-fA-F]{20,200000}$/.test(hex || "")) {
    return res.status(400).json({ error: "Invalid transaction." });
  }
  try {
    const r = await fetch("https://mempool.space/signet/api/tx", {
      method: "POST",
      body: hex,
      signal: AbortSignal.timeout(8000),
    });
    const text = await r.text();
    if (!r.ok) {
      return res
        .status(400)
        .json({ error: text || "The network rejected this transaction." });
    }
    return res.status(200).json({ txid: text });
  } catch {
    return res
      .status(504)
      .json({ error: "The signet network isn't answering. Try again." });
  }
}
