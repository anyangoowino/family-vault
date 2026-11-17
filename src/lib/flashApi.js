export const FLASH_ADDRESS = "hao@flashapp.me";

// Asks our small server function for a real Lightning invoice from Flash.
export async function createLightningInvoice() {
  const response = await fetch("/api/invoice");
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.invoice) {
    throw new Error(
      data.error || "We couldn’t get a payment request from Flash.",
    );
  }
  return data;
}
