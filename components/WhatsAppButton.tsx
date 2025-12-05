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
  const phone = "916006491824"; // your WhatsApp number

  const message = encodeURIComponent(
    `Hello, I want to order:\n${productName}\nColor: ${
      color ?? "Default"
    }\n${
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
      className={`
        flex items-center justify-center 
        gap-2
        w-full h-12
        rounded-lg
        bg-green-600 text-white 
        font-medium text-sm
        shadow-md
        hover:bg-green-700 
        hover:shadow-lg
        transition-all
        ${className}
      `}
    >
      <span className="text-lg">💬</span>
      Order on WhatsApp
    </a>
  );
}
