"use client";

type Props = {
  productName: string;
  color?: string;
  measurements?: Record<string, string> | null;
  className?: string;
};

export default function WhatsAppOrder({
  productName,
  color,
  measurements,
  className = "",
}: Props) {
  const phone = "916006491824"; // your number

  const message = encodeURIComponent(
    `Hello, I want to order:\n${productName}\nColor: ${color ?? "Default"}\n${
      measurements
        ? "\nMeasurements:\n" +
          Object.entries(measurements)
            .map(([k, v]) => `• ${k}: ${v}`)
            .join("\n")
        : ""
    }`
  );

  const link = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`whatsapp-btn ${className}`}
    >
      <span className="whatsapp-icon">💬</span>
      Order on WhatsApp
    </a>
  );
}
