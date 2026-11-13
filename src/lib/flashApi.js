const wait = (ms = 650) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createLightningInvoice(amount = 21) {
  await wait(500);
  return { invoice: `lnbc${amount}n1familyvaultflashpack`, amount };
}

export async function payWithFlash(invoice) {
  await wait(800);
  return { paid: true, invoice, receipt: "flash-receipt-021" };
}

export async function getFlashWalletAddress() {
  await wait(400);
  return { address: "bc1qflash8family2wallet4safe9home" };
}
