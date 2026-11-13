import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QrCode({ value, size = 180 }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      color: { dark: "#12284C", light: "#FFFFFF" },
    }).then(setSrc);
  }, [value, size]);
  return src ? (
    <img
      src={src}
      width={size}
      height={size}
      alt="Scannable QR code"
      className="rounded-xl"
    />
  ) : (
    <div
      className="animate-pulse rounded-xl bg-navy/8"
      style={{ width: size, height: size }}
    />
  );
}
